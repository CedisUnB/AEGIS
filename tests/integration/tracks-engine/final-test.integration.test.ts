/**
 * @jest-environment node
 */
import { prisma } from "@/core/database/prisma";
import {
  cleanup,
  completeNodes,
  createStudent,
  createTestPrefix,
  createTrack,
  startTrack,
} from "../../helpers/track-fixtures";
import {
  completeTrackIfPassed,
  getTrackMap,
} from "@/features/tracks-engine/services/track-map";

const PREFIX = createTestPrefix();

function requireFinalTestNodeId(track: {
  finalTestNodeId: number | null;
}): number {
  if (track.finalTestNodeId === null) {
    throw new Error("A trilha deveria conter o teste final.");
  }

  return track.finalTestNodeId;
}

jest.setTimeout(30000);

describe("Desbloqueio do teste final e conclusão da trilha (US09)", () => {
  afterAll(async () => {
    try {
      await cleanup(PREFIX);
    } finally {
      await prisma.$disconnect();
    }
  }, 30000);

  it("desbloqueia apenas o primeiro nó e mantém o teste final bloqueado sem progresso", async () => {
    const student = await createStudent(PREFIX);
    const track = await createTrack(PREFIX, {
      lessons: 2,
      withFinalTest: true,
    });

    const map = await getTrackMap(track.id, undefined, student.id);
    const finalTest = map?.nodes.find(({ isFinalTest }) => isFinalTest);
    expect(map?.nodes.map(({ isUnlocked }) => isUnlocked)).toEqual([
      true,
      false,
      false,
      false,
    ]);
    expect(finalTest?.isUnlocked).toBe(false);
  });

  it("mantém desbloqueados os nós concluídos e o próximo nó, mas bloqueia o teste final", async () => {
    const student = await createStudent(PREFIX);
    const track = await createTrack(PREFIX, {
      lessons: 2,
      withFinalTest: true,
    });
    await completeNodes(student.id, track.contentNodeIds.slice(0, -1));

    const map = await getTrackMap(track.id, undefined, student.id);

    expect(map?.nodes.find(({ isFinalTest }) => isFinalTest)?.isUnlocked).toBe(
      false,
    );
    expect(map?.nodes.map(({ isUnlocked }) => isUnlocked)).toEqual([
      true,
      true,
      true,
      false,
    ]);
  });

  it("desbloqueia o teste final quando todo o conteúdo está concluído", async () => {
    const student = await createStudent(PREFIX);
    const track = await createTrack(PREFIX, {
      lessons: 2,
      withFinalTest: true,
    });
    await completeNodes(student.id, track.contentNodeIds);

    const map = await getTrackMap(track.id, undefined, student.id);

    expect(map?.nodes.find(({ isFinalTest }) => isFinalTest)?.isUnlocked).toBe(
      true,
    );
  });

  it("aplica o desbloqueio sequencial também a trilhas sem teste final", async () => {
    const student = await createStudent(PREFIX);
    const track = await createTrack(PREFIX, {
      lessons: 2,
      withFinalTest: false,
    });

    const map = await getTrackMap(track.id, undefined, student.id);

    expect(map?.nodes.every(({ isFinalTest }) => !isFinalTest)).toBe(true);
    expect(map?.nodes.map(({ isUnlocked }) => isUnlocked)).toEqual([
      true,
      false,
      false,
      false,
    ]);
  });

  it("registra nota aprovada no progresso e conclui a trilha", async () => {
    const student = await createStudent(PREFIX);
    const track = await createTrack(PREFIX, {
      lessons: 1,
      withFinalTest: true,
    });
    const finalTestNodeId = requireFinalTestNodeId(track);
    await startTrack(student.id, track.id);

    const result = await completeTrackIfPassed(
      student.id,
      track.id,
      finalTestNodeId,
      100,
    );

    expect(result.passed).toBe(true);
    await expect(
      prisma.progress.findUnique({
        where: {
          userId_trackNodeId: {
            userId: student.id,
            trackNodeId: finalTestNodeId,
          },
        },
      }),
    ).resolves.toMatchObject({
      isCompleted: true,
      score: 100,
    });
    await expect(
      prisma.takes.findUnique({
        where: { userId_trackId: { userId: student.id, trackId: track.id } },
      }),
    ).resolves.toMatchObject({
      status: "completed",
      completedAt: expect.any(Date),
    });
  });

  it("não conclui a trilha quando a nota não atinge a aprovação", async () => {
    const student = await createStudent(PREFIX);
    const track = await createTrack(PREFIX, {
      lessons: 1,
      withFinalTest: true,
    });
    const finalTestNodeId = requireFinalTestNodeId(track);
    await startTrack(student.id, track.id);

    const result = await completeTrackIfPassed(
      student.id,
      track.id,
      finalTestNodeId,
      0,
    );
    const take = await prisma.takes.findUnique({
      where: { userId_trackId: { userId: student.id, trackId: track.id } },
    });

    expect(result.passed).toBe(false);
    expect(take).toMatchObject({ status: "in_progress", completedAt: null });
  });

  it("atualiza o mesmo progresso ao registrar novamente o resultado do teste final", async () => {
    const student = await createStudent(PREFIX);
    const track = await createTrack(PREFIX, {
      lessons: 1,
      withFinalTest: true,
    });
    const finalTestNodeId = requireFinalTestNodeId(track);
    await startTrack(student.id, track.id);

    await completeTrackIfPassed(
      student.id,
      track.id,
      finalTestNodeId,
      100,
    );
    await expect(
      completeTrackIfPassed(
        student.id,
        track.id,
        finalTestNodeId,
        100,
      ),
    ).resolves.toEqual({ passed: true });

    await expect(
      prisma.progress.count({
        where: {
          userId: student.id,
          trackNodeId: finalTestNodeId,
        },
      }),
    ).resolves.toBe(1);
  });
});
