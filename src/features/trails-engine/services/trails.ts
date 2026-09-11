import { prisma } from "@/core/database/prisma";

export interface Trail {
  id: number;
  theme: string;
  sequence: string;
}

export async function listTrails(): Promise<Trail[]> {
  return prisma.track.findMany({
    orderBy: { sequence: "asc" },
    select: { id: true, theme: true, sequence: true },
  });
}