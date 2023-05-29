import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  setFormControlError(formGroup: FormGroup, formControlName: string, error: string, errorMessage: string) {
    formGroup.controls[formControlName].setErrors({
      [error]: errorMessage
    });
  };
}
