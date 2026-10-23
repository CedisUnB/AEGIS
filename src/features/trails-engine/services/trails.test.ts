import { listTrailCatalogData } from "../repositories";
import { listTrails } from "./trails";
import type { TrailCatalogEntry } from "../types";

jest.mock("../repositories", () => ({
  listTrailCatalogData: jest.fn(),
}));

const mockedListTrailCatalogData =
  listTrailCatalogData as jest.MockedFunction<typeof listTrailCatalogData>;

describe("listTrails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the catalog entries, including persisted descriptions", async () => {
    const catalog: TrailCatalogEntry[] = [
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
    mockedListTrailCatalogData.mockResolvedValueOnce(catalog);

    await expect(listTrails("user-123")).resolves.toBe(catalog);
    expect(mockedListTrailCatalogData).toHaveBeenCalledWith("user-123");
  });

  it("returns an empty list when no tracks exist", async () => {
    mockedListTrailCatalogData.mockResolvedValueOnce([]);

    await expect(listTrails()).resolves.toEqual([]);
  });

  it("logs repository errors and throws a generic catalog error", async () => {
    const repositoryError = new Error("database connection details");
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    mockedListTrailCatalogData.mockRejectedValueOnce(repositoryError);

    try {
      await expect(listTrails()).rejects.toThrow(
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
