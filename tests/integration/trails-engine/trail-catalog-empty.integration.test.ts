/**
 * @jest-environment node
 */
import { randomUUID } from "node:crypto";
import { prisma } from "@/core/database/prisma";
import { listTrailCatalogData } from "@/features/trails-engine/repositories";
import { listTrails } from "@/features/trails-engine/services/trails";
import { cleanup } from "../../helpers/trail-fixtures";

jest.mock("@/features/trails-engine/repositories", () => ({
  listTrailCatalogData: jest.fn(),
}));

const PREFIX = `__test_${randomUUID().slice(0, 8)}__`;

jest.setTimeout(30000);

describe("Catálogo de trilhas vazio (US06)", () => {
  afterAll(async () => {
    try {
      await cleanup(PREFIX);
    } finally {
      await prisma.$disconnect();
    }
  }, 30000);

  it("retorna uma lista vazia quando o repository não encontra trilhas", async () => {
    jest.mocked(listTrailCatalogData).mockResolvedValueOnce([]);

    await expect(listTrails()).resolves.toEqual([]);
  });
});
