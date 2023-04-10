import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reserva, Status } from '../shared/model/app.model';
import { ApiRestClientService } from '../shared/service/api-rest-client.service';
import { DataService } from '../shared/service/data.service';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-book-calendar',
  templateUrl: './book-calendar.component.html',
  styleUrls: ['./book-calendar.component.css']
})
export class BookCalendarComponent implements OnInit {

  fechaInicio!: Date;
  fechaFin!: Date;
  fechaHabitaciones!: { key: string, value: number }[];
  mensaje!: string;
  mostrarMensaje!: boolean;

  constructor(private ruta: ActivatedRoute, private router: Router, private apiRestClient: ApiRestClientService, private datos: DataService) { }

  ngOnInit(): void {
    this.mostrarMensaje = false;
  }

  onSubmit(){
    this.mostrarMensaje = false;
    if (this.fechaInicio && this.fechaFin){
      if (!(this.fechaInicio > new Date()) && this.fechaFin >= this.fechaInicio){
        let date: string[] = [this.fechaInicio.toString(), this.fechaFin.toString()];
        console.log("Enviado formulario");
        this.apiRestClient.getBooksAvailability(date).pipe(
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
          resp => {
            this.fechaHabitaciones = resp;
          },
          err=> {
          console.log("Error al editar: " + err.message);
          throw err;
          }
          )
      }
    }
  }

}
