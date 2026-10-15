import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrailMapAction } from "@/features/trails-engine/actions";
import { TrailMap } from "@/features/trails-engine/components";

interface TrailPageProps {
  params: Promise<{ trackId: string }>;
  searchParams: Promise<{ focus?: string }>;
}

export default async function TrailPage({
  params,
  searchParams,
}: TrailPageProps) {
  const [{ trackId }, { focus }] = await Promise.all([params, searchParams]);
  const trail = await getTrailMapAction({ trackId, focus });

  if (!trail) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="mb-4 w-full max-w-3xl">
        <Link
          href="/trails"
          className="inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-semibold text-accent transition hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
        >
          <span aria-hidden="true" className="mr-2">
            ←
          </span>
          Voltar ao catálogo de trilhas
        </Link>
      </div>
      <TrailMap trail={trail} />
    </main>
  );
}
