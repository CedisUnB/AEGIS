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
      <TrailMap trail={trail} />
    </main>
  );
}
