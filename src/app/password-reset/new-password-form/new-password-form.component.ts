import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PasswordResetService } from '../password-reset.service';
import { UtilsService } from 'src/app/utils.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-password-form',
  templateUrl: './new-password-form.component.html',
  styleUrls: ['./new-password-form.component.scss']
})
export class NewPasswordFormComponent implements OnInit {

  constructor(private passwordResetService: PasswordResetService, private utilsService: UtilsService, private route: ActivatedRoute) {}

  email: String | null = null;
  pin: Number | null = null;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe({
      next: (queryParams) => {
        this.email = queryParams.get('email');
        this.pin = Number(queryParams.get('pin'));
      }
    });
  }

  firstPasswordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_~])([a-zA-Z0-9!@#$%^&*()_~]+)$/;
  secondPasswordPattern = /^[a-zA-Z0-9!@#$%^&*()_~]*$/;

  newPasswordForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(28), Validators.pattern(this.firstPasswordPattern), Validators.pattern(this.secondPasswordPattern)]),
    passwordConfirm: new FormControl('', [Validators.required]),
  }, {
    validators: passwordsMatchValidator()
  });

  isResetingPassword = false;
  hidePassword = true;
  hidePasswordConfirm = true;

  getPasswordErrorMessage(): String {
    const passwordFormControl = this.newPasswordForm.controls['password'];
    if(passwordFormControl.hasError('required')) {
      return "Password is empty.";
    } else if(passwordFormControl.hasError('minlength'||'maxlength')) {
      return "Password must be 8 ~ 28 characters.";
    } else if(passwordFormControl.hasError('pattern')) {
      const patternError = passwordFormControl.getError('pattern') as PatternError;
      if(patternError.requiredPattern == `${this.secondPasswordPattern}`) {
        return "Password can only contain A-Z, a-z, 0-9 and symbols: !@#$%^&*()_~";
      } else {
        return "Password must contain at least: One uppercase, one lowercase, one number (0-9) and one symbol: !@#$%^&*()_~"
      }
    } else if(passwordFormControl.hasError('serverError')) {
      return passwordFormControl.getError('serverError');
    } else {
      return "Unknown error occurrded.";
    }
  };

  getPasswordConfirmErrorMessage(): String {
    const passwordConfirmFormControl = this.newPasswordForm.controls['passwordConfirm'];
    if(passwordConfirmFormControl.hasError('required')) {
      return "Password is empty.";
    } else if(passwordConfirmFormControl.hasError('passwordsMismatch')) {
      return "Passwords are not the same";
    } else {
      return "Unknown error occurrded.";
    }
  };

  onResetPassword() {
    this.isResetingPassword = true;
    if(this.email !== null && this.pin !== null) {
      this.passwordResetService.changePassword(this.email, this.pin, this.newPasswordForm.controls['password'].value).subscribe({
        complete: this.onResetPasswordSuccess,
        error: this.onResetPasswordError
      });
    }
  };

  onResetPasswordSuccess = () => {
    this.isResetingPassword = false;
    if(this.email !== null && this.pin !== null) {
      alert("Password was changed successfully :)")
    }
  };

  onResetPasswordError = (error: HttpErrorResponse) => {
    this.isResetingPassword = false;
    this.utilsService.setFormControlError(this.newPasswordForm, 'password', 'serverError', error.error['error']);
  };

}

interface PatternError {
  requiredPattern: string,
  actualValue: string,
};

function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');
    if(password?.value !== passwordConfirm?.value) {
      passwordConfirm?.setErrors({ passwordsMismatch: true });
    }
    return null;
  };
}
