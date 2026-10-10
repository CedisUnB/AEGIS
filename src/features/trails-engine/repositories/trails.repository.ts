import "server-only";
import { prisma } from "@/core/database/prisma";
import type { TrailCatalogEntry } from "../types";

export async function listTrailCatalogData(
  userId?: string,
): Promise<TrailCatalogEntry[]> {
  if (!userId) {
    const tracks = await prisma.track.findMany({
      orderBy: { theme: "asc" },
      select: {
        id: true,
        theme: true,
        _count: { select: { trackNode: true } },
      },
    });

    return tracks.map((track) => ({
      id: track.id,
      theme: track.theme,
      totalNodes: track._count.trackNode,
      completedNodes: 0,
      isStarted: false,
    }));
  }

  const tracks = await prisma.track.findMany({
    orderBy: { theme: "asc" },
    select: {
      id: true,
      theme: true,
      _count: { select: { trackNode: true } },
      takes: {
        where: { userId },
        select: { status: true },
      },
      trackNode: {
        select: {
          progress: {
            where: { userId, isCompleted: true },
            select: { isCompleted: true },
          },
        },
      },
    },
  });

  return tracks.map((track) => ({
    id: track.id,
    theme: track.theme,
    totalNodes: track._count.trackNode,
    completedNodes: track.trackNode.filter(
      (node) => node.progress.length > 0,
    ).length,
    isStarted: track.takes.some(({ status }) => status !== "not_started"),
  }));
}