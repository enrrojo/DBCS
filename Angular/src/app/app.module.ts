import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';

import { ApiRestClientService } from './shared/service/api-rest-client.service';
import { DataService } from './shared/service/data.service';
import { RequestInterceptor } from './shared/service/resquest-interceptor.service';
import { AutenticateService } from './shared/service/autenticate.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserLoginComponent } from './user-login/user-login.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { BookCalendarComponent } from './book-calendar/book-calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserEditComponent,
    UserLoginComponent,
    BookListComponent,
    BookEditComponent,
    BookCalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ApiRestClientService,
    DataService,
    AutenticateService,
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
