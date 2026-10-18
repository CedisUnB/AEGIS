import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { prisma } from "@/core/database/prisma";
import { cleanup, createStudent } from "../helpers/trail-fixtures";

const PREFIX = `__test_${randomUUID().slice(0, 8)}__`;

test.describe("trail-fixtures smoke test", () => {
  test.afterAll(async () => {
    try {
      await cleanup(PREFIX);
    } finally {
      await prisma.$disconnect();
    }
  });

  test("creates and cleans up a student in the configured database", async () => {
    const student = await createStudent(PREFIX);
    const persisted = await prisma.user.findUnique({
      where: { id: student.id },
      select: { email: true },
    });

    expect(persisted?.email).toBe(student.email);

    await cleanup(PREFIX);

    await expect(
      prisma.user.findUnique({ where: { id: student.id } }),
    ).resolves.toBeNull();
  });
});
