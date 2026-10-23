import { ProgressTrackingService } from "./progress-tracking";

jest.mock("../repositories/track-node.repository", () => ({
  TrackNodeRepository: jest.fn(),
}));
jest.mock("../repositories/progress.repository", () => ({
  ProgressRepository: jest.fn(),
}));

describe("ProgressTrackingService", () => {
  it("completes lessons with the last-node flag and rejects invalid nodes", async () => {
    const nodes = { findById: jest.fn(), isLastNodeOfTrack: jest.fn() };
    const progress = { completeLessonNode: jest.fn().mockResolvedValue({ id: 4 }) };
    const service = new ProgressTrackingService(nodes as never, progress as never, {} as never);
    nodes.findById.mockResolvedValue({ id: 4, trackId: 7, orderIndex: 2, nodeType: "lesson" });
    nodes.isLastNodeOfTrack.mockResolvedValue(true);
    await expect(service.completeLesson("u", 4)).resolves.toEqual({ id: 4 });
    expect(progress.completeLessonNode).toHaveBeenCalledWith("u", 4, 7, true);
    nodes.findById.mockResolvedValue(null);
    await expect(service.completeLesson("u", 4)).rejects.toThrow("Nó inválido");
    nodes.findById.mockResolvedValue({ id: 4, nodeType: "exercise" });
    await expect(service.completeLesson("u", 4)).rejects.toThrow("Nó inválido");
  });

  it("evaluates exercise submissions and persists the full transaction payload", async () => {
    const nodes = { findById: jest.fn(), findExercisesByNodeId: jest.fn(), isLastNodeOfTrack: jest.fn() };
    const progress = { saveExerciseSubmissionTransaction: jest.fn().mockResolvedValue(undefined) };
    const evaluation = {
      evaluateSubmission: jest.fn().mockReturnValue({
        score: 80,
        isNodeCompleted: true,
        result: { trackNodeId: 4, score: 80, isNodeCompleted: true },
        exerciseEvaluations: [{ exerciseId: 10, isCorrect: true }],
      }),
    };
    const service = new ProgressTrackingService(nodes as never, progress as never, evaluation as never);
    nodes.findById.mockResolvedValue({ id: 4, trackId: 7, orderIndex: 3, nodeType: "exercise" });
    nodes.findExercisesByNodeId.mockResolvedValue([{ id: 10 }]);
    nodes.isLastNodeOfTrack.mockResolvedValue(true);
    const submission = { trackNodeId: 4, exercises: [{ id: 10, value: 1 }] };
    await expect(service.submitExercises("u", submission)).resolves.toEqual({ trackNodeId: 4, score: 80, isNodeCompleted: true });
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
    const nodes = { findById: jest.fn(), findExercisesByNodeId: jest.fn() };
    const service = new ProgressTrackingService(nodes as never, {} as never, {} as never);
    nodes.findById.mockResolvedValue(null);
    await expect(service.submitExercises("u", { trackNodeId: 4, exercises: [] })).rejects.toThrow("Nó inválido");
    nodes.findById.mockResolvedValue({ id: 4, nodeType: "lesson" });
    await expect(service.submitExercises("u", { trackNodeId: 4, exercises: [] })).rejects.toThrow("Nó inválido");
    nodes.findById.mockResolvedValue({ id: 4, nodeType: "exercise" });
    nodes.findExercisesByNodeId.mockResolvedValue(null);
    await expect(service.submitExercises("u", { trackNodeId: 4, exercises: [] })).rejects.toThrow("Não existem exercícios");
    nodes.findExercisesByNodeId.mockResolvedValue([]);
    await expect(service.submitExercises("u", { trackNodeId: 4, exercises: [] })).rejects.toThrow("Não existem exercícios");
  });
});
