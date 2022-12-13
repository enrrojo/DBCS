import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AutenticateService } from './shared/service/autenticate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'Users Application';
  iniciadaSesion = false;
  constructor(private router: Router, private autentication: AutenticateService ) {
    router.events.subscribe((val) => {
      if(this.autentication.getToken() != null){
        this.iniciadaSesion = true;
      }
  });
    
  }

  listOfUsers() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/users']);
   }
}
