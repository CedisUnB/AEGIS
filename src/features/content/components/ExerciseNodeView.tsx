"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitExercisesAction } from "../actions";
import { ExercisesContent, AnswerValue, Result } from "../types/content.types";

interface ExerciseNodeViewProps {
  trackTitle: string;
  exercisesContent: ExercisesContent;
  trackId: number;
}

export const ExerciseNodeView: React.FC<ExerciseNodeViewProps> = ({
  trackTitle,
  exercisesContent,
  trackId,
}) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [isPending, startTransition] = useTransition();
  const [evaluationResult, setEvaluationResult] = useState<Result | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const exercises = exercisesContent.exercises;
  const totalExercises = exercises.length;
  const currentExercise = exercises[currentIndex];
  const isLastExercise = currentIndex === totalExercises - 1;

  // Lida com a seleção de respostas
  const handleAnswerChange = (value: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [currentExercise.id]: value,
    }));
  };

  const handleNext = () => {
    if (!isLastExercise) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Formata o payload e submete a bateria
      const submissionPayload = {
        trackNodeId: exercisesContent.id,
        exercises: exercises.map((ex) => ({
          id: ex.id,
          value: answers[ex.id] ?? "", // Evita enviar nulo
        })),
      };

      startTransition(async () => {
        try {
          const res = await submitExercisesAction(trackId, submissionPayload);
          if (res.success) {
            setEvaluationResult(res.data);
          } else {
            setErrorMsg(res.error);
          }
        } catch {
          setErrorMsg("Erro ao enviar as respostas.");
        }
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Renderiza a tela de resultado final
  if (evaluationResult) {
    return (
      <div className="min-h-screen bg-surface text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="bg-surface-alt p-8 rounded-2xl max-w-lg w-full text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-4">
            {evaluationResult.isNodeCompleted ? "Parabéns! 🎉" : "Quase lá!"}
          </h2>
          <p className="text-lg text-foreground-muted mb-6">
            Sua nota foi <strong className="text-white">{evaluationResult.score}%</strong>.
            A nota de corte era {evaluationResult.passingScore}%.
          </p>
          <button
            onClick={() => router.push(`/tracks/${trackId}`)}
            className="px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-foreground rounded-lg font-semibold transition-colors"
          >
            Voltar para a Trilha
          </button>
        </div>
      </div>
    );
  }

  // Define qual input renderizar com base no tipo e nas opções disponíveis
  const renderExerciseInput = () => {
    const questionType = currentExercise.json.questionType;
    const options = currentExercise.json.options || [];
    const currentAnswer = answers[currentExercise.id];

    // 1. Verdadeiro/Falso ou ABCD (Múltipla Escolha)
    if (questionType === "true_false" || questionType === "multiple_choice") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {options.map((option, idx) => {
            const isSelected = currentAnswer === idx;
            return (
              <button
                key={idx}
                onClick={() => handleAnswerChange(idx)}
                // Se a opção for clicada, fica verde, simulando o comportamento visual do wireframe
                className={`py-3 px-4 rounded-lg font-medium transition-colors text-center ${
                  isSelected
                    ? "bg-confirm text-foreground shadow-md"
                    : "bg-surface text-foreground-muted hover:bg-slate-800"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      );
    }

    // 2. Complete a frase / Código (Sem opções)
    if (questionType === "fill_in_the_blank" && options.length === 0) {
      return (
        <div className="mt-6">
          <input
            type="text"
            value={(currentAnswer as string) || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Digite sua resposta aqui..."
            className="w-full bg-surface border border-slate-700 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-brand-secondary"
          />
        </div>
      );
    }

    // 3. Arrastar blocos (Ordenação)
    if (questionType === "ordering") {
      const selectedBlocks = (currentAnswer as string[]) || [];
      const availableBlocks = options.filter((opt) => !selectedBlocks.includes(opt));

      return (
        <div className="mt-6 space-y-6">
          <div>
            <p className="text-xs text-foreground-muted uppercase tracking-wider mb-2">
              Sua Resposta (Clique para remover):
            </p>
            <div className="min-h-[60px] p-4 bg-surface border border-dashed border-slate-700 rounded-lg flex flex-wrap gap-2">
              {selectedBlocks.map((block, idx) => (
                <button
                  key={`sel-${idx}`}
                  onClick={() =>
                    handleAnswerChange(selectedBlocks.filter((b) => b !== block))
                  }
                  className="px-3 py-1.5 bg-confirm text-foreground text-sm rounded-md shadow-sm"
                >
                  {block}
                </button>
              ))}
              {selectedBlocks.length === 0 && (
                <span className="text-slate-500 text-sm my-auto">
                  Selecione os blocos abaixo na ordem correta...
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs text-foreground-muted uppercase tracking-wider mb-2">
              Blocos Disponíveis:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableBlocks.map((block, idx) => (
                <button
                  key={`avail-${idx}`}
                  onClick={() => handleAnswerChange([...selectedBlocks, block])}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-md transition-colors"
                >
                  {block}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-surface text-foreground flex flex-col p-6 sm:p-10">
      <div className="max-w-2xl mx-auto w-full flex-auto flex flex-col justify-center">
        {/* Cabeçalho */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Exercícios {trackTitle}
          </h1>
        </div>

        {/* Indicador de Segmentos do Exercício */}
        <div className="mb-6">
          <span className="text-[11px] font-bold tracking-widest text-foreground-muted uppercase block mb-2">
            Conteúdo
          </span>
          <div className="flex gap-2 w-full">
            {exercises.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-auto rounded-full transition-all duration-300 ${
                  idx <= currentIndex ? "bg-brand-secondary" : "bg-surface-alt"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Cartão da Questão */}
        <div className="bg-surface-alt rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base text-foreground-muted mb-4">
              Questão {currentIndex + 1}:
            </h2>

            <div className="text-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {currentExercise.json.prompt}
            </div>

            {/* Renderização dinâmica das opções */}
            {renderExerciseInput()}
          </div>
        </div>

        {/* Controles de Navegação */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isPending}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentIndex === 0
                ? "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            }`}
          >
            Voltar
          </button>

          <span className="text-xs sm:text-sm font-medium text-foreground">
            {currentIndex + 1} / {totalExercises}
          </span>

          <button
            onClick={handleNext}
            disabled={isPending}
            className={`px-6 py-2.5 bg-brand-primary hover:bg-brand-secondary text-foreground rounded-lg text-sm font-semibold transition-colors shadow-md disabled:opacity-50 ${
              isLastExercise
                ? "bg-green-500 hover:bg-green-400 text-white" 
                : "" 
            } disabled:opacity-50`}
          >
            {isPending ? "Avaliando..." : isLastExercise ? "Finalizar" : "Próximo"}
          </button>
        </div>
        
        {errorMsg && (
          <p className="text-xs text-rose-400 text-center mt-4">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};