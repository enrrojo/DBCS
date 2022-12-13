import { Component, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';
import { User, Role } from '../shared/model/app.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiRestClientService } from '../shared/service/api-rest-client.service';
import { Observable } from 'rxjs';
import { DataService } from '../shared/service/data.service';
import { AutenticateService } from '../shared/service/autenticate.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  email!: string;
  password!: string;
  mensaje!: string;
  mostrarMensaje!: boolean;

  constructor(private router: Router, private apiRestClient: ApiRestClientService, private datos: DataService, private autenticate: AutenticateService) { }

  ngOnInit(): void {
    this.datos.cambiarMostrarMensaje(false);
    this.datos.cambiarMensaje("En login")
    
  }

  /**
   * Envia al api rest de autentificacion el email y contraseña para verificar si es correcto, si lo es le devuelve un token JWT,
   * si es incorrecto un error 403
   */
  onSubmit(){
    
    this.datos.cambiarMostrarMensaje(false);
    this.mostrarMensaje = false;

    // Comprueba los campos nulos
    if (this.email!= null && this.password != null){
      // Peticion al api de autentificacion
      this.apiRestClient.loginUser(this.email, this.password).subscribe(
        resp => {       
          this.datos.cambiarMostrarMensaje(true);
          // Respuesta con exito
          if (resp.status < 400 ) {
            // Establece el token
            this.autenticate.setToken(resp.body);
            // Establece los datos del usuario decodificados, como JSON en string
            this.autenticate.setUser(JSON.stringify(jwt_decode(resp.body)));

            this.router.navigate(['users']);

          }
        },
          err=> {
            if (err.status == 403){
              this.mostrarMensaje = true;
              this.mensaje = "Email o password incorrectos";
            }
            else {
              throw err;
            }
            
          }
      )
    }
  }

}
