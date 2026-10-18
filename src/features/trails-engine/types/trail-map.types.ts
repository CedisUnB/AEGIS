import { z } from "zod";
import type { NodeType } from "@generated/prisma/client";

const numericRouteParamSchema = z
  .string()
  .regex(/^[1-9]\d*$/)
  .transform(Number)
  .refine(
    (value) => Number.isSafeInteger(value) && value <= 2_147_483_647,
  );

export const trailMapRouteParamsSchema = z.object({
  trackId: numericRouteParamSchema,
  focus: numericRouteParamSchema.optional(),
});

export const trailNodeRouteParamsSchema = z.object({
  trackId: numericRouteParamSchema,
  nodeId: numericRouteParamSchema,
});

export interface TrailMapNodeDTO {
  id: number;
  orderIndex: number;
  nodeType: NodeType;
  title: string;
  kindLabel: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isMostAdvanced: boolean;
  isFinalTest: boolean;
  isNextUp: boolean;
  isUnlocked: boolean;
}

export interface TrailMapDTO {
  id: number;
  theme: string;
  focusNodeId: number | null;
  totalNodes: number;
  completedNodes: number;
  nodes: TrailMapNodeDTO[];
}

export interface TrailNodeContentDTO {
  id: number;
  trackId: number;
  nodeType: NodeType;
  title: string;
  isFinalTest: boolean;
}
