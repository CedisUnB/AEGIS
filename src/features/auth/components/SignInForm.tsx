"use client";

import { useActionState } from "react";
import { signInAction, type SignInState } from "@/features/auth";

const initialState: SignInState = { error: null, fieldErrors: {} };

export function SignInForm() {
  const [state, formAction, isPending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
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

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          aria-invalid={Boolean(state.fieldErrors.password)}
          aria-describedby={state.fieldErrors.password ? "password-error" : undefined}
          className="rounded-md border border-brand-primary px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-brand-secondary"
        />
        {state.fieldErrors.password && (
          <p id="password-error" className="text-sm text-cancel">
            {state.fieldErrors.password}
          </p>
        )}
      </div>

      {state.error && <p className="text-sm text-cancel">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-primary py-2 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}