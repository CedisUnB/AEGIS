"use client";

import { useState, type SyntheticEvent } from "react";

export function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // TODO: substituir pelo Server Action real (features/auth/actions.ts)
      console.log({ username, email, password });
    } catch {
      setError("Não foi possível criar a conta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm font-medium">Nome de usuário</label>
        <input id="username" type="text" value={username}
          onChange={(e) => setUsername(e.target.value)} required
          className="rounded-md border px-3 py-2" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">E-mail</label>
        <input id="email" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          className="rounded-md border px-3 py-2" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">Senha</label>
        <input id="password" type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} required minLength={8}
          className="rounded-md border px-3 py-2" />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={isSubmitting}
        className="rounded-md bg-black text-white py-2 font-medium disabled:opacity-50">
        {isSubmitting ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}