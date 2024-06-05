import { ValidationErrors } from "@angular/forms";

export type ValidationError = ValidationErrors | null | undefined

export type registryForm = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export type RegistryErrors = {
  email: string,
  minlength: string,
  passwordsMismatch: string,
  required: string,
}

