import { listTrailCatalogData } from "../repositories";
import type { TrailCatalogEntry } from "../types";

export async function listTrails(userId?: string): Promise<TrailCatalogEntry[]> {
  try {
    return await listTrailCatalogData(userId);
  } catch (error) {
    console.error("Falha ao carregar o catálogo de trilhas.", error);
    throw new Error("Não foi possível carregar o catálogo de trilhas.");
  }
}
