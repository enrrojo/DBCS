import { Injectable } from '@angular/core';
import { User } from '../model/app.model';

@Injectable({
  providedIn: 'root'
})
export class AutenticateService {

  constructor() { }

  /**
   * Elimina toda la informacion de la sesion
   */
  logOut(): void {
    window.sessionStorage.clear();
  }

  /**
   * Establece un token en la sesion
   * @param token JWT
   */
  public setToken(token: string): void {
    window.sessionStorage.removeItem('token');
    window.sessionStorage.setItem('token', token);
  }

  /**
   * Proporciona el token actual de la sesion
   * @returns token JWT
   */
  public getToken(): string | null {
    return window.sessionStorage.getItem('token');
  }

  /**
   * Establece el usuario actual de la sesion
   * @param user como JSON en string
   */
  public setUser(user: any): void {
    window.sessionStorage.removeItem('user');
    window.sessionStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Proporciona el usuario actual de la sesion
   * @returns user como JSON
   */
  public getUser(): any {
    let user = window.sessionStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    } else {
    return user;
    }
  }
}
