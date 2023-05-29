import { Component } from '@angular/core';

// New imports by A10XY
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, ValidationErrors, } from '@angular/forms'
import { RegistrationService } from './registration.service';
import { RegistrationForm } from './registration-form';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent {
  minDate: Date;
  maxDate: Date;
  constructor(private registrationService: RegistrationService, private utilsService: UtilsService) {
    // You must modify this later!!
    // It's day of week, not of month!!
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 53, 0, 1);
    this.maxDate = new Date(currentYear - 18, new Date().getMonth(), new Date().getDate());
  }

  hidePassword = true;
  hidePasswordConfirm = true;
  isRegistering = false;

  firstPasswordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_~])([a-zA-Z0-9!@#$%^&*()_~]+)$/;
  secondPasswordPattern = /^[a-zA-Z0-9!@#$%^&*()_~]*$/;

  registrationForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(28), Validators.pattern(this.firstPasswordPattern), Validators.pattern(this.secondPasswordPattern)]),
    passwordConfirm: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    birthday: new FormControl('', [Validators.required]),
  }, {
    validators: passwordsMatchValidator()
  });

  getFirstNameErrorMessage(): String {
    const firstNameFormControl = this.registrationForm.controls['firstName'];
    if(firstNameFormControl.hasError('required')) {
      return "First Name is empty.";
    } else if(firstNameFormControl.hasError('minlength'||'maxlength')) {
      return "First Name must be 2 ~ 50 characters."
    } else if(firstNameFormControl.hasError('serverError')) {
      return firstNameFormControl.getError('serverError');
    } else {
      return "Unknown error occurrded.";
    }
  };

  getLastNameErrorMessage(): String {
    const lastNameFormControl = this.registrationForm.controls['lastName'];
    if(lastNameFormControl.hasError('required')) {
      return "Last Name is empty.";
    } else if(lastNameFormControl.hasError('minlength'||'maxlength')) {
      return "Last Name must be 2 ~ 50 characters.";
    } else if(lastNameFormControl.hasError('serverError')) {
      return lastNameFormControl.getError('serverError');
    } else {
      return "Unknown error occurrded.";
    }
  };

  getEmailErrorMessage(): String {
    const emailFormControl = this.registrationForm.controls['email'];
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
    }
  };

  getPasswordErrorMessage(): String {
    const passwordFormControl = this.registrationForm.controls['password'];
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
    const passwordConfirmFormControl = this.registrationForm.controls['passwordConfirm'];
    if(passwordConfirmFormControl.hasError('required')) {
      return "Password is empty.";
    } else if(passwordConfirmFormControl.hasError('passwordsMismatch')) {
      return "Passwords are not the same";
    } else {
      return "Unknown error occurrded.";
    }
  };

  genders: Gender[] = [
    {value: "MALE", viewValue: "Male"},
    {value: "FEMALE", viewValue: "Female"},
  ];

  onRegister(): void {
    this.isRegistering = true;
    const birthdate = this.registrationForm.controls['birthday'].value as Date;
    const registrationForm: RegistrationForm = {
      firstName: this.registrationForm.controls['firstName'].value,
      lastName: this.registrationForm.controls['lastName'].value,
      gender: this.registrationForm.controls['gender'].value,
      birthday: birthdate.toISOString().substring(0, 10),
      email: this.registrationForm.controls['email'].value,
      password: this.registrationForm.controls['password'].value,
    };

    const res = this.registrationService.register(registrationForm);
    res.subscribe({
      complete: this.onRegistrationSuccess,
      error: this.onRegistrationError
    });
  }

  private onRegistrationSuccess = () => {
    console.log("Registered Successfully!");
    this.isRegistering = false;
    this.registrationService.navigateToLogin();
  };

  private onRegistrationError = (err: HttpErrorResponse) => {
    this.isRegistering = false;
    this.handleInputsErrors(err.error['error']);
  };

  private handleInputsErrors(error: string) {
    if(error.startsWith('Email') || error.startsWith('User')) {
      this.utilsService.setFormControlError(this.registrationForm, 'email', 'serverError', error);
    } else if(error.startsWith('First Name')) {
      this.utilsService.setFormControlError(this.registrationForm, 'firstName', 'serverError', error);
    } else if(error.startsWith('Last Name')) {
      this.utilsService.setFormControlError(this.registrationForm, 'lastName', 'serverError', error);
    } else if(error.startsWith('Password')) {
      this.utilsService.setFormControlError(this.registrationForm, 'password', 'serverError', error);
    }
  };

}

interface Gender {
  value: string;
  viewValue: string;
};

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
