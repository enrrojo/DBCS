import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AutenticateService } from './autenticate.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(
    private authService: AutenticateService
  ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      
      if (request.url.includes(environment.apiURL)) {
        if(this.authService.getToken()){
          const token: string = this.authService.getToken()!; 

          const params = request.params;
          let headers = request.headers;

          if (token) {
            // set the accessToken to your header
            headers = headers.set('Authorization', 'Bearer ' + token);
          }

          request = request.clone({
            params,
            headers
          });
        }

        }

      return next.handle(request);
    }
}