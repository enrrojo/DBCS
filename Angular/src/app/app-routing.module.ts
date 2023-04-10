import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserEditComponent } from './user-edit/user-edit.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { BookCalendarComponent } from './book-calendar/book-calendar.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { BookListComponent } from './book-list/book-list.component';
import { LogedGuard } from './shared/guard/loged.guard';
import { HostGuard } from './shared/guard/host.guard';
import { GuestGuard } from './shared/guard/guest.guard';

const routes: Routes = [
  // Api usuarios
  {path: 'users', component:UserListComponent, canActivate: [LogedGuard]},
  {path: 'users/:id/edit', component:UserEditComponent, canActivate: [LogedGuard]},
  {path: 'users/new', component:UserEditComponent, canActivate: [LogedGuard]},
  // Api reservas
  {path: 'book', component:BookListComponent , canActivate: [LogedGuard] },
  {path: 'book/availability', component:BookCalendarComponent , canActivate: [LogedGuard]},
  {path: 'book/:id/edit', component:BookEditComponent , canActivate: [LogedGuard] && [HostGuard]},
  {path: 'book/new', component:BookEditComponent , canActivate: [LogedGuard] && [GuestGuard]},
  // Api autenticacion
  {path: 'login', component:UserLoginComponent},
  {path: '**', redirectTo:'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}


