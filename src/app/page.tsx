import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="max-w-2xl">
        <span className="mb-4 inline-block rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          Plataforma de apoio ao aprendizado em desenvolvimento de software seguro
        </span>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Security App
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          Aprenda como aplicar segurança no processo de desenvolvimento de software na prática, com trilhas guiadas,
          desafios reais e conteúdo pensado para desenvolvedores.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/auth/login"
            className="w-full rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 sm:w-auto"
          >
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="w-full rounded-md border px-6 py-3 text-sm font-medium transition hover:bg-neutral-100 sm:w-auto"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}