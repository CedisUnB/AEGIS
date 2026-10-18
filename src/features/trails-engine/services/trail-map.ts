import {
  findTrailMapData,
  findTrailNodeData,
  upsertNodeProgress,
  updateTakesStatus,
} from "../repositories";
import type {
  TrailMapDTO,
  TrailNodeContentDTO,
} from "../types";

function resolveNodeMeta(node: {
  lesson: { title: string } | null;
  exercises: { type: string }[];
}) {
  const isFinalTest = node.exercises.some(({ type }) => type === "test");
  const title = node.lesson?.title ?? (isFinalTest ? "Teste final" : "Exercícios práticos");

  return { title, isFinalTest };
}

export async function getTrailMap(
  trackId: number,
  focusNodeId: number | undefined,
  userId: string,
): Promise<TrailMapDTO | null> {
  try {
    const track = await findTrailMapData(trackId, userId);

    if (!track) {
      return null;
    }

    if (
      focusNodeId !== undefined &&
      !track.trackNode.some(({ id }) => id === focusNodeId)
    ) {
      return null;
    }

    const isContentNode = (node: typeof track.trackNode[number]) =>
      !resolveNodeMeta(node).isFinalTest;

    const allContentCompleted = track.trackNode
      .filter(isContentNode)
      .every(({ progress }) => progress.length > 0);

    const mostAdvancedNode = track.trackNode
      .filter(({ progress }) => progress.length > 0)
      .at(-1);

    const currentNodeId =
      focusNodeId ?? mostAdvancedNode?.id ?? track.trackNode[0]?.id ?? null;

    const totalNodes = track.trackNode.length;
    const completedNodes = track.trackNode.filter(
      ({ progress }) => progress.length > 0,
    ).length;

    const nextUpNode = track.trackNode.find(({ progress }) => progress.length === 0);

      return {
      id: track.id,
      theme: track.theme,
      focusNodeId: currentNodeId,
      totalNodes: totalNodes,
      completedNodes: completedNodes,
      nodes: track.trackNode.map((node) => {
        const { title, isFinalTest } = resolveNodeMeta(node);
        const isCompleted = node.progress.length > 0;
        const isMostAdvanced =
          mostAdvancedNode !== undefined && node.id === mostAdvancedNode.id;

        return {
          id: node.id,
          orderIndex: node.orderIndex,
          nodeType: node.nodeType,
          title,
          kindLabel: isFinalTest
            ? "Teste final"
            : node.nodeType === "lesson"
              ? "Teoria"
              : "Exercícios práticos",
          isCompleted,
          isCurrent: node.id === currentNodeId,
          isMostAdvanced,
          isFinalTest,
          isNextUp: nextUpNode !== undefined && node.id === nextUpNode.id,
          isUnlocked: isFinalTest ? allContentCompleted : true,
        };
      }),
    };
  } catch (error) {
    console.error("Falha ao carregar o mapa da trilha.", error);
    throw new Error("Não foi possível carregar o mapa da trilha.");
  }
}

export async function getTrailNode(
  trackId: number,
  nodeId: number,
): Promise<TrailNodeContentDTO | null> {
  try {
    const node = await findTrailNodeData(trackId, nodeId);

    if (!node) {
      return null;
    }

    const { title, isFinalTest } = resolveNodeMeta(node);
    return {
      id: node.id,
      trackId: node.trackId,
      nodeType: node.nodeType,
      title,
      isFinalTest,
    };
  } catch (error) {
    console.error("Falha ao carregar o nó da trilha.", error);
    throw new Error("Não foi possível carregar o conteúdo da etapa.");
  }
}

const PASSING_SCORE = 70; // TODO: confirmar se é fixo ou configurável por trilha

export async function completeTrailIfPassed(
  userId: string,
  trackId: number,
  trackNodeId: number,
  score: number,
): Promise<{ passed: boolean }> {
  try {
    await upsertNodeProgress(userId, trackNodeId, {
      isCompleted: true,
      score,
    });

    const passed = score >= PASSING_SCORE;

    if (passed) {
      await updateTakesStatus(userId, trackId);
    }

    return { passed };
  } catch (error) {
    console.error("Falha ao registrar a conclusão do teste final.", error);
    throw new Error("Não foi possível registrar o resultado do teste final.");
  }
}