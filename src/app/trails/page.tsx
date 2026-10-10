import { redirect } from "next/navigation";
import { getSession } from "@/core/security";
import { TrailsMap } from "@/features/trails-engine/components";
import { getCatalogAction } from "@/features/trails-engine/actions";

export default async function TrailsPage() {
  const session = await getSession();

  if (!session?.sub) {
    redirect("/auth/login");
  }

  const trails = await getCatalogAction();

  return (
    <main className="px-4 py-8 bg-surface min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Trilhas disponíveis</h1>
      <TrailsMap trails={trails} />
    </main>
  );
}