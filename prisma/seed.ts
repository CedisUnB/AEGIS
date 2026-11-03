import { prisma } from "../src/core/database/prisma";

async function runProductionSeed(): Promise<void> {
  throw new Error(
    "O seed de produção ainda não foi implementado. Não execute este comando até adicionar dados seguros e idempotentes.",
  );
}

runProductionSeed()
  .catch((error: unknown) => {
    console.error("Falha ao executar o seed de produção:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
