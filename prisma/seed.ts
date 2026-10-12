import { prisma } from "@/core/database/prisma";
import { NodeType, ExerciseType, Role } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const DEV_USER_EMAIL = "estudante.dev@safe.local";
const DEV_USER_PASSWORD = "DevSenha123!";

const DEMO_TRACK_THEMES = [
  "Shift-Left Security",
  "OWASP Top 10",
  "SQL Injection",
  "Security By Design",
  "Security Design",
  "Proteção de Dados",
  "Autenticação e Identidade",
  "Segurança de APIs",
  "Criptografia Aplicada",
  "Desenvolvimento Seguro",
  "Segurança em Nuvem",
];

const ADDITIONAL_DEMO_TRAILS = [
  {
    theme: "Proteção de Dados",
    lessonTitle: "Princípios de proteção de dados",
  },
  {
    theme: "Autenticação e Identidade",
    lessonTitle: "Fundamentos de autenticação e identidade",
  },
  {
    theme: "Segurança de APIs",
    lessonTitle: "Protegendo APIs e seus recursos",
  },
  {
    theme: "Criptografia Aplicada",
    lessonTitle: "Conceitos de criptografia aplicada",
  },
  {
    theme: "Desenvolvimento Seguro",
    lessonTitle: "Práticas de desenvolvimento seguro",
  },
  {
    theme: "Segurança em Nuvem",
    lessonTitle: "Controles de segurança em nuvem",
  },
];

async function resetDemoTracks() {
  await prisma.track.deleteMany({
    where: { theme: { in: DEMO_TRACK_THEMES } },
  });
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

async function seedBasicTrail(theme: string, lessonTitle: string) {
  const track = await seedTrack(theme);
  await seedLessonNode(track.id, 1, lessonTitle);
  await seedExerciseNode(track.id, 2, ExerciseType.revision);
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
  console.info("Removendo apenas as trilhas de demonstração...");
  await resetDemoTracks();

  const devUser = await seedDevUser();
  console.info(`Usuário de dev: ${devUser.email} / senha: ${DEV_USER_PASSWORD}`);

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

  // Trilhas 2 a 4 — mantêm cenários simples e temas cobertos no catálogo.
  await seedBasicTrail(
    "OWASP Top 10",
    "Introdução às vulnerabilidades mais críticas",
  );
  await seedBasicTrail("SQL Injection", "Como lidar com injeções de código");
  await seedBasicTrail(
    "Security By Design",
    "Princípios de segurança desde a concepção",
  );

  // Trilhas 5 a 10 — permitem visualizar o anel completo e a grade excedente.
  for (const trail of ADDITIONAL_DEMO_TRAILS) {
    await seedBasicTrail(trail.theme, trail.lessonTitle);
  }

  console.info("Seed concluído: 10 trilhas de demonstração.");
}

main()
  .catch((error) => {
    console.error("Erro ao rodar o seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });