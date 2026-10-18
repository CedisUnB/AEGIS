/**
 * @jest-environment node
 */
import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/core/database/prisma";
import { getSession } from "@/core/security";
import {
  getCatalogAction,
  getTrailMapAction,
  getTrailNodeAction,
} from "@/features/trails-engine/actions";
import { getTrailMap } from "@/features/trails-engine/services/trail-map";
import {
  cleanup,
  completeNodes,
  createStudent,
  createTrail,
} from "../../helpers/trail-fixtures";

jest.mock("next/navigation", () => ({
  redirect: jest.fn((path: string) => {
    throw new Error(`Redirected to ${path}`);
  }),
}));

jest.mock("@/core/security", () => ({
  getSession: jest.fn(),
}));

const PREFIX = `__test_${randomUUID().slice(0, 8)}__`;
const mockedGetSession = jest.mocked(getSession);
const mockedRedirect = jest.mocked(redirect);

jest.setTimeout(30000);

describe("Isolamento e validação das actions de trilhas (A01)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    try {
      await cleanup(PREFIX);
    } finally {
      await prisma.$disconnect();
    }
  }, 30000);

  it("não expõe o progresso de um usuário para outro na mesma trilha", async () => {
    const owner = await createStudent(PREFIX);
    const otherStudent = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: false,
    });
    await completeNodes(owner.id, trail.contentNodeIds);

    const map = await getTrailMap(trail.id, undefined, otherStudent.id);

    expect(map?.completedNodes).toBe(0);
    expect(map?.nodes.every(({ isCompleted }) => !isCompleted)).toBe(true);
  });

  it("redireciona todas as actions para login quando não há sessão", async () => {
    mockedGetSession.mockResolvedValue(null);

    await expect(getCatalogAction()).rejects.toThrow(
      "Redirected to /auth/login",
    );
    await expect(getTrailMapAction({ trackId: "1" })).rejects.toThrow(
      "Redirected to /auth/login",
    );
    await expect(
      getTrailNodeAction({ trackId: "1", nodeId: "1" }),
    ).rejects.toThrow("Redirected to /auth/login");

    expect(mockedRedirect).toHaveBeenCalledTimes(3);
    expect(mockedRedirect).toHaveBeenNthCalledWith(1, "/auth/login");
    expect(mockedRedirect).toHaveBeenNthCalledWith(2, "/auth/login");
    expect(mockedRedirect).toHaveBeenNthCalledWith(3, "/auth/login");
  });

  it("rejeita parâmetros de rota não numéricos, negativos ou zero", async () => {
    mockedGetSession.mockResolvedValue({
      sub: "session-user",
      role: "student",
    });

    for (const invalidId of ["not-a-number", "-1", "0"]) {
      await expect(
        getTrailMapAction({ trackId: invalidId }),
      ).resolves.toBeNull();
      await expect(
        getTrailNodeAction({ trackId: invalidId, nodeId: "1" }),
      ).resolves.toBeNull();
      await expect(
        getTrailNodeAction({ trackId: "1", nodeId: invalidId }),
      ).resolves.toBeNull();
    }
  });

  it("não recebe o userId como argumento das actions", () => {
    expect(getCatalogAction).toHaveLength(0);
    expect(getTrailMapAction).toHaveLength(1);
    expect(getTrailNodeAction).toHaveLength(1);
  });
});
