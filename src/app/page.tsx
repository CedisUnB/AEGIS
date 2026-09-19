import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-surface text-center">
      <div className="[clip-path:polygon(0_0,45%_0,75%_100%,0_100%)] bg-brand-primary flex flex-col justify-center align-center p-16 pr-128">
          <h1 className="text-4xl mb-64 font-bold tracking-tight text-foreground sm:text-5xl">
            SAFE
          </h1>
          
          <span className="mb-4 inline-block rounded-full border px-3 py-1 text-sm text-foreground font-medium">
          Plataforma de apoio ao aprendizado em desenvolvimento de software seguro
          </span>

          <p className="mt-4 text-lg text-foreground-muted">
            Aprenda como aplicar segurança no processo de desenvolvimento de software na prática, com trilhas guiadas,
            desafios reais e conteúdo pensado para desenvolvedores.
          </p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/auth/login"
          className="w-full rounded-md bg-brand-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 sm:w-auto"
        >
          Entrar
        </Link>
        <Link
          href="/auth/register"
          className="w-full rounded-md border border-brand-primary px-6 py-3 text-sm text-brand-primary font-medium transition hover:bg-neutral-100 sm:w-auto"
        >
          Criar conta
        </Link>
      </div>
    </main>
  );
}