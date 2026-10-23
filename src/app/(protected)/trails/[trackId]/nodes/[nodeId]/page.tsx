import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrailNodeAction } from "@/features/trails-engine/actions";

interface TrailNodePageProps {
  params: Promise<{ trackId: string; nodeId: string }>;
}

export default async function TrailNodePage({ params }: TrailNodePageProps) {
  const routeParams = await params;
  const node = await getTrailNodeAction(routeParams);

  if (!node) {
    notFound();
  }

  const contentType = node.isFinalTest
    ? "teste final"
    : node.nodeType === "lesson"
      ? "conteúdo teórico"
      : "exercícios práticos";

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col px-4 py-8">
      <Link
        href={`/trails/${node.trackId}?focus=${node.id}#node-${node.id}`}
        className="mb-8 w-fit rounded-lg px-3 py-2 text-sm font-semibold text-accent hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-brand-secondary"
      >
        ← Voltar ao mapa da trilha
      </Link>
      <section className="flex-1 rounded-3xl border border-border bg-surface p-6 text-foreground shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">
          {contentType}
        </p>
        <h1 className="mt-3 text-2xl font-bold">{node.title}</h1>
        <p className="mt-6 text-sm leading-6 text-foreground-muted">
          Esta etapa ainda não possui uma tela de conteúdo. O conteúdo será
          disponibilizado nesta rota pelas histórias de leitura, exercícios e
          teste final.
        </p>
      </section>
    </main>
  );
}
