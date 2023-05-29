import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// New imports by A10XY
import { LoginFormComponent } from './login-form/login-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { EmailFormComponent } from './password-reset/email-form/email-form.component';
import { PinFormComponent } from './password-reset/pin-form/pin-form.component';
import { NewPasswordFormComponent } from './password-reset/new-password-form/new-password-form.component';

const routes: Routes = [
  {path: 'login', component: LoginFormComponent},
  {path: 'register', component: RegistrationFormComponent},
  {path: 'home', component: HomeComponent},
  {path: 'password-reset', component: EmailFormComponent},
  {path: 'password-reset/new', component: NewPasswordFormComponent},
  {path: 'password-reset/code', component: PinFormComponent},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
