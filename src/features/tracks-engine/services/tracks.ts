import { listTrackCatalogData } from "../repositories";
import type { TrackCatalogEntry } from "../types";

export async function listTracks(userId?: string): Promise<TrackCatalogEntry[]> {
  try {
    return await listTrackCatalogData(userId);
  } catch (error) {
    console.error("Falha ao carregar o catálogo de trilhas.", error);
    throw new Error("Não foi possível carregar o catálogo de trilhas.");
  }
}
