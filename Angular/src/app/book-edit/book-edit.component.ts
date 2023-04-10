import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reserva, Role, Status } from '../shared/model/app.model';
import { ApiRestClientService } from '../shared/service/api-rest-client.service';
import { AutenticateService } from '../shared/service/autenticate.service';
import { DataService } from '../shared/service/data.service';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {

  reservaEmpty= {};

  operacion!: String;
  id!:String;
  reserva = this.reservaEmpty as Reserva;
  listStatus = Object.values(Status).filter(value => typeof value === 'string');
  guest = JSON.parse(this.autenticate.getUser()).role == "guest";

  constructor(private ruta: ActivatedRoute, private router: Router, private apiRestClient: ApiRestClientService, private datos: DataService, private autenticate: AutenticateService) { }

  ngOnInit(): void {
    console.log("En editar-reserva");

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

         this.apiRestClient.getBook(this.id).subscribe( // Leemos de la base de datos vía API
        
        resp => {
          this.reserva = resp.body!; // No comprobamos “status”. El user que existe seguro
                                  // Se usa “!” por la misma razón que antes
        },
        err => {
          console.log("Error al traer la reserva: " + err.message);
          throw err;
        }
        ) 
      }
  }
  onSubmit(){
    console.log("Enviado formulario");
    if (this.id) { // si existe id estamos en edicion, si no en añadir
      this.apiRestClient.modifyBook(String(this.reserva.id), this.reserva).subscribe(
      resp => {
        if (resp.status < 400) { // Si no hay error en la operacion por parte del servicio
          this.datos.cambiarMostrarMensaje(true);
          this.datos.cambiarMensaje(resp.body); // Mostramos el mensaje enviado por el API
        } else {
          this.datos.cambiarMostrarMensaje(true);
          this.datos.cambiarMensaje("Error al modificar comentario");
        }
        this.router.navigate(['book']); // Volvemos a la vista 1 (listado de reservas)
      },
      err=> {
      console.log("Error al editar: " + err.message);
      throw err;
      }
      )
    } else { // Parte de añadir reserva

      this.apiRestClient.addBook(this.reserva).subscribe(
      resp => {
      if (resp.status < 400) {
        this.datos.cambiarMostrarMensaje(true);
        this.datos.cambiarMensaje(resp.body); // Mostramos el mensaje retornado por el API
      } else {
        this.datos.cambiarMostrarMensaje(true);
        this.datos.cambiarMensaje("Error al añadir reserva");
      }
      this.router.navigate(['book']);
    },
      err=> {
        console.log("Error al editar: " + err.message);
        throw err;
      }
      )
    }
  }

}
