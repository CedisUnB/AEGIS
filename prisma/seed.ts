import { prisma } from "@/core/database/prisma";
import { NodeType, ExerciseType, Role } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const DEV_USER_EMAIL = "estudante.dev@safe.local";
const DEV_USER_PASSWORD = "DevSenha123!";

async function resetData() {
  // Ordem importa por causa das FKs (mesmo com onDelete: Cascade,
  // ser explícito deixa claro o que o seed está limpando).
  await prisma.answers.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.takes.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.trackNode.deleteMany();
  await prisma.track.deleteMany();
}

async function seedDevUser() {
  const passwordHash = await bcrypt.hash(DEV_USER_PASSWORD, 10);

  return prisma.user.upsert({
    where: { email: DEV_USER_EMAIL },
    update: {},
    create: {
      email: DEV_USER_EMAIL,
      username: "Estudante Dev",
      password: passwordHash,
      role: Role.student,
    },
  });
}

async function seedTrack(theme: string) {
  return prisma.track.create({
    data: { theme },
  });
}

async function seedLessonNode(trackId: number, orderIndex: number, title: string) {
  const node = await prisma.trackNode.create({
    data: { trackId, nodeType: NodeType.lesson, orderIndex },
  });

  await prisma.lesson.create({
    data: {
      trackNodeId: node.id,
      title,
      json: {
        slides: [
          {
            tag: "Introdução",
            title,
            body: "<p>Conteúdo de exemplo gerado pelo seed de desenvolvimento.</p>",
            source: null,
          },
        ],
      },
    },
  });

  return node;
}

async function seedExerciseNode(
  trackId: number,
  orderIndex: number,
  exerciseType: ExerciseType,
) {
  const node = await prisma.trackNode.create({
    data: { trackId, nodeType: NodeType.exercise, orderIndex },
  });

  await prisma.exercise.create({
    data: {
      trackNodeId: node.id,
      type: exerciseType,
      json: {
        type: "multiple_choice",
        prompt: "Pergunta de exemplo gerada pelo seed.",
        options: ["Opção A", "Opção B", "Opção C"],
        correctOption: 0,
        feedback: "Explicação de exemplo para a resposta incorreta.",
      },
    },
  });

  return node;
}

async function main() {
  console.log("Resetando dados de trilhas/nós/progresso...");
  await resetData();

  const devUser = await seedDevUser();
  console.log(`Usuário de dev: ${devUser.email} / senha: ${DEV_USER_PASSWORD}`);

  // Trilha 1 — com progresso parcial, pra testar o card "já iniciada" (US06)
  const track1 = await seedTrack("Shift-Left Security");
  const t1n1 = await seedLessonNode(track1.id, 1, "Por que Shift-Left importa");
  const t1n2 = await seedExerciseNode(track1.id, 2, ExerciseType.revision);
  await seedLessonNode(track1.id, 3, "Secure by Design, Default e Deployment");
  await seedExerciseNode(track1.id, 4, ExerciseType.revision);

  await prisma.progress.create({
    data: { userId: devUser.id, trackNodeId: t1n1.id, isCompleted: true, completedAt: new Date() },
  });
  await prisma.progress.create({
    data: { userId: devUser.id, trackNodeId: t1n2.id, isCompleted: true, completedAt: new Date() },
  });
  await prisma.takes.create({
    data: { userId: devUser.id, trackId: track1.id, status: "in_progress" },
  });

  // Trilha 2 — sem nenhum progresso, pra testar o card "não iniciada"
  const track2 = await seedTrack("OWASP Top 10");
  await seedLessonNode(track2.id, 1, "Introdução às vulnerabilidades mais críticas");
  await seedExerciseNode(track2.id, 2, ExerciseType.revision);

  // Trilha 3 — outra sem progresso, pra ver o grid com mais de um card "zerado"
  const track3 = await seedTrack("SQL Injection");
  await seedLessonNode(track3.id, 1, "Como lidar com injeções de código");
  await seedExerciseNode(track3.id, 2, ExerciseType.revision);

  console.log("Seed concluído.");
}

main()
  .catch((error) => {
    console.error("Erro ao rodar o seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });