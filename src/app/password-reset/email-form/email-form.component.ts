import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordResetService } from '../password-reset.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilsService } from 'src/app/utils.service';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss']
})
export class EmailFormComponent {
  constructor(private passwordResetService: PasswordResetService, private utilsService: UtilsService) {}
  isSendingCode = false;

  emailForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.email]),
  });

  getEmailErrorMessage(): String {
    const emailFormControl = this.emailForm.controls['email'];
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

  onSendCode() {
    this.isSendingCode = true;
    this.passwordResetService.sendPin(this.emailForm.controls['email'].value).subscribe({
      complete: this.onSendingPinSuccess,
      error: this.onSendingPinError
    });
  };

  onSendingPinSuccess = () => {
    this.isSendingCode = false;
    this.passwordResetService.navigateToPin(this.emailForm.controls['email'].value);
  };

  onSendingPinError = (error: HttpErrorResponse) => {
    this.isSendingCode = false;
    this.utilsService.setFormControlError(this.emailForm, 'email', 'serverError', error.error['error']);
  };

}
