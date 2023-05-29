import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordResetService } from '../password-reset.service';
import { UtilsService } from 'src/app/utils.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pin-form',
  templateUrl: './pin-form.component.html',
  styleUrls: ['./pin-form.component.scss']
})
export class PinFormComponent implements OnInit {

  constructor(private passwordResetService: PasswordResetService, private utilsService: UtilsService, private route: ActivatedRoute) {}

  email: String | null = null;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe({
      next: (queryParams) => {
        this.email = queryParams.get('email');
      }
    });
  };

  isCheckingPin = false;
  codePattern = /^[0-9]*$/;

  pinForm: FormGroup = new FormGroup({
    pin: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(this.codePattern)]),
  });

  getPinErrorMessage(): String {
    const pinFormControl = this.pinForm.controls['pin'];
    if(pinFormControl.hasError('required')) {
      return "PIN is empty";
    } else if(pinFormControl.hasError('pattern')) {
      return "PIN can only contain digits (0-9)";
    } else if(pinFormControl.hasError('minlength'||'maxlength')) {
      return "PIN must be 6 digits";
    } else if(pinFormControl.hasError('serverError')) {
      return pinFormControl.getError('serverError');
    } else {
      return "Unknown error occurrded.";
    };
  };

  onCheckPin() {
    this.isCheckingPin = true;
    if(this.email !== null) {
      this.passwordResetService.checkPin(this.email, this.pinForm.controls['pin'].value).subscribe({
        complete: this.onCheckingPinSuccess,
        error: this.onCheckingPinError
      });
    }
  };

  onCheckingPinSuccess = () => {
    this.isCheckingPin = false;
    if(this.email !== null) {
      this.passwordResetService.navigateToNewPassword(this.email, this.pinForm.controls['pin'].value);
    }
  };

  onCheckingPinError = (error: HttpErrorResponse) => {
    this.isCheckingPin = false;
    this.utilsService.setFormControlError(this.pinForm, 'pin', 'serverError', error.error['error']);
  };

}
