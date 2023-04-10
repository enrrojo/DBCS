import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { Reserva, Role, Status } from '../shared/model/app.model';
import { ApiRestClientService } from '../shared/service/api-rest-client.service';
import { AutenticateService } from '../shared/service/autenticate.service';
import { DataService } from '../shared/service/data.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  mostrarMensaje!: boolean;
  mensaje!: string;
  respuesta !: { key: string, value: Reserva[] }[];
  reservas!: Reserva[];
  guest = (JSON.parse(this.autenticate.getUser()).role) == "guest";

    // Informacion del usuario de la sesion actual
    name: string = JSON.parse(this.autenticate.getUser()).name;
    email: string = JSON.parse(this.autenticate.getUser()).email;
    role: string = JSON.parse(this.autenticate.getUser()).role;
  
  constructor(private router: Router, private apiRestClient: ApiRestClientService, private datos: DataService, private autenticate: AutenticateService) { }


  ngOnInit(): void {
    this.mostrarMensaje = false;
    this.getBookList();
  }

  getBookList(){
    this.apiRestClient.getAllBooks().pipe(
      map(response => response.body),
      map(resp => {
        return Object.entries(resp!).map(([key, value]) => ({ key, value }));
      }),
      catchError((error: HttpErrorResponse) => {
        this.mensaje = error.message;
        this.mostrarMensaje = true;
        return throwError(error);
      })
    ).subscribe(
      resp=>{
          this.respuesta = resp; // se accede al cuerpo de la respuesta
          this.reservas = this.respuesta.map(item => item.value.flat()).flat();
      },
      err => {
        console.log("Error al traer la lista: " + err.message);
        throw err;
      }
    )
  }

  showByPending(){
    this.mostrarMensaje = false;
    let key = "PENDING"
    this.reservas= this.respuesta.filter(item => item.key === key)
                  .map(item => item.value.flat()).flat();
  }
  showByConfirmed(){
    this.mostrarMensaje = false;
    let key = "CONFIRMED"
    this.reservas= this.respuesta.filter(item => item.key === key)
                  .map(item => item.value.flat()).flat();
  }
  showByCancelled(){
    this.mostrarMensaje = false;
    let key = "CANCELLED"
    this.reservas= this.respuesta.filter(item => item.key === key)
                  .map(item => item.value.flat()).flat();  
  }
}
