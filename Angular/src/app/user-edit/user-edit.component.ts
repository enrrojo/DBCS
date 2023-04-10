import { Component, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';
import { User, Role } from '../shared/model/app.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiRestClientService } from '../shared/service/api-rest-client.service';
import { Observable } from 'rxjs';
import { DataService } from '../shared/service/data.service';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  userEmpty = {};
    
  user = this.userEmpty as User;
  id!: String; // para guardar el id del user a editar
  operacion!: String; // para guardar la operación (añadir/editar) a realizar

  listEnable = [true, false];
  selected: Role = Role.guest;
  listRole = Object.values(Role).filter(value => typeof value === 'string');
  role = Role;

  constructor(private ruta: ActivatedRoute, private router: Router, private apiRestClient: ApiRestClientService, private datos: DataService) { }

  /**
   * Al abrirse el componente se declara si es vista de editar o de nuevo usuario
   */
  ngOnInit(): void {
    console.log("En editar-user");

    // Operacion: va en el ultimo string (parte) de la URL
    this.operacion = this.ruta.snapshot.url[this.ruta.snapshot.url.length - 1].path;
      if (this.operacion == "edit") { // Si la operacion es editar se captura el id de la URL
                                        //y se trae el json con el user, para mostrarlo en el
                                        //HTML. Si no es “editar”, será “nuevo” y la operacion de
                                        //traer user no se realizara y el formulario aparecerá vacio
        console.log("En Editar");
        this.ruta.paramMap.subscribe( // Capturamos el id de la URL
          params => {
            this.id = params.get('id')!; // Se usa "!" para evitar error en compilacion.
                                         // No va a ser null nunca
          },
          err => console.log("Error al leer id para editar: " + err)
        )
        // console.log("Id: " + this.id);

        this.apiRestClient.getUser(this.id).subscribe( // Leemos de la base de datos vía API
        
        resp => {
          this.user = resp.body!; // No comprobamos “status”. El user que existe seguro
                                  // Se usa “!” por la misma razón que antes
        },
        err => {
          console.log("Error al traer el user: " + err.message);
          throw err;
        }
        )
      }
  }

  /**
   * Evento para el envio del formulario, envia a apiRestClient el nuevo usuario
   * o manda un usuario con valores editados
   */
  onSubmit() {
    console.log("Enviado formulario");
      if (this.id) { // si existe id estamos en edicion, si no en añadir
        this.apiRestClient.modifyUser(String(this.user.id), this.user).subscribe(
        resp => {
          if (resp.status < 400) { // Si no hay error en la operacion por parte del servicio
            this.datos.cambiarMostrarMensaje(true);
            this.datos.cambiarMensaje(resp.body); // Mostramos el mensaje enviado por el API
          } else {
            this.datos.cambiarMostrarMensaje(true);
            this.datos.cambiarMensaje("Error al modificar comentario");
          }
          this.router.navigate(['users']); // Volvemos a la vista 1 (listado de users)
        },
        err=> {
        console.log("Error al editar: " + err.message);
        throw err;
        }
        )
      } else { // Parte de añadir user

        this.apiRestClient.addUser(this.user).subscribe(
        resp => {
        if (resp.status < 400) {
          this.datos.cambiarMostrarMensaje(true);
          this.datos.cambiarMensaje(resp.body); // Mostramos el mensaje retornado por el API
        } else {
          this.datos.cambiarMostrarMensaje(true);
          this.datos.cambiarMensaje("Error al añadir user");
        }
        this.router.navigate(['users']);
      },
        err=> {
          console.log("Error al editar: " + err.message);
          throw err;
        }
        )
      }
    }

}
