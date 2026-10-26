import { listTrackCatalogData, startTrack as startTrackRecord } from "../repositories";
import { listTracks, startTrack } from "./tracks";
import type { TrackCatalogEntry } from "../types";

jest.mock("../repositories", () => ({
  listTrackCatalogData: jest.fn(),
  startTrack: jest.fn(),
}));

const mockedListTrackCatalogData =
  listTrackCatalogData as jest.MockedFunction<typeof listTrackCatalogData>;
const mockedStartTrackRecord =
  startTrackRecord as jest.MockedFunction<typeof startTrackRecord>;

describe("listTracks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("startTrack", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("starts the track through the repository", async () => {
      await expect(startTrack("user-123", 11)).resolves.toBeUndefined();

      expect(mockedStartTrackRecord).toHaveBeenCalledWith("user-123", 11);
    });

    it("logs repository errors and throws a generic start error", async () => {
      const repositoryError = new Error("database connection details");
      const consoleError = jest.spyOn(console, "error").mockImplementation();
      mockedStartTrackRecord.mockRejectedValueOnce(repositoryError);

      try {
        await expect(startTrack("user-123", 11)).rejects.toThrow(
          "Não foi possível iniciar a trilha.",
        );
        expect(consoleError).toHaveBeenCalledWith(
          "Falha ao iniciar a trilha.",
          repositoryError,
        );
      } finally {
        consoleError.mockRestore();
      }
    });
  });

  it("returns the catalog entries, including persisted descriptions", async () => {
    const catalog: TrackCatalogEntry[] = [
      {
        id: 11,
        theme: "Shift-Left Security",
        description: "Descrição salva no banco.",
        totalNodes: 4,
        completedNodes: 2,
        isStarted: true,
      },
      {
        id: 12,
        theme: "OWASP Top 10",
        description: "Outra descrição salva no banco.",
        totalNodes: 2,
        completedNodes: 0,
        isStarted: false,
      },
    ];
    mockedListTrackCatalogData.mockResolvedValueOnce(catalog);

    await expect(listTracks("user-123")).resolves.toBe(catalog);
    expect(mockedListTrackCatalogData).toHaveBeenCalledWith("user-123");
  });

  it("returns an empty list when no tracks exist", async () => {
    mockedListTrackCatalogData.mockResolvedValueOnce([]);

    await expect(listTracks()).resolves.toEqual([]);
  });

  it("logs repository errors and throws a generic catalog error", async () => {
    const repositoryError = new Error("database connection details");
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    mockedListTrackCatalogData.mockRejectedValueOnce(repositoryError);

    try {
      await expect(listTracks()).rejects.toThrow(
        "Não foi possível carregar o catálogo de trilhas.",
      );
      expect(consoleError).toHaveBeenCalledWith(
        "Falha ao carregar o catálogo de trilhas.",
        repositoryError,
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});
