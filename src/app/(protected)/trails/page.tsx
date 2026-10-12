import { TrailsMap } from "@/features/trails-engine/components";
import { getCatalogAction } from "@/features/trails-engine/actions";

export default async function TrailsPage() {
  const trails = await getCatalogAction();

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Trilhas disponíveis</h1>
      <TrailsMap trails={trails} />
    </main>
  );
}
