/**
 * @jest-environment node
 */
import { prisma } from "@/core/database/prisma";
import {
  cleanup,
  completeNodes,
  createStudent,
  createTestPrefix,
  createTrail,
} from "../../helpers/trail-fixtures";
import {
  getTrailMap,
  getTrailNode,
} from "@/features/trails-engine/services/trail-map";

const PREFIX = createTestPrefix();

jest.setTimeout(30000);

describe("Mapa e progresso da trilha (US07/US08)", () => {
  afterAll(async () => {
    try {
      await cleanup(PREFIX);
    } finally {
      await prisma.$disconnect();
    }
  }, 30000);

  it("ordena os nós e apresenta o rótulo correspondente a cada tipo", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: true,
    });

    const map = await getTrailMap(trail.id, undefined, student.id);

    expect(map?.nodes.map(({ orderIndex, kindLabel }) => [orderIndex, kindLabel])).toEqual([
      [1, "Teoria"],
      [2, "Exercícios práticos"],
      [3, "Teoria"],
      [4, "Teste final"],
    ]);
  });

  it("marca o progresso por nó e destaca somente o último nó concluído", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: false,
    });
    await completeNodes(student.id, [trail.contentNodeIds[0], trail.contentNodeIds[2]]);

    const map = await getTrailMap(trail.id, undefined, student.id);

    expect(map?.nodes.map(({ isCompleted }) => isCompleted)).toEqual([
      true,
      false,
      true,
      false,
    ]);
    expect(map?.nodes.map(({ isMostAdvanced }) => isMostAdvanced)).toEqual([
      false,
      false,
      true,
      false,
    ]);
    expect(map?.nodes.map(({ isUnlocked }) => isUnlocked)).toEqual([
      true,
      true,
      true,
      false,
    ]);
  });

  it("desbloqueia somente o próximo nó incompleto e os nós já concluídos", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: false,
    });

    const initialMap = await getTrailMap(trail.id, undefined, student.id);

    expect(initialMap?.nodes.map(({ isUnlocked }) => isUnlocked)).toEqual([
      true,
      false,
      false,
      false,
    ]);

    await completeNodes(student.id, [trail.contentNodeIds[0]]);
    const afterFirstNodeMap = await getTrailMap(trail.id, undefined, student.id);

    expect(afterFirstNodeMap?.nodes.map(({ isUnlocked }) => isUnlocked)).toEqual([
      true,
      true,
      false,
      false,
    ]);
  });

  it("não destaca um nó mais avançado quando não há progresso", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 1,
      withFinalTest: false,
    });

    const map = await getTrailMap(trail.id, undefined, student.id);

    expect(map?.nodes.every(({ isMostAdvanced }) => !isMostAdvanced)).toBe(true);
  });

  it("respeita o foco em um nó pertencente à mesma trilha", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: false,
    });
    const focusNodeId = trail.contentNodeIds[2];

    const map = await getTrailMap(trail.id, focusNodeId, student.id);

    expect(map?.focusNodeId).toBe(focusNodeId);
    expect(map?.nodes.find(({ id }) => id === focusNodeId)?.isCurrent).toBe(true);
  });

  it("rejeita foco em nó de outra trilha ou em nó inexistente", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 1,
      withFinalTest: false,
    });
    const otherTrail = await createTrail(PREFIX, {
      lessons: 1,
      withFinalTest: false,
    });
    const otherTrailNodeId = otherTrail.contentNodeIds[0];

    await expect(
      getTrailMap(trail.id, otherTrailNodeId, student.id),
    ).resolves.toBeNull();
    await expect(
      getTrailMap(trail.id, Number.MAX_SAFE_INTEGER, student.id),
    ).resolves.toBeNull();
  });

  it("contabiliza o teste final no total e no progresso da trilha", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: true,
    });
    await completeNodes(student.id, trail.contentNodeIds);

    const contentCompleteMap = await getTrailMap(trail.id, undefined, student.id);

    expect(contentCompleteMap).toMatchObject({
      totalNodes: 4,
      completedNodes: 3,
    });

    if (trail.finalTestNodeId === null) {
      throw new Error("A trilha deveria conter o teste final.");
    }
    await completeNodes(student.id, [trail.finalTestNodeId]);
    const allCompleteMap = await getTrailMap(trail.id, undefined, student.id);

    expect(allCompleteMap).toMatchObject({
      totalNodes: 4,
      completedNodes: 4,
    });
  });

  it("não retorna um nó pertencente a outra trilha", async () => {
    const trail = await createTrail(PREFIX, {
      lessons: 1,
      withFinalTest: false,
    });
    const otherTrail = await createTrail(PREFIX, {
      lessons: 1,
      withFinalTest: false,
    });

    await expect(
      getTrailNode(trail.id, otherTrail.contentNodeIds[0]),
    ).resolves.toBeNull();
  });

    it("libera o teste final somente quando todo o conteúdo anterior está concluído", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, { lessons: 2, withFinalTest: true });

    await completeNodes(student.id, trail.contentNodeIds.slice(0, -1));
    const before = await getTrailMap(trail.id, undefined, student.id);
    expect(before?.nodes.find(({ isFinalTest }) => isFinalTest)?.isUnlocked).toBe(false);

    await completeNodes(student.id, trail.contentNodeIds.slice(-1));
    const after = await getTrailMap(trail.id, undefined, student.id);
    expect(after?.nodes.find(({ isFinalTest }) => isFinalTest)).toMatchObject({
      isNextUp: true,
      isUnlocked: true,
    });
  });
});
