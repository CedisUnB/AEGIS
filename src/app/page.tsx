import { DeletedAccountToast } from "@/components/layout/DeletedAccountToast";
import Link from "next/link";

interface HomePageProps {
  searchParams: Promise<{ deleted?: string }>;
}

export default async function Home({ searchParams}: HomePageProps) {
  const { deleted } = await searchParams;
  
  return (
    <main className="flex min-h-screen bg-surface text-center">
      {deleted === "true" && <DeletedAccountToast />}
  

      <div className="max-w-3/4 [clip-path:polygon(0_0,45%_0,75%_100%,0_100%)] bg-brand-primary flex flex-col justify-start align-center p-16 pr-175">
          <h1 className="text-4xl mt-16 mb-32 font-bold tracking-tight text-foreground sm:text-5xl">
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

      <div className="mt-8 pr-32 flex flex-col items-center justify-center align-center gap-3">
        <Link
          href="/auth/login"
          className="w-96 rounded-md bg-brand-primary px-6 py-3 font-medium text-white transition hover:bg-neutral-800"
        >
          Entrar
        </Link>
        <Link
          href="/auth/register"
          className="w-96 rounded-md border border-brand-primary px-6 py-3 text-brand-primary font-medium transition hover:bg-neutral-100"
        >
          Criar conta
        </Link>
      </div>
    </main>
  );
}