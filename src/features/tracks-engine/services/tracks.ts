import { listTrackCatalogData, startTrack as startTrackRecord } from "../repositories";
import type { TrackCatalogEntry } from "../types";

export async function listTracks(userId?: string): Promise<TrackCatalogEntry[]> {
  try {
    return await listTrackCatalogData(userId);
  } catch (error) {
    console.error("Falha ao carregar o catálogo de trilhas.", error);
    throw new Error("Não foi possível carregar o catálogo de trilhas.");
  }
}

export async function startTrack(userId: string, trackId: number): Promise<void> {
  try {
    await startTrackRecord(userId, trackId);
  } catch (error) {
    console.error("Falha ao iniciar a trilha.", error);
    throw new Error("Não foi possível iniciar a trilha.");
  }
}
