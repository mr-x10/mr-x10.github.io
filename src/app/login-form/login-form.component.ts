import { Component } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

  constructor(private loginService: LoginService, private _snackBar: MatSnackBar, private utilsService: UtilsService) {}

  pattern = /^[a-zA-Z0-9!@#$%^&*()_~]*$/;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(28), Validators.pattern(this.pattern)]),
  });

  isLoggingIn = false;
  hidePassword = true;

  onLogin() {
    this.isLoggingIn = true;
    const email = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;
    const res = this.loginService.login(email, password);
    res.subscribe({
      complete: this.onLoginSuccess,
      error: this.onLoginError
    });
  };

  private onLoginSuccess = () => {
    this.isLoggingIn = false;
    alert("Logged in :)");
  };

  private onLoginError = (err: HttpErrorResponse) => {
    this.isLoggingIn = false;

    switch(err.status) {
      case 404: {
        console.log("404: USER NOT FOUND");
        this.utilsService.setFormControlError(this.loginForm, 'email', 'serverError', err.error['error']);
        break;
      }
      case 400: {
        console.log("400: WRONG PASSWORD");
        this.utilsService.setFormControlError(this.loginForm, 'password', 'serverError', err.error['error']);
        break;
      }
    }
  };

  getEmailErrorMessage(): String {
    const emailFormControl = this.loginForm.controls['email'];
    if(emailFormControl.hasError('required')) {
      return "Email is empty.";
    } else if(emailFormControl.hasError('minlength'||'maxlength')) {
      return "Email must be 5 ~ 100 characters.";
    } else if(emailFormControl.hasError('email')) {
      return "Email is not valid.";
    } else if(emailFormControl.hasError('serverError')) {
      return emailFormControl.getError('serverError');
    } else {
      return "Unknown error occurrded.";
    };
  };


  getPasswordErrorMessage(): String {
    const passwordFormControl = this.loginForm.controls['password'];
    if(passwordFormControl.hasError('required')) {
      return "Password is empty.";
    } else if(passwordFormControl.hasError('minlength'||'maxlength')) {
      return "Password must be 8 ~ 28 characters.";
    } else if(passwordFormControl.hasError('pattern')) {
      return "Password can only contain A-Z, a-z, 0-9 and symbols: !@#$%^&*()_~";
    } else if(passwordFormControl.hasError('serverError')) {
      return passwordFormControl.getError('serverError');
    } else {
      return "Unknown error occurrded.";
    };
  };

  openSnackBar(message: string) {
    this._snackBar.open(message, undefined, {
      duration: 3000
    });
  };

}

