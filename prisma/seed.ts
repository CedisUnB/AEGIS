import { prisma } from "@/core/database/prisma";
import { NodeType, ExerciseType, Role } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const DEV_USER_EMAIL = "estudante.dev@safe.local";
const DEV_USER_PASSWORD = "DevSenha123!";

type DemoTrack = {
  theme: string;
  description: string;
  lessonTitle: string;
};

const DEMO_TRACK_THEMES = [
  "Shift-Left Security",
  "OWASP Top 10",
  "SQL Injection",
  "Security By Design",
  "Proteção de Dados",
  "Autenticação e Identidade",
  "Segurança de APIs",
  "Criptografia Aplicada",
  "Desenvolvimento Seguro",
  "Segurança em Nuvem",
];

const ADDITIONAL_DEMO_TRACKS: DemoTrack[] = [
  {
    theme: "Proteção de Dados",
    description:
      "Conheça princípios de privacidade, tratamento responsável de dados e medidas para protegê-los.",
    lessonTitle: "Princípios de proteção de dados",
  },
  {
    theme: "Autenticação e Identidade",
    description:
      "Explore autenticação, autorização, gestão de sessões e proteção de credenciais.",
    lessonTitle: "Fundamentos de autenticação e identidade",
  },
  {
    theme: "Segurança de APIs",
    description:
      "Pratique a proteção de APIs, validação de entradas e controle de acesso a recursos.",
    lessonTitle: "Protegendo APIs e seus recursos",
  },
  {
    theme: "Criptografia Aplicada",
    description:
      "Entenda como usar mecanismos criptográficos para proteger informações e comunicações.",
    lessonTitle: "Conceitos de criptografia aplicada",
  },
  {
    theme: "Desenvolvimento Seguro",
    description:
      "Aplique práticas de segurança ao longo do ciclo de desenvolvimento de software.",
    lessonTitle: "Práticas de desenvolvimento seguro",
  },
  {
    theme: "Segurança em Nuvem",
    description:
      "Explore controles e boas práticas para proteger aplicações e dados em ambientes de nuvem.",
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

async function seedTrack(theme: string, description: string) {
  return prisma.track.create({
    data: { theme, description },
  });
}

async function seedBasicTrack(
  theme: string,
  description: string,
  lessonTitle: string,
) {
  const track = await seedTrack(theme, description);
  const lessonNode = await seedLessonNode(track.id, 1, lessonTitle);
  const exerciseNode = await seedExerciseNode(
    track.id,
    2,
    ExerciseType.revision,
  );

  return { track, nodes: [lessonNode, exerciseNode] };
}

async function seedCompletedBasicTrack(
  theme: string,
  description: string,
  lessonTitle: string,
  userId: string,
) {
  const { track, nodes } = await seedBasicTrack(theme, description, lessonTitle);
  const completedAt = new Date();

  await prisma.progress.createMany({
    data: nodes.map((node) => ({
      userId,
      trackNodeId: node.id,
      isCompleted: true,
      completedAt,
    })),
  });
  await prisma.takes.create({
    data: {
      userId,
      trackId: track.id,
      status: "completed",
      completedAt,
    },
  });
}

async function seedSecureDevelopmentTrack(
  description: string,
  lessonTitles: string[],
) {
  const track = await seedTrack("Desenvolvimento Seguro", description);

  for (const [index, title] of lessonTitles.entries()) {
    const lessonOrder = index * 2 + 1;
    await seedLessonNode(track.id, lessonOrder, title);

    if (index < lessonTitles.length - 1) {
      await seedExerciseNode(track.id, lessonOrder + 1, ExerciseType.revision);
    } else {
      await seedExerciseNode(track.id, lessonOrder + 1, ExerciseType.test);
    }
  }
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
  const track1 = await seedTrack(
    "Shift-Left Security",
    "Aprenda a mover as verificações de segurança para o início do desenvolvimento, antes de chegarem à produção.",
  );
  const t1n1 = await seedLessonNode(track1.id, 1, "Por que Shift-Left importa");
  const t1n2 = await seedExerciseNode(track1.id, 2, ExerciseType.revision);
  const t1n3 = await seedLessonNode(track1.id, 3, "Secure by Design, Default e Deployment");
  const t1n4 = await seedExerciseNode(track1.id, 4, ExerciseType.revision);

  await seedExerciseNode(track1.id, 5, ExerciseType.test);

  await prisma.progress.createMany({
    data: [t1n1, t1n2, t1n3, t1n4].map((node) => ({
      userId: devUser.id,
      trackNodeId: node.id,
      isCompleted: true,
      completedAt: new Date(),
    })),
  });
  // FIM DO TRECHO TEMPORÁRIO

  await prisma.takes.create({
    data: { userId: devUser.id, trackId: track1.id, status: "in_progress" },
  });

  // Trilhas 2 a 4 — mantêm cenários simples e temas cobertos no catálogo.
  await seedBasicTrack(
    "OWASP Top 10",
    "Conheça as vulnerabilidades mais críticas de aplicações web e como preveni-las na prática.",
    "Introdução às vulnerabilidades mais críticas",
  );
  await seedBasicTrack(
    "SQL Injection",
    "Como lidar com injeções de código.",
    "Como lidar com injeções de código",
  );
  await seedBasicTrack(
    "Security By Design",
    "Aprenda sobre Design Seguro, que aplica práticas de segurança em todo o ciclo de desenvolvimento de software desde a etapa inicial de requisitos e design.",
    "Princípios de segurança desde a concepção",
  );

  // Trilhas 5 a 10 — permitem visualizar o anel completo e a grade excedente.
  for (const track of ADDITIONAL_DEMO_TRACKS) {
    if (track.theme === "Criptografia Aplicada") {
      await seedCompletedBasicTrack(
        track.theme,
        track.description,
        track.lessonTitle,
        devUser.id,
      );
    } else if (track.theme === "Desenvolvimento Seguro") {
      await seedSecureDevelopmentTrack(track.description, [
        "Fundamentos do desenvolvimento seguro",
        "Modelagem de ameaças e análise de riscos",
        "Validação de entradas e prevenção de injeções",
        "Revisão de código e segurança no ciclo de desenvolvimento",
      ]);
    } else {
      await seedBasicTrack(track.theme, track.description, track.lessonTitle);
    }
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