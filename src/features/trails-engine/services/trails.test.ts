import { listTrailCatalogData } from "../repositories";
import { describeTheme, listTrails } from "./trails";

jest.mock("../repositories", () => ({
  listTrailCatalogData: jest.fn(),
}));

const mockedListTrailCatalogData =
  listTrailCatalogData as jest.MockedFunction<typeof listTrailCatalogData>;

describe("describeTheme", () => {
  it.each([
    [
      "Shift-Left Security",
      "Aprenda a mover as verificações de segurança para o início do desenvolvimento, antes de chegarem à produção.",
    ],
    [
      "OWASP Top 10",
      "Conheça as vulnerabilidades mais críticas de aplicações web e como preveni-las na prática.",
    ],
    ["SQL Injection", "Como lidar com injeções de código."],
    [
      "Proteção de Dados",
      "Conheça princípios de privacidade, tratamento responsável de dados e medidas para protegê-los.",
    ],
    [
      "Autenticação e Identidade",
      "Explore autenticação, autorização, gestão de sessões e proteção de credenciais.",
    ],
    [
      "Segurança de APIs",
      "Pratique a proteção de APIs, validação de entradas e controle de acesso a recursos.",
    ],
    [
      "Criptografia Aplicada",
      "Entenda como usar mecanismos criptográficos para proteger informações e comunicações.",
    ],
    [
      "Desenvolvimento Seguro",
      "Aplique práticas de segurança ao longo do ciclo de desenvolvimento de software.",
    ],
    [
      "Segurança em Nuvem",
      "Explore controles e boas práticas para proteger aplicações e dados em ambientes de nuvem.",
    ],
  ])("returns the mapped description for the seed theme %s", (theme, expected) => {
    expect(describeTheme(theme)).toBe(expected);
  });

  it("normalizes whitespace and letter casing before looking up a description", () => {
    expect(describeTheme("  sHiFt-LeFt SeCuRiTy  ")).toBe(
      "Aprenda a mover as verificações de segurança para o início do desenvolvimento, antes de chegarem à produção.",
    );
  });

  it("uses the placeholder and warns when a theme has no description", () => {
    const consoleWarn = jest.spyOn(console, "warn").mockImplementation();

    try {
      expect(describeTheme("Tema sem descrição")).toBe(
        "Descrição da trilha pendente.",
      );
      expect(consoleWarn).toHaveBeenCalledWith(
        '[trails] Sem descrição mapeada para o tema "Tema sem descrição".',
      );
    } finally {
      consoleWarn.mockRestore();
    }
  });
});

describe("listTrails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("enriches repository data with a description for each card", async () => {
    mockedListTrailCatalogData.mockResolvedValueOnce([
      {
        id: 11,
        theme: "Shift-Left Security",
        totalNodes: 4,
        completedNodes: 2,
        isStarted: true,
      },
      {
        id: 12,
        theme: "OWASP Top 10",
        totalNodes: 2,
        completedNodes: 0,
        isStarted: false,
      },
      {
        id: 13,
        theme: "SQL Injection",
        totalNodes: 2,
        completedNodes: 0,
        isStarted: false,
      },
    ]);

    await expect(listTrails("user-123")).resolves.toEqual(
      [
        {
          id: 11,
          theme: "Shift-Left Security",
          description:
            "Aprenda a mover as verificações de segurança para o início do desenvolvimento, antes de chegarem à produção.",
          totalNodes: 4,
          completedNodes: 2,
          isStarted: true,
        },
        {
          id: 12,
          theme: "OWASP Top 10",
          description:
            "Conheça as vulnerabilidades mais críticas de aplicações web e como preveni-las na prática.",
          totalNodes: 2,
          completedNodes: 0,
          isStarted: false,
        },
        {
          id: 13,
          theme: "SQL Injection",
          description: "Como lidar com injeções de código.",
          totalNodes: 2,
          completedNodes: 0,
          isStarted: false,
        },
      ],
    );
    expect(mockedListTrailCatalogData).toHaveBeenCalledWith("user-123");
  });

  it("keeps the placeholder as fallback for unmapped themes", async () => {
    const consoleWarn = jest.spyOn(console, "warn").mockImplementation();
    mockedListTrailCatalogData.mockResolvedValueOnce([
      {
        id: 14,
        theme: "Tema futuro",
        totalNodes: 1,
        completedNodes: 0,
        isStarted: false,
      },
    ]);

    try {
      await expect(listTrails()).resolves.toEqual([
        {
          id: 14,
          theme: "Tema futuro",
          description: "Descrição da trilha pendente.",
          totalNodes: 1,
          completedNodes: 0,
          isStarted: false,
        },
      ]);
      expect(consoleWarn).toHaveBeenCalledTimes(1);
    } finally {
      consoleWarn.mockRestore();
    }
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
