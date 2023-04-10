import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Reserva, User } from '../model/app.model';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiRestClientService {

  /**
   * Para implementar la api gateway serian las siguientes URI:
   * 
   *  private static readonly API_USERS_URI = 'http://localhost:8000/api/users/';
   * private static readonly API_AUTH_URI = 'http://localhost:8000/api/auth/';
   * private static readonly API_BOOK_URI = 'http://localhost:8000/api/book/';
   */

  private static readonly API_USERS_URI = 'http://localhost:8080/users/';
  private static readonly API_AUTH_URI = 'http://localhost:8081/users/';
  private static readonly API_BOOK_URI = 'http://localhost:8082/book/';

  constructor(private http: HttpClient) { } // inyectamos el servicio HttpClient

  /**
   * Solicita la lista de todos los usuarios al REST
   * @returns lista de users
   */
  getAllUsers(): Observable<HttpResponse<User[]>> {
    let url = ApiRestClientService.API_USERS_URI;
    return this.http.get<User[]>(url, { observe: 'response' }); // Retorna el cuerpo de la respuesta
  }

  /**
   * Solicita un usuario concreto al REST
   * @param id del usuario
   * @returns usuer
   */
  getUser(id: String): Observable<HttpResponse<User>> {
    let url = ApiRestClientService.API_USERS_URI + id;
    return this.http.get<User>(url, { observe: 'response' });
  }

  /**
   * Solicita añadir un usuario al REST
   * @param user a añadir
   * @returns respuesta del servidor
   */
  addUser(user: User): Observable<HttpResponse<any>> {
    let url = ApiRestClientService.API_USERS_URI;
    return this.http.post(url, user, { observe: 'response', responseType: 'text'});
  }

  /**
   * Solicita la modificacion de un usuario al REST
   * @param id del usuario
   * @param user con valores modificados
   * @returns respuesta del servidor
   */
  modifyUser(id: String, user: User): Observable<HttpResponse<any>> {
    let url = ApiRestClientService.API_USERS_URI + id;
    return this.http.put(url, user, { observe: 'response', responseType: 'text'});
  }

  /**
   * Solicita la eliminacion de un usuario al REST
   * @param id del usuario
   * @returns respuesta del servidor
   */
  deleteUser(id: String): Observable<HttpResponse<any>> {
    let url = ApiRestClientService.API_USERS_URI + id;
    return this.http.delete(url, { observe: 'response', responseType: 'text'});
  }

  /**
   * Solicita la lista de usuarios segun su campo disable
   * @param enable true o false
   * @returns lista de usuarios
   */
  getUserEnable(enable: boolean): Observable<HttpResponse<User[]>> {
    let url = ApiRestClientService.API_USERS_URI;
    return this.http.get<User[]>(url, { params: {enable}, observe: 'response' });
  }

  /**
   * Solicita cambiar el estado enabled de una lista de usarios a true
   * @param user_id lista de ids del usuario
   * @returns respuesta del servidor
   */
  makeUserEnabled(user_id: string[]): Observable<HttpResponse<any>> {
    let url = ApiRestClientService.API_USERS_URI + "enable";
    return this.http.put(url, null, { params: {user_id}, observe: 'response', responseType: 'text' });
  }

    /**
   * Solicita cambiar el estado enabled de una lista de usarios a false
   * @param user_id lista de ids del usuario
   * @returns respuesta del servidor
   */
  makeUserDisabled(user_id: string[]): Observable<HttpResponse<any>> {
    let url = ApiRestClientService.API_USERS_URI + "disable";
    return this.http.put(url, null, { params: {user_id}, observe: 'response', responseType: 'text' });
  }

  /**
   * Solicita un usuario al servidor segun un email
   * @param email del usuario
   * @returns usuario
   */
  getUserByEmail(email: string): Observable<HttpResponse<User>> {
    let url = ApiRestClientService.API_USERS_URI;
    return this.http.get<User>(url, { params: {email}, observe: 'response' });
  }

  /**
   * Solicita al servidor de autentificacion la validacion de un usuario y contraseña
   * @param email del usuario
   * @param password del usuario
   * @returns token JWT
   */
  loginUser(email: string, password: string): Observable<any> {
    let url = ApiRestClientService.API_AUTH_URI + "login";
    let body = {email, password};

    return this.http.post(url, body, { headers: {'Content-Type': 'application/json'}, observe: 'response', responseType: 'text'});
  }

  // Todas las peticiones de /book mandan el token, con RequestReceptor añade a las peticiones la cabecera 'jwt'
  
  // manda las fechas como parametro en la query
  getBooksAvailability(fechas: string[]): Observable<HttpResponse<Map<string,number>>> {
    let url = ApiRestClientService.API_BOOK_URI + "availability";
    return this.http.get<Map<string,number>>(url, { params: {fechas}, observe: 'response' }); // Retorna el cuerpo de la respuesta
  }

  getAllBooks(): Observable<HttpResponse<Map<string,Reserva[]>>> {
    let url = ApiRestClientService.API_BOOK_URI;
    return this.http.get<Map<string,Reserva[]>>(url, { observe: 'response' }); // Retorna el cuerpo de la respuesta
  }

  getBook(id: String): Observable<HttpResponse<Reserva>> {
    let url = ApiRestClientService.API_BOOK_URI + id;
    return this.http.get<Reserva>(url, { observe: 'response' }); // Retorna el cuerpo de la respuesta
  }

  addBook(reserva: Reserva): Observable<HttpResponse<any>> {
    let url = ApiRestClientService.API_BOOK_URI;
    return this.http.post(url, reserva, { observe: 'response', responseType: 'text'});
  }

  modifyBook(id: String, reserva: Reserva): Observable<HttpResponse<any>> {
    let url = ApiRestClientService.API_BOOK_URI + id;
    return this.http.put(url, reserva, { observe: 'response', responseType: 'text'});
  }
}
