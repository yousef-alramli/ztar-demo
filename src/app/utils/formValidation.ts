import { FormGroup } from "@angular/forms";

import { ValidationError, RegistryForm, ValidationErrorMessages } from "../types/registry.types";

const validationErrorMessages: ValidationErrorMessages = {
  email: 'Please add a valid email',
  passwordsMismatch: 'Passwords do not match',
  pattern: 'Password minimum length should be 8 characters with at least 1 small letter, 1 capital letter, 1 number and 1 special character',
  required: 'This field is required',
}

/**
 * Validate all form fields
 * @param {FormGroup} form the form to validate
 * @returns an object contains all validation errors
 */
export function validateForm(form: FormGroup, isSignup: boolean = false) {
  const errorObject: RegistryForm = {};

  Object.keys(form.controls).forEach((key: string) => {
    const controlErrors: ValidationError = form.get(key)?.errors;

    if (controlErrors) {
      Object.keys(controlErrors).forEach((keyError: string) => {
        errorObject[key as keyof RegistryForm] = validationErrorMessages[keyError as keyof ValidationError];
      });
    }
  });

  // Check for password and confirm password if there's no password error
  if (
    isSignup &&
    !errorObject.password &&
    !errorObject.confirmPassword &&
    form.controls?.['password']?.value !== form.controls?.['confirmPassword']?.value
  ) {
    errorObject.confirmPassword = validationErrorMessages.passwordsMismatch;
  }

  return errorObject;
}