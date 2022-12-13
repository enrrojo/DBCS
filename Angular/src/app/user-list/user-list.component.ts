import { Component, OnInit } from '@angular/core';
import { ApiRestClientService } from '../shared/service/api-rest-client.service';
import { AutenticateService } from '../shared/service/autenticate.service';
import { User } from '../shared/model/app.model';
import { DataService } from '../shared/service/data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {

  Users!: User[];  
  form!: FormGroup;
  User!: User;
  idSearch!: string;
  mostrarMensaje!: boolean;
  mensaje!: string;
  usersBoxId: Number[] = [];
  checked!: boolean;
  index!: number;
  // Informacion del usuario de la sesion actual
  name: string = JSON.parse(this.autenticate.getUser()).name;
  email: string = JSON.parse(this.autenticate.getUser()).email;
  role: string = JSON.parse(this.autenticate.getUser()).role;

  constructor(private router: Router, private apiRestClient: ApiRestClientService, private datos: DataService, private autenticate: AutenticateService) { }

  /**
   * Al abrirse el componente buscara la lista de usuarios
   */
  ngOnInit(): void {
    this.getUsers_AccesoResponse();
  }

  /**
   * Solicita la lista de usuarios a apiRestClient
   */
  getUsers_AccesoResponse() {
    this.usersBoxId = [];
    this.apiRestClient.getAllUsers().subscribe(
      resp =>{
        //console.log("Cabeceras: " + resp.headers.keys());
        //console.log("Status: " + resp.status);
        if (resp.status < 400 ) { // Si no hay error en la respuesta
          this.Users = resp.body!; // se accede al cuerpo de la respuesta
        } else {
          this.mensaje = 'Error al acceder a los datos';
          this.mostrarMensaje = true;
        }
      },
      err => {
        console.log("Error al traer la lista: " + err.message);
        throw err;
      }
    )
  }

  /**
   * Manda una solicitud de eliminar usuario a apiRestClient
   * @param id numerico del usuario
   */
  delete(id: Number) {
    this.usersBoxId = [];
    this.mostrarMensaje = false;
    this.apiRestClient.deleteUser(String(id)).subscribe(
      resp => {
        if (resp.status < 400) { // Si no hay error en la respuesta
          // actualizamos variable compartida
          this.mostrarMensaje = true;
          // actualizamos variable compartida
          this.mensaje = resp.body; // mostramos el mensaje retornado por el API
          //Actualizamos la lista de users en la vista
          this.getUsers_AccesoResponse();
        } else {
          this.mostrarMensaje = true;
          this.mensaje = "Error al eliminar registro";
        }
      },
      err=> {
        console.log("Error al borrar: " + err.message);
        throw err;
      }     
    )
  }

  /**
   * Solicita la lista de usuarios segun su estado "enable" a apiRestClient
   * @param enable estado de los usuarios a solicitar, como boolean
   */
  getEnabled(enable: boolean) {
    this.usersBoxId = [];
    this.mostrarMensaje = false;

    this.apiRestClient.getUserEnable(enable).subscribe(
      resp =>{
        //console.log("Cabeceras: " + resp.headers.keys());
        //console.log("Status: " + resp.status);
        if (resp.status < 400 ) { // Si no hay error en la respuesta
          this.Users = resp.body!; // se accede al cuerpo de la respuesta         
        } else {
          this.mensaje = 'Error al acceder a los datos';
          this.mostrarMensaje = true;
        }
      },
      err => {
        console.log("Error al traer la lista: " + err.message);
        throw err;
      }
    )
  }

  /**
   * Solicita un solo usuario, segun un id numerico ubicado en idSearch o un email contiene letras.
   * Solicita a apiRestClient
   */
  getUser() {
    this.usersBoxId = [];
    this.mostrarMensaje = false;
    // Control de entradas vacias
    if (this.idSearch == null){
      this.mensaje = 'Please, enter a numeric id or email';
      this.mostrarMensaje = true;
    }
    else if (!isNaN(Number(this.idSearch))){
      this.apiRestClient.getUser(this.idSearch).subscribe(
        resp =>{
          //console.log("Cabeceras: " + resp.headers.keys());
          //console.log("Status: " + resp.status);
          if (resp.status < 400 ) { // Si no hay error en la respuesta
            // En caso de que el usuario existe se añade a la lista
            if (resp.body != null){
              this.Users = [];
              this.Users.push(resp.body!); // se accede al cuerpo de la respuesta  
            }
            // Si no existe se avisa
            else{
              this.mensaje = 'The user id does not exist';
              this.mostrarMensaje = true;
            }
            
          } else {
            this.mensaje = 'Error al acceder a los datos';
            this.mostrarMensaje = true;
          }
        },
        err => {
          console.log("Error al traer la lista: " + err.message);
          throw err;
        }
      )
      } else {
        this.apiRestClient.getUserByEmail(this.idSearch).subscribe(
          resp =>{
            //console.log("Cabeceras: " + resp.headers.keys());
            //console.log("Status: " + resp.status);
            if (resp.status < 400 ) { // Si no hay error en la respuesta
              // En caso de que el usuario existe se añade a la lista
              if (resp.body != null){
                this.Users = [];
                this.Users.push(resp.body!); // se accede al cuerpo de la respuesta  
              }
              // Si no existe se avisa
              else{
                this.mensaje = 'The user email does not exist';
                this.mostrarMensaje = true;
              }
              
            } else {
              this.mensaje = 'Error al acceder a los datos';
              this.mostrarMensaje = true;
            }
          },
          err => {
            console.log("Error al traer la lista: " + err.message);
            throw err;
          }
        )
      }
  }

  /**
   * Añade un id numerico de un usuario a usersBoxId cada vez que se pulsa una checkbox
   * 
   * @param id id del usuario
   */
  addUserToBox(id: Number){
    this.mostrarMensaje = false;
    this.checked = false;

    // Comprueba si el id ya estaba en la lista
    for(let i = 0; i < this.usersBoxId.length; i++){
      if(this.usersBoxId.at(i) == id){
        this.checked = true;
        this.index = i;
      }
    }
    // Si estaba lo elimina
    if (this.checked){
      this.usersBoxId.splice(this.index, 1);
    }
    // Si no lo agrega a la lista
    else{
      this.usersBoxId.push(id)
    }

  }

  /**
   * Pone una lista de usuarios con el estado enable = true
   * la lista de usuarios es usersBoxId
   */
  setEnabled() {
    this.mostrarMensaje = false;

    this.apiRestClient.makeUserEnabled((this.usersBoxId.map(String))).subscribe(
      resp =>{
        //console.log("Cabeceras: " + resp.headers.keys());
        //console.log("Status: " + resp.status);
        if (resp.status < 400 ) { // Si no hay error en la respuesta
          this.mensaje = resp.body!; // se accede al cuerpo de la respuesta
          this.mostrarMensaje = true;
          this.getUsers_AccesoResponse();
          // Vacia la lista
          this.usersBoxId = [];
        } else {
          this.mensaje = 'Error al acceder a los datos (make enabled)';
          this.mostrarMensaje = true;
        }
      },
      err => {
        console.log("Error al traer la lista: " + err.message);
        throw err;
      }
    )
  }

  /**
   * Pone una lista de usuarios con el estado enable = false
   * la lista de usuarios es usersBoxId
   */
  setDisabled() {
    this.mostrarMensaje = false;

    this.apiRestClient.makeUserDisabled((this.usersBoxId.map(String))).subscribe(
      resp =>{
        //console.log("Cabeceras: " + resp.headers.keys());
        //console.log("Status: " + resp.status);
        if (resp.status < 400 ) { // Si no hay error en la respuesta
          this.mensaje = resp.body!; // se accede al cuerpo de la respuesta
          this.mostrarMensaje = true;
          this.getUsers_AccesoResponse();
          // Vacia la lista
          this.usersBoxId = [];
        } else {
          this.mensaje = 'Error al acceder a los datos (make disabled)';
          this.mostrarMensaje = true;
        }
      },
      err => {
        console.log("Error al traer la lista: " + err.message);
        throw err;
      }
    )
  }

  /**
   * Elimina el token y la informacion del usuario
   */
  logout() {
    this.usersBoxId = [];
    this.mostrarMensaje = false;
    this.autenticate.logOut();
    this.router.navigate(['/login']);
    window.location.reload();
  }
  
}
