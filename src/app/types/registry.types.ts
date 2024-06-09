import { ValidationErrors } from "@angular/forms";

export type ValidationError = ValidationErrors | null | undefined

export type RegistryForm = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export type ValidationErrorMessages = {
  email: string,
  passwordsMismatch: string,
  pattern: string,
  required: string,
}

