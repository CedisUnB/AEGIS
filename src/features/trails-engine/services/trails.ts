import { listTrailCatalogData } from "../repositories";
import { THEME_DESCRIPTIONS, normalizeThemeKey } from "../constants/theme-descriptions";
import type { TrailCardDTO } from "../types";

export function describeTheme(theme: string): string {
  const key = normalizeThemeKey(theme);
  const description = THEME_DESCRIPTIONS[key];

  if (!description) {
    console.warn(`[trails] Sem descrição mapeada para o tema "${theme}".`);
  }

  return description ?? "Descrição da trilha pendente.";
}

export async function listTrails(userId?: string): Promise<TrailCardDTO[]> {
  try {
    const tracks = await listTrailCatalogData(userId);
    return tracks.map((track) => ({
      id: track.id,
      theme: track.theme,
      description: describeTheme(track.theme),
      totalNodes: track.totalNodes,
      completedNodes: track.completedNodes,
      isStarted: track.isStarted,
    }));
  } catch (error) {
    console.error("Falha ao carregar o catálogo de trilhas.", error);
    throw new Error("Não foi possível carregar o catálogo de trilhas.");
  }
}
