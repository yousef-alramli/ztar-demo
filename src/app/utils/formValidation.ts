import { FormGroup } from "@angular/forms";

import { RegistryErrors, ValidationError, registryForm } from "../types/registry.types";

const errorTypes: RegistryErrors = {
  required: 'This field is required',
  email: 'Please add a valid email',
  minlength: 'Must be {num} characters or more',
  passwordsMismatch: 'Passwords do not match',
}

/**
 * Validate all form fields
 * @param {FormGroup} form the form to validate
 * @returns an object contains all validation errors
 */
export function validateForm(form: FormGroup) {
  const errorObject: registryForm = {};

  Object.keys(form.controls).forEach((key: string) => {
    const controlErrors: ValidationError = form.get(key)?.errors;
    console.log('controlErrors >>>', controlErrors);
    if (controlErrors) {
      Object.keys(controlErrors).forEach((keyError: string) => {
        console.log('keyError >>>', keyError);

        if (keyError === 'minlength') {
          const minNum: number = controlErrors[keyError].requiredLength;
          errorObject[key as keyof registryForm] = errorTypes[keyError].replace('{num}', minNum.toString());
        } else {
          errorObject[key as keyof registryForm] = errorTypes[keyError as keyof ValidationError]
        }
      });
    }
  });

  // Check for password and confirm password if there's no password error
  if (
    !errorObject.password &&
    !errorObject.confirmPassword &&
    form.controls['password'].value !== form.controls['confirmPassword'].value
  ) {
    errorObject.confirmPassword = errorTypes.passwordsMismatch;
  }

  return errorObject
}