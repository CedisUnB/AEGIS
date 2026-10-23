/**
 * @jest-environment node
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/core/database/prisma";
import { getSession } from "@/core/security";
import {
  completeLessonAction,
  getExercisesContentAction,
  getLessonContentAction,
  getNodeTypeAction,
  submitExercisesAction,
} from "@/features/content/actions";
import {
  cleanup,
  completeNodes,
  createStudent,
  createTestPrefix,
  createTrail,
  startTrail,
} from "../helpers/trail-fixtures";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn((path: string) => {
    throw new Error(`Redirected to ${path}`);
  }),
}));

jest.mock("@/core/security", () => ({
  getSession: jest.fn(),
}));

const PREFIX = createTestPrefix();
const mockedGetSession = jest.mocked(getSession);
const mockedRedirect = jest.mocked(redirect);

jest.setTimeout(30000);

async function setExerciseContent(
  trackNodeId: number,
  type: "revision" | "test",
  questionCount: number,
) {
  const questions = Array.from({ length: questionCount }, (_, index) => ({
    questionType: "multiple_choice",
    prompt: `Pergunta de integração ${index + 1}`,
    options: ["Resposta correta", "Resposta incorreta"],
    correctAnswer: 0,
    explanation: `Explicação ${index + 1}`,
  }));
  const existingExercises = await prisma.exercise.findMany({
    where: { trackNodeId },
    orderBy: { id: "asc" },
  });

  if (existingExercises.length === 0) {
    throw new Error(`Não há exercício de fixture para o nó ${trackNodeId}.`);
  }

  await prisma.exercise.update({
    where: { id: existingExercises[0].id },
    data: { type, json: questions[0] },
  });

  for (const question of questions.slice(1)) {
    await prisma.exercise.create({
      data: { trackNodeId, type, json: question },
    });
  }

  return prisma.exercise.findMany({
    where: { trackNodeId },
    orderBy: { id: "asc" },
  });
}

function makeSubmission(
  trackNodeId: number,
  exercises: { id: number }[],
  correctCount: number,
) {
  return {
    trackNodeId,
    exercises: exercises.map((exercise, index) => ({
      id: exercise.id,
      value: index < correctCount ? 0 : 1,
    })),
  };
}

describe("Integração da feature content", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    try {
      await cleanup(PREFIX);
    } finally {
      await prisma.$disconnect();
    }
  }, 30000);

  it("entrega lições, protege exercícios ainda bloqueados e registra conclusão de leitura", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: true,
    });
    const firstLessonNodeId = trail.contentNodeIds[0];
    const regularExerciseNodeId = trail.contentNodeIds[1];
    await setExerciseContent(regularExerciseNodeId, "revision", 2);
    mockedGetSession.mockResolvedValue({
      sub: student.id,
      role: "student",
    });

    const lesson = await getLessonContentAction(firstLessonNodeId);
    expect(lesson).toMatchObject({
      success: true,
      statusCode: 200,
      data: {
        id: firstLessonNodeId,
        nodeType: "lesson",
        trackId: trail.id,
      },
    });

    const blockedExercises = await getExercisesContentAction(regularExerciseNodeId);
    expect(blockedExercises).toMatchObject({
      success: false,
      statusCode: 500,
      error: expect.stringContaining("Acesso bloqueado"),
    });

    const completion = await completeLessonAction(firstLessonNodeId, trail.id);
    expect(completion).toEqual({
      success: true,
      statusCode: 200,
      data: { message: "Leitura concluída com sucesso." },
    });
    expect(revalidatePath).toHaveBeenCalledWith(`/tracks/${trail.id}`);
    await expect(
      prisma.progress.findUnique({
        where: {
          userId_trackNodeId: {
            userId: student.id,
            trackNodeId: firstLessonNodeId,
          },
        },
      }),
    ).resolves.toMatchObject({
      isCompleted: true,
      score: 100,
      attemptsCount: 1,
    });

    const exercises = await getExercisesContentAction(regularExerciseNodeId);
    expect(exercises).toMatchObject({
      success: true,
      data: {
        id: regularExerciseNodeId,
        nodeType: "exercise",
        exercises: [
          {
            type: "revision",
            json: {
              questionType: "multiple_choice",
              prompt: "Pergunta de integração 1",
              options: ["Resposta correta", "Resposta incorreta"],
            },
          },
          {
            type: "revision",
            json: {
              questionType: "multiple_choice",
              prompt: "Pergunta de integração 2",
              options: ["Resposta correta", "Resposta incorreta"],
            },
          },
        ],
      },
    });
    if (exercises.success) {
      for (const exercise of exercises.data.exercises) {
        expect(exercise.json).not.toHaveProperty("correctAnswer");
        expect(exercise.json).not.toHaveProperty("explanation");
      }
    }

    await expect(getNodeTypeAction(firstLessonNodeId)).resolves.toEqual({
      success: true,
      statusCode: 200,
      data: { nodeType: "lesson" },
    });

    mockedGetSession.mockResolvedValue(null);
    const unauthenticated = await getLessonContentAction(firstLessonNodeId);
    expect(unauthenticated).toMatchObject({
      success: false,
      statusCode: 500,
      error: "Redirected to auth/login",
    });
    expect(mockedRedirect).toHaveBeenCalledWith("auth/login");
  });

  it("avalia exercícios de revisão com corte de 60% e mantém melhor nota e tentativas", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: true,
    });
    const lessonNodeId = trail.contentNodeIds[0];
    const regularExerciseNodeId = trail.contentNodeIds[1];
    const exercises = await setExerciseContent(
      regularExerciseNodeId,
      "revision",
      2,
    );
    await completeNodes(student.id, [lessonNodeId]);
    mockedGetSession.mockResolvedValue({
      sub: student.id,
      role: "student",
    });

    const failedAttempt = await submitExercisesAction(
      trail.id,
      makeSubmission(regularExerciseNodeId, exercises, 1),
    );
    expect(failedAttempt).toMatchObject({
      success: true,
      data: {
        trackNodeId: regularExerciseNodeId,
        score: 50,
        passingScore: 60,
        isFinalTest: false,
        isNodeCompleted: false,
      },
    });
    await expect(
      prisma.progress.findUnique({
        where: {
          userId_trackNodeId: {
            userId: student.id,
            trackNodeId: regularExerciseNodeId,
          },
        },
      }),
    ).resolves.toMatchObject({
      isCompleted: false,
      score: 50,
      attemptsCount: 1,
    });
    expect(revalidatePath).not.toHaveBeenCalled();

    const passedAttempt = await submitExercisesAction(
      trail.id,
      makeSubmission(regularExerciseNodeId, exercises, 2),
    );
    expect(passedAttempt).toMatchObject({
      success: true,
      data: {
        score: 100,
        passingScore: 60,
        isNodeCompleted: true,
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith(`/tracks/${trail.id}`);

    const progress = await prisma.progress.findUnique({
      where: {
        userId_trackNodeId: {
          userId: student.id,
          trackNodeId: regularExerciseNodeId,
        },
      },
    });
    expect(progress).toMatchObject({
      isCompleted: true,
      score: 100,
      attemptsCount: 2,
      completedAt: expect.any(Date),
    });

    const answers = await prisma.answers.findMany({
      where: { userId: student.id },
      orderBy: { exerciseId: "asc" },
    });
    expect(answers).toHaveLength(2);
    expect(answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          exerciseId: exercises[0].id,
          isCompleted: true,
          attemptsCount: 2,
          correctCount: 2,
          incorrectCount: 0,
        }),
        expect.objectContaining({
          exerciseId: exercises[1].id,
          isCompleted: true,
          attemptsCount: 2,
          correctCount: 1,
          incorrectCount: 1,
        }),
      ]),
    );
  });

  it("exige 80% no teste final e só conclui a trilha quando a nota atinge o corte", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: true,
    });
    if (trail.finalTestNodeId === null) {
      throw new Error("A fixture deveria incluir um teste final.");
    }
    const finalTestExercises = await setExerciseContent(
      trail.finalTestNodeId,
      "test",
      5,
    );
    await completeNodes(student.id, trail.contentNodeIds);
    await startTrail(student.id, trail.id);
    mockedGetSession.mockResolvedValue({
      sub: student.id,
      role: "student",
    });

    const rejected = await submitExercisesAction(
      trail.id,
      makeSubmission(trail.finalTestNodeId, finalTestExercises, 3),
    );
    expect(rejected).toMatchObject({
      success: true,
      data: {
        score: 60,
        passingScore: 80,
        isFinalTest: true,
        isNodeCompleted: false,
      },
    });
    await expect(
      prisma.takes.findUnique({
        where: { userId_trackId: { userId: student.id, trackId: trail.id } },
      }),
    ).resolves.toMatchObject({ status: "in_progress", completedAt: null });
    expect(revalidatePath).not.toHaveBeenCalled();

    const passed = await submitExercisesAction(
      trail.id,
      makeSubmission(trail.finalTestNodeId, finalTestExercises, 4),
    );
    expect(passed).toMatchObject({
      success: true,
      data: {
        score: 80,
        passingScore: 80,
        isFinalTest: true,
        isNodeCompleted: true,
      },
    });
    await expect(
      prisma.takes.findUnique({
        where: { userId_trackId: { userId: student.id, trackId: trail.id } },
      }),
    ).resolves.toMatchObject({
      status: "completed",
      completedAt: expect.any(Date),
    });
    expect(revalidatePath).toHaveBeenCalledWith(`/tracks/${trail.id}`);
  });

  it("rejeita payload inválido sem gravar progresso ou respostas", async () => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 1,
      withFinalTest: false,
    });
    mockedGetSession.mockResolvedValue({
      sub: student.id,
      role: "student",
    });

    const response = await submitExercisesAction(trail.id, {
      trackNodeId: trail.contentNodeIds[1],
      exercises: [],
    });

    expect(response).toMatchObject({
      success: false,
      statusCode: 500,
      error: expect.any(String),
    });
    await expect(prisma.progress.count({ where: { userId: student.id } })).resolves.toBe(0);
    await expect(prisma.answers.count({ where: { userId: student.id } })).resolves.toBe(0);
  });
});
