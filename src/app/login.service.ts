import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(email: String, password: String): Observable<any> {
    const user: User = {email: email, password: password};

    const headers: HttpHeaders = new HttpHeaders({
      "Access-Control-Allow-Origin": "http://localhost:4200"
    });
    const options = {
      headers: headers
    };
    return this.http.post("http://localhost:8080/api/v1/users/login", user, options);
  };

  // private handleError(error: HttpErrorResponse) {
  //   if (error.status === 0) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong.
  //     console.error(
  //       `Backend returned code ${error.status}, body was: `, error.error);
  //   }
  //   // Return an observable with a user-facing error message.
  //   return throwError(() => new Error('Something bad happened; please try again later.'));
  // }
}

export interface User {
  email: String,
  password: String,
}
