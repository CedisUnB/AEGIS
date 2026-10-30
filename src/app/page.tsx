import { DeletedAccountToast } from "@/components/layout/DeletedAccountToast";
import Link from "next/link";

interface HomePageProps {
  searchParams: Promise<{ deleted?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const { deleted } = await searchParams;

  return (
    <>
      {deleted === "true" && <DeletedAccountToast />}

      <main className="flex min-h-dvh flex-col bg-surface text-center lg:flex-row">
        <section className="flex flex-col bg-brand-primary px-6 pb-24 pt-12 [clip-path:polygon(0_0,100%_0,100%_calc(100%-3rem),0_100%)] lg:w-3/5 lg:shrink-0 lg:py-16 lg:pl-16 lg:pr-56 lg:[clip-path:polygon(0_0,calc(100%-12rem)_0,100%_100%,0_100%)]">
          <h1 className="mb-10 mt-8 text-4xl font-bold tracking-tight text-hero-foreground sm:text-5xl lg:mb-32 lg:mt-16">
            SAFE
          </h1>

          <span className="mb-4 inline-block rounded-2xl border border-hero-border px-4 py-1.5 text-sm font-medium text-hero-foreground">
            Plataforma de apoio ao aprendizado em desenvolvimento de software seguro
          </span>

          <p className="mt-4 text-base text-hero-muted sm:text-lg">
            Aprenda como aplicar segurança no processo de desenvolvimento de
            software na prática, com trilhas guiadas, desafios reais e conteúdo
            pensado para desenvolvedores.
          </p>
        </section>

        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 lg:p-12">
          <Link
            href="/auth/login"
            className="w-full max-w-sm rounded-md bg-brand-primary px-6 py-3 font-medium text-white transition hover:bg-neutral-800"
          >
            Entrar
          </Link>
          <Link
            href="/auth/register"
            className="w-full max-w-sm rounded-md border border-brand-primary px-6 py-3 font-medium text-brand-primary transition hover:bg-accent"
          >
            Criar conta
          </Link>
        </div>
      </main>
    </>
  );
}