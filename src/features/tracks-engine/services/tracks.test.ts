import { listTrackCatalogData } from "../repositories";
import { listTracks } from "./tracks";
import type { TrackCatalogEntry } from "../types";

jest.mock("../repositories", () => ({
  listTrackCatalogData: jest.fn(),
}));

const mockedListTrackCatalogData =
  listTrackCatalogData as jest.MockedFunction<typeof listTrackCatalogData>;

describe("listTracks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
