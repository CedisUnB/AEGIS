import { ContentDeliveryService } from "./content-delivery";

jest.mock("../repositories/track-node.repository", () => ({
  TrackNodeRepository: jest.fn(),
}));
jest.mock("../repositories/progress.repository", () => ({
  ProgressRepository: jest.fn(),
}));

const lessonNode = { id: 1, trackId: 7, orderIndex: 0, nodeType: "lesson" };
const exerciseNode = { id: 2, trackId: 7, orderIndex: 1, nodeType: "exercise" };
const lessonRecord = { title: "Leitura", json: { slides: [{ tag: "", title: "Intro", body: "Texto", source: null }] } };
const exerciseRecords = [{
  id: 20,
  type: "revision",
  json: { questionType: "multiple_choice", prompt: "Escolha", options: ["A"], correctAnswer: 0, explanation: "Interno" },
}];

function makeService(overrides: Record<string, jest.Mock> = {}) {
  const trackNodeRepo = {
    findById: jest.fn(),
    findPreviousNodeInTrack: jest.fn().mockResolvedValue(null),
    findLessonByNodeId: jest.fn(),
    findExercisesByNodeId: jest.fn(),
    ...overrides,
  };
  const progressRepo = { isNodeCompletedByUser: jest.fn().mockResolvedValue(true) };
  return {
    service: new ContentDeliveryService(trackNodeRepo as never, progressRepo as never),
    trackNodeRepo,
    progressRepo,
  };
}

describe("ContentDeliveryService", () => {
  it("rejects missing nodes and gates access until the prior node is complete", async () => {
    const missing = makeService();
    missing.trackNodeRepo.findById.mockResolvedValue(null);
    await expect(missing.service.validateNodeAccess("u", 1)).rejects.toThrow("Nó da trilha não encontrado.");

    const blocked = makeService();
    blocked.trackNodeRepo.findById.mockResolvedValue(exerciseNode);
    blocked.trackNodeRepo.findPreviousNodeInTrack.mockResolvedValue({ id: 1 });
    blocked.progressRepo.isNodeCompletedByUser.mockResolvedValue(false);
    await expect(blocked.service.validateNodeAccess("u", 2)).rejects.toThrow("Acesso bloqueado");
    expect(blocked.progressRepo.isNodeCompletedByUser).toHaveBeenCalledWith("u", 1);
  });

  it("validates access when there is no previous node or it is complete", async () => {
    const service = makeService();
    service.trackNodeRepo.findById.mockResolvedValue(lessonNode);
    await expect(service.service.validateNodeAccess("u", 1)).resolves.toEqual(lessonNode);
    expect(service.progressRepo.isNodeCompletedByUser).not.toHaveBeenCalled();

    service.trackNodeRepo.findPreviousNodeInTrack.mockResolvedValue({ id: 9 });
    service.progressRepo.isNodeCompletedByUser.mockResolvedValue(true);
    await expect(service.service.validateNodeAccess("u", 1)).resolves.toEqual(lessonNode);
  });

  it("loads and validates lesson content, rejecting wrong node types and missing lessons", async () => {
    const setup = makeService();
    setup.trackNodeRepo.findById.mockResolvedValue(lessonNode);
    setup.trackNodeRepo.findLessonByNodeId.mockResolvedValue(lessonRecord);
    await expect(setup.service.getLessonContent("u", 1)).resolves.toEqual({
      ...lessonNode,
      title: "Leitura",
      json: lessonRecord.json,
    });
    setup.trackNodeRepo.findById.mockResolvedValue(exerciseNode);
    await expect(setup.service.getLessonContent("u", 2)).rejects.toThrow("não é do tipo lição");
    setup.trackNodeRepo.findById.mockResolvedValue(lessonNode);
    setup.trackNodeRepo.findLessonByNodeId.mockResolvedValue(null);
    await expect(setup.service.getLessonContent("u", 1)).rejects.toThrow("Conteúdo da lição não encontrado");
  });

  it("returns sanitized exercise content and rejects invalid node/exercise data", async () => {
    const setup = makeService();
    setup.trackNodeRepo.findById.mockResolvedValue(exerciseNode);
    setup.trackNodeRepo.findExercisesByNodeId.mockResolvedValue(exerciseRecords);
    await expect(setup.service.getExercisesContent("u", 2)).resolves.toEqual({
      id: 2,
      orderIndex: 1,
      nodeType: "exercise",
      exercises: [{ id: 20, type: "revision", json: { questionType: "multiple_choice", prompt: "Escolha", options: ["A"] } }],
    });
    setup.trackNodeRepo.findById.mockResolvedValue(lessonNode);
    await expect(setup.service.getExercisesContent("u", 1)).rejects.toThrow("não é do tipo exercício");
    setup.trackNodeRepo.findById.mockResolvedValue(exerciseNode);
    setup.trackNodeRepo.findExercisesByNodeId.mockResolvedValue([]);
    await expect(setup.service.getExercisesContent("u", 2)).rejects.toThrow("Nenhum exercício cadastrado");
    setup.trackNodeRepo.findExercisesByNodeId.mockResolvedValue([{ ...exerciseRecords[0], json: { ...exerciseRecords[0].json, correctAnswer: {} } }]);
    await expect(setup.service.getExercisesContent("u", 2)).rejects.toThrow();
  });
});
