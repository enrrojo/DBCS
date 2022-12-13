import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserEditComponent } from './user-edit/user-edit.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { LogedGuard } from './shared/guard/loged.guard';

const routes: Routes = [
  {path: 'users', component:UserListComponent, canActivate: [LogedGuard]},
  {path: 'users/:id/edit', component:UserEditComponent, canActivate: [LogedGuard]},
  {path: 'users/new', component:UserEditComponent, canActivate: [LogedGuard]},
  {path: 'login', component:UserLoginComponent},
  {path: '**', redirectTo:'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}


