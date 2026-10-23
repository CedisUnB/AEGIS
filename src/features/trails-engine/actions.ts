"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/core/security";
import { getTrailMap, getTrailNode, listTrails } from "./services";
import {
  trailMapRouteParamsSchema,
  trailNodeRouteParamsSchema,
} from "./types";
import type { TrailCatalogEntry } from "./types";
import type { TrailMapDTO, TrailNodeContentDTO } from "./types";

async function requireSession() {
  const session = await getSession();

  if (!session?.sub) {
    redirect("/auth/login");
  }

  return session;
}

async function requireUserId(): Promise<string> {
  const session = await requireSession();
  return session.sub;
}

export async function getCatalogAction(): Promise<TrailCatalogEntry[]> {
  const userId = await requireUserId();
  return listTrails(userId);
}

export async function getTrailMapAction(
  params: { trackId: string; focus?: string },
): Promise<TrailMapDTO | null> {
  const userId = await requireUserId();

  const parsed = trailMapRouteParamsSchema.safeParse(params);
  if (!parsed.success) {
    return null;
  }

  return getTrailMap(parsed.data.trackId, parsed.data.focus, userId);
}

export async function getTrailNodeAction(
  params: { trackId: string; nodeId: string },
): Promise<TrailNodeContentDTO | null> {
  await requireSession();

  const parsed = trailNodeRouteParamsSchema.safeParse(params);
  if (!parsed.success) {
    return null;
  }

  return getTrailNode(parsed.data.trackId, parsed.data.nodeId);
}
