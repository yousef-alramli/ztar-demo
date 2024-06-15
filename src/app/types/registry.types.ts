import { ValidationErrors } from "@angular/forms";

export type ValidationError = ValidationErrors | null | undefined

export type RegistryForm = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;

  // for category create
  name?: string;
}

export type ValidationErrorMessages = {
  email: string,
  passwordsMismatch: string,
  pattern: string,
  required: string,
}

