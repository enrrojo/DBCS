import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../model/app.model';
import { AutenticateService } from '../service/autenticate.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  
  constructor(private router:Router, private autenticate: AutenticateService){}

  /**
   * Indica si se permite el acceso a la ruta
   * @param route 
   * @param state 
   * @returns true si se permite, de lo contrario false
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    // Comprueba si es guest, si no vuelve al listado de reservas

    if(JSON.parse(this.autenticate.getUser()).role == "guest"){
      return true;
    }
    else{
      this.router.navigate(['book']);
      return false;
    }
    
  }
  
}