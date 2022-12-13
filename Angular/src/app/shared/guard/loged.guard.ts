import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticateService } from '../service/autenticate.service';


@Injectable({
  providedIn: 'root'
})
export class LogedGuard implements CanActivate {

  constructor(private router:Router, private autenticate: AutenticateService){}

  /**
   * Indica si se permite el acceso a la ruta
   * @param route 
   * @param state 
   * @returns true si se permite, de lo contrario false
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    // Si hay token permite el acceso, de lo contrario lo denega y redirige a la pantalla de login
    if(this.autenticate.getToken()){
      return true;
    }
    else{
      this.router.navigate(['login']);
      return false;
    }
    
  }
}
