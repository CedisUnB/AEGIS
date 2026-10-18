/**
 * @jest-environment node
 */
import { randomUUID } from "node:crypto";
import { prisma } from "@/core/database/prisma";
import {
  cleanup,
  completeNodes,
  createStudent,
  createTrail,
  startTrail,
} from "../../helpers/trail-fixtures";
import { listTrails } from "@/features/trails-engine/services/trails";

const PREFIX = `__test_${randomUUID().slice(0, 8)}__`;

jest.setTimeout(30000);

describe("Catálogo de trilhas (US06)", () => {
  afterAll(async () => {
    try {
      await cleanup(PREFIX);
    } finally {
      await prisma.$disconnect();
    }
  }, 30000);

  it("retorna a quantidade total e nenhum progresso para uma trilha sem atividade", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: false,
    });

    const catalog = await listTrails(student.id);
    const entry = catalog.find(({ id }) => id === trail.id);

    expect(entry).toMatchObject({
      totalNodes: 4,
      completedNodes: 0,
      isStarted: false,
    });
  });

  it("mostra dois de quatro nós concluídos em uma trilha iniciada", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: false,
    });
    await startTrail(student.id, trail.id);
    await completeNodes(student.id, trail.contentNodeIds.slice(0, 2));

    const catalog = await listTrails(student.id);
    const entry = catalog.find(({ id }) => id === trail.id);

    expect(entry).toMatchObject({
      totalNodes: 4,
      completedNodes: 2,
      isStarted: true,
    });
  });

  it("contabiliza todos os nós quando a trilha está 100% concluída", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: false,
    });
    await completeNodes(student.id, trail.contentNodeIds);

    const catalog = await listTrails(student.id);
    const entry = catalog.find(({ id }) => id === trail.id);

    expect(entry?.completedNodes).toBe(entry?.totalNodes);
    expect(entry?.totalNodes).toBe(4);
  });

  it("retorna a descrição persistida na trilha", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 1,
      withFinalTest: false,
    });

    const catalog = await listTrails(student.id);
    const entry = catalog.find(({ id }) => id === trail.id);

    expect(entry?.description).toBe(`Trilha de integração ${trail.theme}`);
  });
});
