import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/core/security";
import { ContentDeliveryService } from "./services/content-delivery";
import { ProgressTrackingService } from "./services/progress-tracking";
import {
  completeLessonAction,
  getExercisesContentAction,
  getLessonContentAction,
  getNodeTypeAction,
  submitExercisesAction,
} from "./actions";

jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.mock("next/navigation", () => ({
  redirect: jest.fn((path: string) => { throw new Error(`redirect:${path}`); }),
}));
jest.mock("@/core/security", () => ({ getSession: jest.fn() }));
jest.mock("./services/content-delivery", () => ({
  ContentDeliveryService: jest.fn().mockImplementation(() => ({
    getLessonContent: jest.fn(),
    getExercisesContent: jest.fn(),
    validateNodeAccess: jest.fn(),
  })),
}));
jest.mock("./services/progress-tracking", () => ({
  ProgressTrackingService: jest.fn().mockImplementation(() => ({
    completeLesson: jest.fn(),
    submitExercises: jest.fn(),
  })),
}));

const delivery = (ContentDeliveryService as jest.Mock).mock.results[0].value as {
  getLessonContent: jest.Mock;
  getExercisesContent: jest.Mock;
  validateNodeAccess: jest.Mock;
};
const tracking = (ProgressTrackingService as jest.Mock).mock.results[0].value as {
  completeLesson: jest.Mock;
  submitExercises: jest.Mock;
};
const sessionMock = getSession as jest.MockedFunction<typeof getSession>;

describe("content server actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionMock.mockResolvedValue({ sub: "user-1" } as Awaited<ReturnType<typeof getSession>>);
  });

  it("returns lesson and exercise content for authenticated users", async () => {
    const lesson = { id: 3, title: "Lição" };
    const exercises = { id: 4, exercises: [] };
    delivery.getLessonContent.mockResolvedValue(lesson);
    delivery.getExercisesContent.mockResolvedValue(exercises);

    await expect(getLessonContentAction(3)).resolves.toEqual({ success: true, statusCode: 200, data: lesson });
    await expect(getExercisesContentAction(4)).resolves.toEqual({ success: true, statusCode: 200, data: exercises });
    expect(delivery.getLessonContent).toHaveBeenCalledWith("user-1", 3);
    expect(delivery.getExercisesContent).toHaveBeenCalledWith("user-1", 4);
  });

  it("surfaces content errors and authentication redirects as action errors", async () => {
    delivery.getLessonContent.mockRejectedValueOnce(new Error("Falha lição"));
    await expect(getLessonContentAction(3)).resolves.toEqual({ success: false, statusCode: 500, error: "Falha lição" });
    delivery.getExercisesContent.mockRejectedValueOnce(new Error(""));
    await expect(getExercisesContentAction(4)).resolves.toEqual({
      success: false,
      statusCode: 500,
      error: "Erro ao carregar os exercícios.",
    });
    sessionMock.mockResolvedValueOnce(null as Awaited<ReturnType<typeof getSession>>);
    await expect(getLessonContentAction(3)).resolves.toEqual({
      success: false,
      statusCode: 500,
      error: "redirect:auth/login",
    });
    expect(redirect).toHaveBeenCalledWith("auth/login");
  });

  it("completes lessons and revalidates the associated track", async () => {
    tracking.completeLesson.mockResolvedValue(undefined);
    await expect(completeLessonAction(8, 12)).resolves.toEqual({
      success: true,
      statusCode: 200,
      data: { message: "Leitura concluída com sucesso." },
    });
    expect(tracking.completeLesson).toHaveBeenCalledWith("user-1", 8);
    expect(revalidatePath).toHaveBeenCalledWith("/tracks/12");

    tracking.completeLesson.mockRejectedValueOnce(new Error("Não foi possível concluir"));
    await expect(completeLessonAction(8, 12)).resolves.toEqual({
      success: false,
      statusCode: 500,
      error: "Não foi possível concluir",
    });
  });

  it("validates and submits exercises and only revalidates completed nodes", async () => {
    const result = {
      trackNodeId: 8,
      isNodeCompleted: true,
      score: 80,
      passingScore: 80,
      isFinalTest: true,
      exercises: [{ id: 1, isCorrect: true }],
    };
    tracking.submitExercises.mockResolvedValue(result);
    const payload = { trackNodeId: 8, exercises: [{ id: 1, value: 2 }] };
    await expect(submitExercisesAction(12, payload)).resolves.toEqual({ success: true, statusCode: 200, data: result });
    expect(tracking.submitExercises).toHaveBeenCalledWith("user-1", payload);
    expect(revalidatePath).toHaveBeenCalledWith("/tracks/12");

    (revalidatePath as jest.Mock).mockClear();
    tracking.submitExercises.mockResolvedValueOnce({ ...result, isNodeCompleted: false });
    await submitExercisesAction(12, payload);
    expect(revalidatePath).not.toHaveBeenCalled();
    await expect(submitExercisesAction(12, { trackNodeId: 8, exercises: [] })).resolves.toMatchObject({
      success: false,
      statusCode: 500,
    });
    tracking.submitExercises.mockRejectedValueOnce(new Error("Falha ao corrigir"));
    await expect(submitExercisesAction(12, payload)).resolves.toEqual({
      success: false,
      statusCode: 500,
      error: "Falha ao corrigir",
    });
  });

  it("returns the validated node type and handles lookup errors", async () => {
    delivery.validateNodeAccess.mockResolvedValue({ nodeType: "lesson" });
    await expect(getNodeTypeAction(3)).resolves.toEqual({
      success: true,
      statusCode: 200,
      data: { nodeType: "lesson" },
    });
    delivery.validateNodeAccess.mockRejectedValueOnce(new Error("Nó inacessível"));
    await expect(getNodeTypeAction(3)).resolves.toEqual({
      success: false,
      statusCode: 500,
      error: "Nó inacessível",
    });
  });
});
