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

function trackNode(
  id: number,
  {
    nodeType = "lesson",
    completed = false,
    finalTest = false,
  }: {
    nodeType?: "lesson" | "exercise";
    completed?: boolean;
    finalTest?: boolean;
  } = {},
) {
  return {
    id,
    orderIndex: id,
    nodeType,
    lesson: nodeType === "lesson" ? { title: `Lição ${id}` } : null,
    exercises:
      nodeType === "exercise"
        ? [{ type: finalTest ? "test" : "revision" }]
        : [],
    progress: completed ? [{ isCompleted: true }] : [],
  };
}

function unlockStates(trail: Awaited<ReturnType<typeof getTrailMap>>) {
  return trail?.nodes.map(({ id, isUnlocked, isNextUp }) => ({
    id,
    isUnlocked,
    isNextUp,
  }));
}

describe("getTrailMap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates ordered node DTOs with completed, next-up and locked states", async () => {
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
          progress: [],
        },
      ],
    } as never);

    await expect(getTrailMap(12, undefined, "user-123")).resolves.toEqual({
      id: 12,
      theme: "Segurança Web",
      focusNodeId: 41,
      totalNodes: 3,
      completedNodes: 1,
      nodes: [
        {
          id: 41,
          orderIndex: 0,
          nodeType: "lesson",
          title: "Introdução",
          kindLabel: "Teoria",
          isCompleted: true,
          isCurrent: true,
          isMostAdvanced: true,
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
          isCompleted: false,
          isCurrent: false,
          isMostAdvanced: false,
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
      isUnlocked: true,
    });
  });

  it("keeps every node after the next-up one locked", async () => {
    mockedFindTrailMapData.mockResolvedValueOnce({
      id: 12,
      theme: "Segurança Web",
      trackNode: [
        trackNode(41, { completed: true }),
        trackNode(42, { nodeType: "exercise", completed: true }),
        trackNode(43),
        trackNode(44, { nodeType: "exercise" }),
        trackNode(45, { nodeType: "exercise", finalTest: true }),
      ],
    } as never);

    const trail = await getTrailMap(12, undefined, "user-123");

    expect(unlockStates(trail)).toEqual([
      { id: 41, isUnlocked: true, isNextUp: false },
      { id: 42, isUnlocked: true, isNextUp: false },
      { id: 43, isUnlocked: true, isNextUp: true },
      { id: 44, isUnlocked: false, isNextUp: false },
      { id: 45, isUnlocked: false, isNextUp: false },
    ]);
  });

  it("unlocks only the first node when there is no progress", async () => {
    mockedFindTrailMapData.mockResolvedValueOnce({
      id: 12,
      theme: "Segurança Web",
      trackNode: [
        trackNode(41),
        trackNode(42, { nodeType: "exercise" }),
        trackNode(43, { nodeType: "exercise", finalTest: true }),
      ],
    } as never);

    const trail = await getTrailMap(12, undefined, "user-123");

    expect(unlockStates(trail)).toEqual([
      { id: 41, isUnlocked: true, isNextUp: true },
      { id: 42, isUnlocked: false, isNextUp: false },
      { id: 43, isUnlocked: false, isNextUp: false },
    ]);
  });

  it("unlocks the final test only after every content node is completed", async () => {
    mockedFindTrailMapData.mockResolvedValueOnce({
      id: 12,
      theme: "Segurança Web",
      trackNode: [
        trackNode(41, { completed: true }),
        trackNode(42, { nodeType: "exercise", completed: true }),
        trackNode(43, { nodeType: "exercise", finalTest: true }),
      ],
    } as never);

    const trail = await getTrailMap(12, undefined, "user-123");

    expect(trail?.nodes[2]).toMatchObject({
      isFinalTest: true,
      isCompleted: false,
      isNextUp: true,
      isUnlocked: true,
    });
  });

  it("keeps every node unlocked for review when the whole trail is completed", async () => {
    mockedFindTrailMapData.mockResolvedValueOnce({
      id: 12,
      theme: "Segurança Web",
      trackNode: [
        trackNode(41, { completed: true }),
        trackNode(42, { nodeType: "exercise", completed: true }),
        trackNode(43, { nodeType: "exercise", finalTest: true, completed: true }),
      ],
    } as never);

    const trail = await getTrailMap(12, undefined, "user-123");

    expect(unlockStates(trail)).toEqual([
      { id: 41, isUnlocked: true, isNextUp: false },
      { id: 42, isUnlocked: true, isNextUp: false },
      { id: 43, isUnlocked: true, isNextUp: false },
    ]);
  });

  it("does not move the next-up node when a focus node is requested", async () => {
    mockedFindTrailMapData.mockResolvedValueOnce({
      id: 12,
      theme: "Segurança Web",
      trackNode: [
        trackNode(41, { completed: true }),
        trackNode(42, { nodeType: "exercise", completed: true }),
        trackNode(43),
      ],
    } as never);

    const trail = await getTrailMap(12, 41, "user-123");

    expect(trail?.focusNodeId).toBe(41);
    expect(trail?.nodes.find(({ id }) => id === 41)?.isCurrent).toBe(true);
    expect(trail?.nodes.find(({ id }) => id === 43)).toMatchObject({
      isNextUp: true,
      isUnlocked: true,
      isCurrent: false,
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
