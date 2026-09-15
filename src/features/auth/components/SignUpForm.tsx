"use client";

import { useActionState } from "react";
import { signUpAction, type SignUpState } from "@/features/auth";

const initialState: SignUpState = { error: null };

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm font-medium">Nome de usuário</label>
        <input id="username" name="username" type="text" required
          className="rounded-md border px-3 py-2" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">E-mail</label>
        <input id="email" name="email" type="email" required
          className="rounded-md border px-3 py-2" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">Senha</label>
        <input id="password" name="password" type="password" required minLength={8}
          className="rounded-md border px-3 py-2" />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" disabled={isPending}
        className="rounded-md bg-black text-white py-2 font-medium disabled:opacity-50">
        {isPending ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}