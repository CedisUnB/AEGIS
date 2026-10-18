import {
  findTrailMapData,
  findTrailNodeData,
  upsertNodeProgress,
  updateTakesStatus,
} from "../repositories";
import {
  completeTrailIfPassed,
  getTrailMap,
  getTrailNode,
} from "./trail-map";

jest.mock("../repositories", () => ({
  findTrailMapData: jest.fn(),
  findTrailNodeData: jest.fn(),
  upsertNodeProgress: jest.fn(),
  updateTakesStatus: jest.fn(),
}));

const mockedFindTrailMapData =
  findTrailMapData as jest.MockedFunction<typeof findTrailMapData>;
const mockedFindTrailNodeData =
  findTrailNodeData as jest.MockedFunction<typeof findTrailNodeData>;
const mockedUpsertNodeProgress =
  upsertNodeProgress as jest.MockedFunction<typeof upsertNodeProgress>;
const mockedUpdateTakesStatus =
  updateTakesStatus as jest.MockedFunction<typeof updateTakesStatus>;

describe("getTrailMap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates ordered node DTOs and marks completion and the most advanced node", async () => {
    mockedFindTrailMapData.mockResolvedValueOnce({
      id: 12,
      theme: "Segurança Web",
      trackNode: [
        {
          id: 41,
          orderIndex: 0,
          nodeType: "lesson",
          lesson: { title: "Introdução" },
          exercises: [],
          progress: [{ isCompleted: true }],
        },
        {
          id: 42,
          orderIndex: 1,
          nodeType: "exercise",
          lesson: null,
          exercises: [{ type: "revision" }],
          progress: [],
        },
        {
          id: 43,
          orderIndex: 2,
          nodeType: "exercise",
          lesson: null,
          exercises: [{ type: "test" }],
          progress: [{ isCompleted: true }],
        },
      ],
    } as never);

    await expect(getTrailMap(12, undefined, "user-123")).resolves.toEqual({
      id: 12,
      theme: "Segurança Web",
      focusNodeId: 43,
      totalNodes: 3,
      completedNodes: 2,
      nodes: [
        {
          id: 41,
          orderIndex: 0,
          nodeType: "lesson",
          title: "Introdução",
          kindLabel: "Teoria",
          isCompleted: true,
          isCurrent: false,
          isMostAdvanced: false,
          isFinalTest: false,
          isNextUp: false,
          isUnlocked: true,
        },
        {
          id: 42,
          orderIndex: 1,
          nodeType: "exercise",
          title: "Exercícios práticos",
          kindLabel: "Exercícios práticos",
          isCompleted: false,
          isCurrent: false,
          isMostAdvanced: false,
          isFinalTest: false,
          isNextUp: true,
          isUnlocked: true,
        },
        {
          id: 43,
          orderIndex: 2,
          nodeType: "exercise",
          title: "Teste final",
          kindLabel: "Teste final",
          isCompleted: true,
          isCurrent: true,
          isMostAdvanced: true,
          isFinalTest: true,
          isNextUp: false,
          isUnlocked: false,
        },
      ],
    });
    expect(mockedFindTrailMapData).toHaveBeenCalledWith(12, "user-123");
  });

  it("uses the first node as the initial focus when there is no completed progress", async () => {
    mockedFindTrailMapData.mockResolvedValueOnce({
      id: 12,
      theme: "Segurança Web",
      trackNode: [
        {
          id: 41,
          orderIndex: 0,
          nodeType: "lesson",
          lesson: { title: "Introdução" },
          exercises: [],
          progress: [],
        },
      ],
    } as never);

    const trail = await getTrailMap(12, undefined, "user-123");

    expect(trail?.focusNodeId).toBe(41);
    expect(trail).toMatchObject({
      totalNodes: 1,
      completedNodes: 0,
    });
    expect(trail?.nodes[0]).toMatchObject({
      isCurrent: true,
      isMostAdvanced: false,
      isCompleted: false,
      kindLabel: "Teoria",
      isNextUp: true,
    });
  });

  it("unlocks the final test after every content node is completed", async () => {
    mockedFindTrailMapData.mockResolvedValueOnce({
      id: 12,
      theme: "Segurança Web",
      trackNode: [
        {
          id: 41,
          orderIndex: 0,
          nodeType: "lesson",
          lesson: { title: "Introdução" },
          exercises: [],
          progress: [{ isCompleted: true }],
        },
        {
          id: 42,
          orderIndex: 1,
          nodeType: "exercise",
          lesson: null,
          exercises: [{ type: "revision" }],
          progress: [{ isCompleted: true }],
        },
        {
          id: 43,
          orderIndex: 2,
          nodeType: "exercise",
          lesson: null,
          exercises: [{ type: "test" }],
          progress: [],
        },
      ],
    } as never);

    const trail = await getTrailMap(12, undefined, "user-123");

    expect(trail?.nodes[2]).toMatchObject({
      isFinalTest: true,
      isCompleted: false,
      isUnlocked: true,
    });
  });

  it("rejects a focus node that is not in the requested track", async () => {
    mockedFindTrailMapData.mockResolvedValueOnce({
      id: 12,
      theme: "Segurança Web",
      trackNode: [],
    } as never);

    await expect(getTrailMap(12, 99, "user-123")).resolves.toBeNull();
  });

  it("returns null when the requested track does not exist", async () => {
    mockedFindTrailMapData.mockResolvedValueOnce(null);

    await expect(getTrailMap(404, undefined, "user-123")).resolves.toBeNull();
  });
});

describe("getTrailNode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns node metadata only when the node belongs to the requested track", async () => {
    mockedFindTrailNodeData.mockResolvedValueOnce(null);

    await expect(getTrailNode(12, 99)).resolves.toBeNull();
    expect(mockedFindTrailNodeData).toHaveBeenCalledWith(12, 99);
  });
});

describe("completeTrailIfPassed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("records the score and completes the trail when the passing score is reached", async () => {
    mockedUpsertNodeProgress.mockResolvedValueOnce({} as never);
    mockedUpdateTakesStatus.mockResolvedValueOnce({} as never);

    await expect(
      completeTrailIfPassed("user-123", 12, 43, 70),
    ).resolves.toEqual({ passed: true });

    expect(mockedUpsertNodeProgress).toHaveBeenCalledWith(
      "user-123",
      43,
      { isCompleted: true, score: 70 },
    );
    expect(mockedUpdateTakesStatus).toHaveBeenCalledWith("user-123", 12);
  });

  it("records a failing score without completing the trail", async () => {
    mockedUpsertNodeProgress.mockResolvedValueOnce({} as never);

    await expect(
      completeTrailIfPassed("user-123", 12, 43, 69),
    ).resolves.toEqual({ passed: false });

    expect(mockedUpsertNodeProgress).toHaveBeenCalledWith(
      "user-123",
      43,
      { isCompleted: true, score: 69 },
    );
    expect(mockedUpdateTakesStatus).not.toHaveBeenCalled();
  });

  it("logs progress persistence errors and throws a generic error", async () => {
    const repositoryError = new Error("database connection details");
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    mockedUpsertNodeProgress.mockRejectedValueOnce(repositoryError);

    try {
      await expect(
        completeTrailIfPassed("user-123", 12, 43, 70),
      ).rejects.toThrow(
        "Não foi possível registrar o resultado do teste final.",
      );
      expect(consoleError).toHaveBeenCalledWith(
        "Falha ao registrar a conclusão do teste final.",
        repositoryError,
      );
      expect(mockedUpdateTakesStatus).not.toHaveBeenCalled();
    } finally {
      consoleError.mockRestore();
    }
  });

  it("logs trail status errors and throws a generic error", async () => {
    const repositoryError = new Error("database connection details");
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    mockedUpsertNodeProgress.mockResolvedValueOnce({} as never);
    mockedUpdateTakesStatus.mockRejectedValueOnce(repositoryError);

    try {
      await expect(
        completeTrailIfPassed("user-123", 12, 43, 70),
      ).rejects.toThrow(
        "Não foi possível registrar o resultado do teste final.",
      );
      expect(consoleError).toHaveBeenCalledWith(
        "Falha ao registrar a conclusão do teste final.",
        repositoryError,
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});
