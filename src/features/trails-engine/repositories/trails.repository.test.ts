import { prisma } from "@/core/database/prisma";
import { listTrailCatalogData } from "./trails.repository";

jest.mock("server-only", () => ({}));
jest.mock("@/core/database/prisma", () => ({
  prisma: {
    track: {
      findMany: jest.fn(),
    },
  },
}));

const mockedFindMany = prisma.track
  .findMany as jest.MockedFunction<typeof prisma.track.findMany>;

describe("listTrailCatalogData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads node and progress counts filtered to the authenticated user", async () => {
    mockedFindMany.mockResolvedValueOnce([
      {
        id: 11,
        theme: "Segurança Web",
        description: "Descrição de Segurança Web.",
        _count: { trackNode: 3 },
        takes: [{ status: "in_progress" }],
        trackNode: [
          { progress: [{ isCompleted: true }] },
          { progress: [] },
          { progress: [{ isCompleted: true }] },
        ],
      },
    ] as never);

    await expect(listTrailCatalogData("user-123")).resolves.toEqual([
      {
        id: 11,
        theme: "Segurança Web",
        description: "Descrição de Segurança Web.",
        totalNodes: 3,
        completedNodes: 2,
        isStarted: true,
      },
    ]);
    expect(mockedFindMany).toHaveBeenCalledWith({
      orderBy: { theme: "asc" },
      select: {
        id: true,
        theme: true,
        description: true,
        _count: { select: { trackNode: true } },
        takes: {
          where: { userId: "user-123" },
          select: { status: true },
        },
        trackNode: {
          select: {
            progress: {
              where: { userId: "user-123", isCompleted: true },
              select: { isCompleted: true },
            },
          },
        },
      },
    });
  });

  it("loads only public track information when there is no authenticated user", async () => {
    mockedFindMany.mockResolvedValueOnce([
      {
        id: 12,
        theme: "Proteção de Dados",
        description: "Descrição de Proteção de Dados.",
        _count: { trackNode: 5 },
      },
    ] as never);

    await expect(listTrailCatalogData()).resolves.toEqual([
      {
        id: 12,
        theme: "Proteção de Dados",
        description: "Descrição de Proteção de Dados.",
        totalNodes: 5,
        completedNodes: 0,
        isStarted: false,
      },
    ]);
    expect(mockedFindMany).toHaveBeenCalledWith({
      orderBy: { theme: "asc" },
      select: {
        id: true,
        theme: true,
        description: true,
        _count: { select: { trackNode: true } },
      },
    });
  });
});
