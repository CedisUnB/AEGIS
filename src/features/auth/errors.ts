import { EmailAlreadyExistsError, InvalidCredentialsError } from "../services/auth";
import type { SignInField, SignUpField } from "./actions";

export type AuthErrorField = SignInField | SignUpField;

export function getAuthErrorState<TField extends string = string>(
  error: unknown,
  fallbackMessage: string,
  field?: TField,
): {
  error: string | null;
  fieldErrors: Partial<Record<TField, string>>;
} {
  if (error instanceof InvalidCredentialsError) {
    return {
      error: error.message,
      fieldErrors: {} as Partial<Record<TField, string>>,
    };
  }

  if (error instanceof EmailAlreadyExistsError) {
    const message = error.message;

    return {
      error: message,
      fieldErrors: field
        ? ({ [field]: message } as Partial<Record<TField, string>>)
        : ({} as Partial<Record<TField, string>>),
    };
  }

  return {
    error: fallbackMessage,
    fieldErrors: {} as Partial<Record<TField, string>>,
  };
}
