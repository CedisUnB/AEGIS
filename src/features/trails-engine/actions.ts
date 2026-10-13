"use server";

import { getSession } from "@/core/security";
import { listTrails } from "./services";
import type { TrailCatalogEntry } from "./types";

export async function getCatalogAction(): Promise<TrailCatalogEntry[]> {
  const session = await getSession();

  if (!session?.sub) {
    throw new Error("Sessão inválida ou expirada.");
  }

  return listTrails(session.sub);
}