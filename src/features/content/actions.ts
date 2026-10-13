"use server";

import { revalidatePath } from "next/cache";
import { ContentDeliveryService } from "./services/content-delivery";
import { ProgressTrackingService } from "./services/progress-tracking";
import {
  submissionSchema,
  LessonContent,
  ExercisesContent,
  Result,
} from "./types/content.types";

const contentDeliveryService = new ContentDeliveryService();
const progressTrackingService = new ProgressTrackingService();

// Helper de Autenticação da sessão
async function getAuthenticatedUserId(): Promise<string> {
  // Substituir pela extração real de sessão (ex: getServerSession / cookies / JWT)
  const mockUserId = "user-uuid-placeholder";
  return mockUserId;
}

type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getLessonContentAction(
  trackNodeId: number
): Promise<ActionResponse<LessonContent>> {
  try {
    const userId = await getAuthenticatedUserId();
    const data = await contentDeliveryService.getLessonContent(userId, trackNodeId);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message || "Erro ao carregar o conteúdo da lição.",
    };
  }
}

/**
 * Action: US13 e US14 - Carrega os Exercícios de Revisão ou Teste Final
 */
export async function getExercisesContentAction(
  trackNodeId: number
): Promise<ActionResponse<ExercisesContent>> {
  try {
    const userId = await getAuthenticatedUserId();
    const data = await contentDeliveryService.getExercisesContent(userId, trackNodeId);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message || "Erro ao carregar os exercícios.",
    };
  }
}

/**
 * Action: US12 - Conclui a leitura da Lição e desbloqueia o próximo nó
 */
export async function completeLessonAction(
  trackNodeId: number,
  trackId: number
): Promise<ActionResponse<{ message: string }>> {
  try {
    const userId = await getAuthenticatedUserId();
    await progressTrackingService.completeLesson(userId, trackNodeId);

    // Revalida a rota da trilha para atualizar os nós acessíveis
    revalidatePath(`/tracks/${trackId}`);

    return {
      success: true,
      data: { message: "Leitura concluída com sucesso." },
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message || "Erro ao concluir a leitura da lição.",
    };
  }
}

/**
 * Action: US15 - Submete respostas de exercícios (Revisão ou Teste Final)
 */
export async function submitExercisesAction(
  trackId: number,
  rawPayload: unknown
): Promise<ActionResponse<Result>> {
  try {
    const userId = await getAuthenticatedUserId();

    // Validação estrita dos dados recebidos com o Zod
    const parsedSubmission = submissionSchema.parse(rawPayload);

    // Executa a correção (corte de 60% ou 80%) e persistência
    const result = await progressTrackingService.submitExercises(
      userId,
      parsedSubmission
    );

    // Se o nó foi superado com sucesso, revalida a interface da trilha
    if (result.isNodeCompleted) {
      revalidatePath(`/tracks/${trackId}`);
    }

    return { success: true, data: result };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message || "Erro ao processar as respostas dos exercícios.",
    };
  }
}