import { EmailAlreadyExistsError, InvalidCredentialsError } from "../services/auth";
import type { SignInField, SignUpField } from "./actions";

export type AuthErrorField = SignInField | SignUpField;

function emptyFieldErrors<TField extends string>(): Partial<Record<TField, string>> {
  return {};
}

/**
 * Traduz um erro lançado pela camada de domínio (auth service) para o
 * formato de estado que as Server Actions de auth devolvem ao formulário.
 *
 * @param field - Campo do formulário ao qual associar a mensagem quando o
 * erro for `EmailAlreadyExistsError` (ex: "email"). Se omitido, a mensagem
 * aparece só como erro geral (`state.error`), não embaixo de um campo específico.
 */
export function getAuthErrorState<TField extends string = string>(
  error: unknown,
  fallbackMessage: string,
  field?: TField,
): {
  error: string | null;
  fieldErrors: Partial<Record<TField, string>>;
} {
  if (error instanceof InvalidCredentialsError) {
    return { error: error.message, fieldErrors: emptyFieldErrors<TField>() };
  }

  if (error instanceof EmailAlreadyExistsError) {
    return {
      error: error.message,
      fieldErrors: field
        ? ({ [field]: error.message } as Partial<Record<TField, string>>)
        : emptyFieldErrors<TField>(),
    };
  }

  console.error("[auth] erro não tratado:", error);

  return { error: fallbackMessage, fieldErrors: emptyFieldErrors<TField>() };
}