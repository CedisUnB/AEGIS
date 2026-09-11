import { TrailsMap } from "@/features/trails-engine/components";
import { listTrails } from "@/features/trails-engine/services";

export default async function TrailsPage() {
  const trails = await listTrails();

  return (
    <main className="px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Trilhas disponíveis</h1>
      <TrailsMap trails={trails} />
    </main>
  );
}