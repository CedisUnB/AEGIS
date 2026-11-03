import { listTrackCatalogData, startTrack as startTrackRecord } from "../repositories";
import { logServerError } from "@/core/logging/log-server-error";
import type { TrackCatalogEntry } from "../types";

export async function listTracks(userId?: string): Promise<TrackCatalogEntry[]> {
  try {
    return await listTrackCatalogData(userId);
  } catch (error) {
    logServerError("tracks-engine:listTracks", error);
    throw new Error("Não foi possível carregar o catálogo de trilhas.");
  }
}

export async function startTrack(userId: string, trackId: number): Promise<void> {
  try {
    await startTrackRecord(userId, trackId);
  } catch (error) {
    logServerError("tracks-engine:startTrack", error);
    throw new Error("Não foi possível iniciar a trilha.");
  }
}
