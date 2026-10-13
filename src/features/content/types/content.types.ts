import { z } from "zod";

export const NodeTypeSchema = z.enum(["lesson", "exercise"])

export const ExerciseTypeSchema = z.enum(["revision", "test"])

export const QuestionFormatSchema = z.enum([
  "multiple_choice",
  "true_false",
  "fill_in_the_blank",
  "ordering",
]);

export const lessonSchema = z.object({
    id: z.number().int(),
    orderIndex: z.number().int(),
    nodeType: NodeTypeSchema,
    title: z.string(),
    json: z.object({
        slides: z.array(
            z.object({
                tag: z.string(),
                body: z.string(),
                title: z.string(),
                source: z.string(),
            })
        ),
    }),
})

export const answerValueSchema = z.union([
  z.number().int(),
  z.string(),
  z.array(z.union([z.number().int(), z.string()])),
]);

export const exerciseInternalJsonSchema = z.object({
  questionType: QuestionFormatSchema.or(z.string()),
  prompt: z.string(),
  options: z.array(z.string()).default([]),
  correctAnswer: answerValueSchema,
  explanation: z.string().optional(),
});

export const exercisePublicJsonSchema = exerciseInternalJsonSchema.omit({
  correctAnswer: true,
  explanation: true,
});

export const exercisesSchema = z.object({
  id: z.number().int(),
  orderIndex: z.number().int(),
  nodeType: NodeTypeSchema,
  exercises: z.array(
    z.object({
      id: z.number().int(),
      type: ExerciseTypeSchema,
      json: exercisePublicJsonSchema,
    })
  ),
});

export const submissionSchema = z.object({
    trackNodeId: z.number().int(),
    exercises: z.array(
        z.object({
            id: z.number().int(),
            value: answerValueSchema,
        })
    ).min(1),
})

export const resultSchema = z.object({
    trackNodeId: z.number().int(),
    isNodeCompleted: z.boolean(),
    score: z.number().int().min(0).max(100),
    passingScore: z.number().int(), // 80 se for teste final, 60 se for revisão regular
    isFinalTest: z.boolean(),
    exercises: z.array(
        z.object({
            id: z.number().int(),
            isCorrect: z.boolean(),
            feedback: z.string().optional(),
    })
  ),
});

export type AnswerValue = z.infer<typeof answerValueSchema>;
export type LessonContent = z.infer<typeof lessonSchema>;
export type ExerciseInternalJson = z.infer<typeof exerciseInternalJsonSchema>;
export type ExercisePublicJson = z.infer<typeof exercisePublicJsonSchema>;
export type ExercisesContent = z.infer<typeof exercisesSchema>;
export type Submission = z.infer<typeof submissionSchema>;
export type Result = z.infer<typeof resultSchema>;