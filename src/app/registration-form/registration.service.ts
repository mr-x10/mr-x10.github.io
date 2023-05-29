import { Injectable } from '@angular/core';
import { RegistrationForm } from './registration-form';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient, private router: Router) { }

  register(registrationForm: RegistrationForm): Observable<any> {
    return this.http.post("http://localhost:8080/api/v1/users/register", registrationForm);
  };

  navigateToLogin() {
    this.router.navigateByUrl('/login');
  };
}
