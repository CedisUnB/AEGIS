import {
  findTrailMapData,
  findTrailNodeData,
} from "../repositories";
import { getTrailMap, getTrailNode } from "./trail-map";

jest.mock("../repositories", () => ({
  findTrailMapData: jest.fn(),
  findTrailNodeData: jest.fn(),
}));

const mockedFindTrailMapData =
  findTrailMapData as jest.MockedFunction<typeof findTrailMapData>;
const mockedFindTrailNodeData =
  findTrailNodeData as jest.MockedFunction<typeof findTrailNodeData>;

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
      nodes: [
        {
          id: 41,
          orderIndex: 0,
          nodeType: "lesson",
          title: "Introdução",
          isCompleted: true,
          isCurrent: false,
          isMostAdvanced: false,
          isFinalTest: false,
        },
        {
          id: 42,
          orderIndex: 1,
          nodeType: "exercise",
          title: "Exercícios práticos",
          isCompleted: false,
          isCurrent: false,
          isMostAdvanced: false,
          isFinalTest: false,
        },
        {
          id: 43,
          orderIndex: 2,
          nodeType: "exercise",
          title: "Teste final",
          isCompleted: true,
          isCurrent: true,
          isMostAdvanced: true,
          isFinalTest: true,
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
    expect(trail?.nodes[0]).toMatchObject({
      isCurrent: true,
      isMostAdvanced: false,
      isCompleted: false,
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
