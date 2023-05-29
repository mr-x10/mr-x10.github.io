import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  constructor(private http: HttpClient, private router: Router) { }

  sendPin(email: String): Observable<any> {
    return this.http.post("http://localhost:8080/api/v1/users/password-reset", {"email": email});
  };

  navigateToPin(email: String) {
    this.router.navigateByUrl(`/password-reset/code?email=${email}`);
  };

  navigateToNewPassword(email: String, pin: Number) {
    this.router.navigateByUrl(`/password-reset/new?email=${email}&pin=${pin}`);
  };

  checkPin(email: String, pin: Number): Observable<any> {
    return this.http.get(`http://localhost:8080/api/v1/users/password-reset?email=${email}&pin=${pin}`);
  };

  changePassword(email: String, pin: Number, newPassword: String): Observable<any> {
    return this.http.patch("http://localhost:8080/api/v1/users/password-reset", {"email": email, "pin": pin, "password": newPassword});
  };
}
