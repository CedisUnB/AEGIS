"use client";

import { useActionState } from "react";
import { signUpAction, type SignUpState } from "@/features/auth";

const initialState: SignUpState = { error: null, fieldErrors: {} };

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm font-medium">Nome de usuário</label>
        <input id="username" name="username" type="text" required
          aria-invalid={Boolean(state.fieldErrors.username)}
          aria-describedby={state.fieldErrors.username ? "username-error" : undefined}
          className="rounded-md border px-3 py-2" />
        {state.fieldErrors.username && <p id="username-error" className="text-sm text-red-600">{state.fieldErrors.username}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">E-mail</label>
        <input id="email" name="email" type="email" required
          aria-invalid={Boolean(state.fieldErrors.email)}
          aria-describedby={state.fieldErrors.email ? "email-error" : undefined}
          className="rounded-md border px-3 py-2" />
        {state.fieldErrors.email && <p id="email-error" className="text-sm text-red-600">{state.fieldErrors.email}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">Senha</label>
        <input id="password" name="password" type="password" required minLength={8}
          aria-invalid={Boolean(state.fieldErrors.password)}
          aria-describedby={state.fieldErrors.password ? "password-error" : undefined}
          className="rounded-md border px-3 py-2" />
        {state.fieldErrors.password && <p id="password-error" className="text-sm text-red-600">{state.fieldErrors.password}</p>}
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" disabled={isPending}
        className="rounded-md bg-black text-white py-2 font-medium disabled:opacity-50">
        {isPending ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}