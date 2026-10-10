"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { TrailCardDTO } from "../types";

interface TrailsMapProps {
  trails: TrailCardDTO[];
}

interface TrailNodeProps {
  trail: TrailCardDTO;
  onSelect: (trail: TrailCardDTO) => void;
  variant: "orbit" | "list";
}

function TrailNode({ trail, onSelect, variant }: TrailNodeProps) {
  const layoutClasses =
    variant === "orbit"
      ? "aspect-square"
      : "min-h-28 flex-row justify-between text-left sm:flex-col sm:justify-center sm:text-center";

  return (
    <button
      type="button"
      onClick={() => onSelect(trail)}
      aria-label={`Ver detalhes da trilha ${trail.theme}`}
      className={`group flex h-full w-full min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-slate-300 bg-slate-100 p-3 text-center shadow-[0_4px_0_#cbd5e1] transition hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-50 hover:shadow-[0_5px_0_#93c5fd] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 sm:rounded-3xl sm:p-4 ${layoutClasses}`}
    >
      <span className="line-clamp-3 text-xs font-bold leading-tight text-slate-800 sm:text-sm">
        {trail.theme}
      </span>
      {trail.isStarted && (
        <span className="text-[0.625rem] font-semibold text-blue-700 sm:text-xs">
          {trail.completedNodes}/{trail.totalNodes} concluídos
        </span>
      )}
      <span className="text-[0.625rem] text-slate-500 sm:text-xs">
        {trail.totalNodes} {trail.totalNodes === 1 ? "etapa" : "etapas"}
      </span>
    </button>
  );
}

export function TrailsMap({ trails }: TrailsMapProps) {
  const [selectedTrail, setSelectedTrail] = useState<TrailCardDTO | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedTrail && !dialog.open) {
      dialog.showModal();
    } else if (!selectedTrail && dialog.open) {
      dialog.close();
    }
  }, [selectedTrail]);

  if (trails.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Nenhuma trilha está disponível no momento.
      </p>
    );
  }

  const orbitPositions = [0, 2, 3, 5, 6, 8, 1, 7];
  const orbitSlots: (TrailCardDTO | null)[] = Array(9).fill(null);
  trails.slice(0, orbitPositions.length).forEach((trail, index) => {
    orbitSlots[orbitPositions[index]] = trail;
  });
  const additionalTrails = trails.slice(orbitPositions.length);

  return (
    <>
      <section
        aria-label="Mapa de trilhas"
        className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8 lg:p-10"
      >
        <div className="md:hidden">
          <div
            aria-label="Você está aqui no mapa de trilhas"
            className="mb-5 flex items-center justify-center gap-3 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-slate-700"
          >
            <span aria-hidden="true" className="text-3xl">
              🧭
            </span>
            <span>Escolha uma trilha para explorar</span>
          </div>
          <ul
            aria-label="Trilhas disponíveis"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {trails.map((trail) => (
              <li key={trail.id} className="min-w-0">
                <TrailNode
                  trail={trail}
                  onSelect={setSelectedTrail}
                  variant="list"
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:block">
          <ul
            aria-label="Trilhas ao redor da bússola"
            className="mx-auto grid w-full max-w-xl grid-cols-3 gap-3 lg:gap-4"
          >
            {orbitSlots.map((trail, index) =>
              trail ? (
                <li key={trail.id} className="flex min-w-0">
                  <TrailNode
                    trail={trail}
                    onSelect={setSelectedTrail}
                    variant="orbit"
                  />
                </li>
              ) : index === 4 ? (
                <li
                  key="map-center"
                  aria-label="Você está aqui no mapa de trilhas"
                  className="flex aspect-square items-center justify-center"
                >
                  <span
                    aria-hidden="true"
                    className="select-none text-6xl drop-shadow-sm lg:text-7xl"
                  >
                    🧭
                  </span>
                </li>
              ) : (
                <li
                  key={`map-empty-${index}`}
                  aria-hidden="true"
                  className="aspect-square"
                />
              ),
            )}
          </ul>

          {additionalTrails.length > 0 && (
            <div className="mx-auto mt-10 max-w-4xl border-t border-slate-200 pt-7">
              <h2 className="mb-4 text-lg font-bold text-slate-800">
                Mais trilhas
                <span className="ml-2 text-sm font-medium text-slate-500">
                  ({additionalTrails.length})
                </span>
              </h2>
              <ul
                aria-label="Mais trilhas"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
              >
                {additionalTrails.map((trail) => (
                  <li key={trail.id} className="flex min-w-0">
                    <TrailNode
                      trail={trail}
                      onSelect={setSelectedTrail}
                      variant="orbit"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <dialog
        ref={dialogRef}
        aria-labelledby="trail-dialog-title"
        onCancel={() => setSelectedTrail(null)}
        onClose={() => setSelectedTrail(null)}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60"
      >
        {selectedTrail && (
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                  Detalhes da trilha
                </p>
                <h2
                  id="trail-dialog-title"
                  className="mt-2 text-2xl font-bold"
                >
                  {selectedTrail.theme}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTrail(null)}
                aria-label="Fechar detalhes da trilha"
                className="rounded-full px-3 py-1 text-2xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                ×
              </button>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-700">
              {selectedTrail.description}
            </p>
            <p className="mt-4 text-sm font-medium text-slate-600">
              {selectedTrail.totalNodes}{" "}
              {selectedTrail.totalNodes === 1 ? "etapa" : "etapas"}
              {selectedTrail.isStarted &&
                ` · ${selectedTrail.completedNodes} concluídas`}
            </p>

            <div className="mt-7 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setSelectedTrail(null)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                Voltar ao mapa
              </button>
              <Link
                href={`/trails/${selectedTrail.id}`}
                className="rounded-lg bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {selectedTrail.isStarted ? "Continuar trilha" : "Começar"}
                <span aria-hidden="true" className="ml-3">
                  →
                </span>
              </Link>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}