import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { User } from '../model/app.model';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiRestClientService {

  private static readonly BASE_URI = 'http://localhost:8080/users/';

  constructor(private http: HttpClient) { } // inyectamos el servicio HttpClient

  /**
   * Solicita la lista de todos los usuarios al REST
   * @returns lista de users
   */
  getAllUsers(): Observable<HttpResponse<User[]>> {
    let url = ApiRestClientService.BASE_URI;
    return this.http.get<User[]>(url, { observe: 'response' }); // Retorna el cuerpo de la respuesta
  }

  /**
   * Solicita un usuario concreto al REST
   * @param id del usuario
   * @returns usuer
   */
  getUser(id: String): Observable<HttpResponse<User>> {
    let url = ApiRestClientService.BASE_URI + id;
    return this.http.get<User>(url, { observe: 'response' });
  }

  /**
   * Solicita añadir un usuario al REST
   * @param user a añadir
   * @returns respuesta del servidor
   */
  addUser(user: User): Observable<HttpResponse<any>> {
    let url = ApiRestClientService.BASE_URI;
    return this.http.post(url, user, { observe: 'response', responseType: 'text'});
  }

  /**
   * Solicita la modificacion de un usuario al REST
   * @param id del usuario
   * @param user con valores modificados
   * @returns respuesta del servidor
   */
  modifyUser(id: String, user: User): Observable<HttpResponse<any>> {
    let url = ApiRestClientService.BASE_URI + id;
    return this.http.put(url, user, { observe: 'response', responseType: 'text'});
  }

  /**
   * Solicita la eliminacion de un usuario al REST
   * @param id del usuario
   * @returns respuesta del servidor
   */
  deleteUser(id: String): Observable<HttpResponse<any>> {
    let url = ApiRestClientService.BASE_URI + id;
    return this.http.delete(url, { observe: 'response', responseType: 'text'});
  }

  /**
   * Solicita la lista de usuarios segun su campo disable
   * @param enable true o false
   * @returns lista de usuarios
   */
  getUserEnable(enable: boolean): Observable<HttpResponse<User[]>> {
    let url = ApiRestClientService.BASE_URI;
    return this.http.get<User[]>(url, { params: {enable}, observe: 'response' });
  }

  /**
   * Solicita cambiar el estado enabled de una lista de usarios a true
   * @param user_id lista de ids del usuario
   * @returns respuesta del servidor
   */
  makeUserEnabled(user_id: string[]): Observable<HttpResponse<any>> {
    let url = ApiRestClientService.BASE_URI + "enable";
    return this.http.put(url, null, { params: {user_id}, observe: 'response', responseType: 'text' });
  }

    /**
   * Solicita cambiar el estado enabled de una lista de usarios a false
   * @param user_id lista de ids del usuario
   * @returns respuesta del servidor
   */
  makeUserDisabled(user_id: string[]): Observable<HttpResponse<any>> {
    let url = ApiRestClientService.BASE_URI + "disable";
    return this.http.put(url, null, { params: {user_id}, observe: 'response', responseType: 'text' });
  }

  /**
   * Solicita un usuario al servidor segun un email
   * @param email del usuario
   * @returns usuario
   */
  getUserByEmail(email: string): Observable<HttpResponse<User>> {
    let url = ApiRestClientService.BASE_URI;
    return this.http.get<User>(url, { params: {email}, observe: 'response' });
  }

  /**
   * Solicita al servidor de autentificacion la validacion de un usuario y contraseña
   * @param email del usuario
   * @param password del usuario
   * @returns token JWT
   */
  loginUser(email: string, password: string): Observable<any> {
    let url = 'http://localhost:8081/users/login';
    let body = {email, password};

    return this.http.post(url, body, { headers: {'Content-Type': 'application/json'}, observe: 'response', responseType: 'text'});
  }
}
