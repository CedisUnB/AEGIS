import { TrackNodeRepository } from "../repositories/track-node.repository";
import { ProgressRepository } from "../repositories/progress.repository";
import {
  LessonContent,
  ExercisesContent,
  lessonSchema,
  exercisesSchema,
  exerciseInternalJsonSchema,
  exercisePublicJsonSchema,
} from "../types/content.types";

export class ContentDeliveryService {
  constructor(
    private readonly trackNodeRepo: TrackNodeRepository = new TrackNodeRepository(),
    private readonly progressRepo: ProgressRepository = new ProgressRepository()
  ) {}

  async validateNodeAccess(userId: string, trackNodeId: number) {
    const node = await this.trackNodeRepo.findById(trackNodeId);
    if (!node) {
      throw new Error("Nó da trilha não encontrado.");
    }

    const previousNode = await this.trackNodeRepo.findPreviousNodeInTrack(
      node.trackId,
      node.orderIndex
    );

    if (previousNode) {
      const isPreviousCompleted = await this.progressRepo.isNodeCompletedByUser(
        userId,
        previousNode.id
      );

      if (!isPreviousCompleted) {
        throw new Error("Acesso bloqueado: conclua o nó anterior da trilha para continuar.");
      }
    }

    return node;
  }

  async getLessonContent(userId: string, trackNodeId: number): Promise<LessonContent> {
    const node = await this.validateNodeAccess(userId, trackNodeId);

    if (node.nodeType !== "lesson") {
      throw new Error("O nó solicitado não é do tipo lição.");
    }

    const lesson = await this.trackNodeRepo.findLessonByNodeId(trackNodeId);
    if (!lesson) {
      throw new Error("Conteúdo da lição não encontrado para este nó.");
    }

    return lessonSchema.parse({
      id: node.id,
      orderIndex: node.orderIndex,
      nodeType: node.nodeType,
      trackId: node.trackId,
      title: lesson.title,
      json: lesson.json,
    });
  }

  async getExercisesContent(userId: string, trackNodeId: number): Promise<ExercisesContent> {
    const node = await this.validateNodeAccess(userId, trackNodeId);

    if (node.nodeType !== "exercise") {
      throw new Error("O nó solicitado não é do tipo exercício.");
    }

    const exercises = await this.trackNodeRepo.findExercisesByNodeId(trackNodeId);
    if (!exercises || exercises.length === 0) {
      throw new Error("Nenhum exercício cadastrado para este nó.");
    }

    const sanitizedExercises = exercises.map((exercise) => {
      const internalJson = exerciseInternalJsonSchema.parse(exercise.json);
      const publicJson = exercisePublicJsonSchema.parse(internalJson);

      return {
        id: exercise.id,
        type: exercise.type,
        json: publicJson,
      };
    });

    return exercisesSchema.parse({
      id: node.id,
      orderIndex: node.orderIndex,
      nodeType: node.nodeType,
      exercises: sanitizedExercises,
    });
  }
}