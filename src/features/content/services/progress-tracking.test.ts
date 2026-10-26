import { ProgressTrackingService } from "./progress-tracking";

jest.mock("../repositories/track-node.repository", () => ({
  TrackNodeRepository: jest.fn(),
}));
jest.mock("../repositories/progress.repository", () => ({
  ProgressRepository: jest.fn(),
}));

describe("ProgressTrackingService", () => {
  it("completes lessons with the last-node flag and rejects invalid nodes", async () => {
    const nodes = { isLastNodeOfTrack: jest.fn() };
    const progress = { completeLessonNode: jest.fn().mockResolvedValue({ id: 4 }) };
    const delivery = { validateNodeAccess: jest.fn() };
    const service = new ProgressTrackingService(
      nodes as never,
      progress as never,
      {} as never,
      delivery as never,
    );
    delivery.validateNodeAccess.mockResolvedValue({ id: 4, trackId: 7, orderIndex: 2, nodeType: "lesson" });
    nodes.isLastNodeOfTrack.mockResolvedValue(true);
    await expect(service.completeLesson("u", 4)).resolves.toEqual({ id: 4 });
    expect(delivery.validateNodeAccess).toHaveBeenCalledWith("u", 4);
    expect(progress.completeLessonNode).toHaveBeenCalledWith("u", 4, 7, true);
    delivery.validateNodeAccess.mockResolvedValue({ id: 4, nodeType: "exercise" });
    await expect(service.completeLesson("u", 4)).rejects.toThrow("Nó inválido");
    delivery.validateNodeAccess.mockRejectedValueOnce(new Error("Acesso bloqueado"));
    await expect(service.completeLesson("u", 4)).rejects.toThrow("Acesso bloqueado");
    expect(progress.completeLessonNode).toHaveBeenCalledTimes(1);
  });

  it("evaluates exercise submissions and persists the full transaction payload", async () => {
    const nodes = { findExercisesByNodeId: jest.fn(), isLastNodeOfTrack: jest.fn() };
    const progress = { saveExerciseSubmissionTransaction: jest.fn().mockResolvedValue(undefined) };
    const delivery = { validateNodeAccess: jest.fn() };
    const evaluation = {
      evaluateSubmission: jest.fn().mockReturnValue({
        score: 80,
        isNodeCompleted: true,
        result: { trackNodeId: 4, score: 80, isNodeCompleted: true },
        exerciseEvaluations: [{ exerciseId: 10, isCorrect: true }],
      }),
    };
    const service = new ProgressTrackingService(
      nodes as never,
      progress as never,
      evaluation as never,
      delivery as never,
    );
    delivery.validateNodeAccess.mockResolvedValue({ id: 4, trackId: 7, orderIndex: 3, nodeType: "exercise" });
    nodes.findExercisesByNodeId.mockResolvedValue([{ id: 10 }]);
    nodes.isLastNodeOfTrack.mockResolvedValue(true);
    const submission = { trackNodeId: 4, exercises: [{ id: 10, value: 1 }] };
    await expect(service.submitExercises("u", submission)).resolves.toEqual({ trackNodeId: 4, score: 80, isNodeCompleted: true });
    expect(delivery.validateNodeAccess).toHaveBeenCalledWith("u", 4);
    expect(evaluation.evaluateSubmission).toHaveBeenCalledWith(submission, [{ id: 10 }], true);
    expect(progress.saveExerciseSubmissionTransaction).toHaveBeenCalledWith({
      userId: "u",
      trackNodeId: 4,
      trackId: 7,
      score: 80,
      isNodeCompleted: true,
      isLastTrackNode: true,
      exerciseEvaluations: [{ exerciseId: 10, isCorrect: true }],
    });
  });

  it("rejects missing/wrong nodes and nodes without exercises", async () => {
    const nodes = { findExercisesByNodeId: jest.fn() };
    const progress = { saveExerciseSubmissionTransaction: jest.fn() };
    const delivery = { validateNodeAccess: jest.fn() };
    const service = new ProgressTrackingService(
      nodes as never,
      progress as never,
      {} as never,
      delivery as never,
    );
    delivery.validateNodeAccess.mockRejectedValue(new Error("Nó da trilha não encontrado."));
    await expect(service.submitExercises("u", { trackNodeId: 4, exercises: [] })).rejects.toThrow("Nó da trilha não encontrado");
    delivery.validateNodeAccess.mockResolvedValue({ id: 4, nodeType: "lesson" });
    await expect(service.submitExercises("u", { trackNodeId: 4, exercises: [] })).rejects.toThrow("Nó inválido");
    delivery.validateNodeAccess.mockResolvedValue({ id: 4, nodeType: "exercise" });
    nodes.findExercisesByNodeId.mockResolvedValue(null);
    await expect(service.submitExercises("u", { trackNodeId: 4, exercises: [] })).rejects.toThrow("Não existem exercícios");
    nodes.findExercisesByNodeId.mockResolvedValue([]);
    await expect(service.submitExercises("u", { trackNodeId: 4, exercises: [] })).rejects.toThrow("Não existem exercícios");
    delivery.validateNodeAccess.mockRejectedValueOnce(new Error("Acesso bloqueado"));
    await expect(service.submitExercises("u", { trackNodeId: 4, exercises: [] })).rejects.toThrow("Acesso bloqueado");
    expect(progress.saveExerciseSubmissionTransaction).not.toHaveBeenCalled();
  });
});
