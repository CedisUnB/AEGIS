"use client";

import { useActionState } from "react";
import { signUpAction, type SignUpState } from "@/features/auth";
import { PasswordInput } from "@/components/inputs/PasswordInput";

const initialState: SignUpState = {
  error: null,
  fieldErrors: {},
  fieldValues: { username: "", email: "" },
  resetKey: "initial",
};

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm font-medium text-foreground">
          Nome de usuário
        </label>
        <input
          key={`username-${state.resetKey}`}
          id="username"
          name="username"
          type="text"
          required
          minLength={3}
          defaultValue={state.fieldValues.username}
          aria-invalid={Boolean(state.fieldErrors.username)}
          aria-describedby={state.fieldErrors.username ? "username-error" : undefined}
          className="rounded-md border border-brand-primary px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-brand-secondary"
        />
        {state.fieldErrors.username && (
          <p id="username-error" className="text-sm text-cancel">
            {state.fieldErrors.username}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          E-mail
        </label>
        <input
          key={`email-${state.resetKey}`}
          id="email"
          name="email"
          type="email"
          required
          defaultValue={state.fieldValues.email}
          aria-invalid={Boolean(state.fieldErrors.email)}
          aria-describedby={state.fieldErrors.email ? "email-error" : undefined}
          className="rounded-md border border-brand-primary px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-brand-secondary"
        />
        {state.fieldErrors.email && (
          <p id="email-error" className="text-sm text-cancel">
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <PasswordInput
        key={`password-${state.resetKey}`}
        id="password"
        name="password"
        label="Senha"
        required
        minLength={8}
        maxLength={20}
        pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+"
        title="8-20 caracteres, com maiúscula, minúscula, número e caractere especial"
        error={state.fieldErrors.password}
      />

      <PasswordInput
        key={`confirmPassword-${state.resetKey}`}
        id="confirmPassword"
        name="confirmPassword"
        label="Confirmar senha"
        required
        error={state.fieldErrors.confirmPassword}
      />

      {state.error && <p className="text-sm text-cancel">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-primary py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}