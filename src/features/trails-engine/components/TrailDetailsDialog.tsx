"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { TrailCatalogEntry } from "../types";

interface TrailDetailsDialogProps {
  trail: TrailCatalogEntry | null;
  onClose: () => void;
}

export function TrailDetailsDialog({
  trail,
  onClose,
}: TrailDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (trail && !dialog.open) {
      dialog.showModal();
    } else if (!trail && dialog.open) {
      dialog.close();
    }
  }, [trail]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="trail-dialog-title"
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-border bg-surface p-0 text-foreground shadow-2xl shadow-foreground/20 backdrop:bg-overlay"
    >
      {trail && (
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                Detalhes da trilha
              </p>
              <h2 id="trail-dialog-title" className="mt-2 text-2xl font-bold">
                {trail.theme}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar detalhes da trilha"
              className="cursor-pointer rounded-full px-3 py-1 text-2xl leading-none text-foreground-muted hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-brand-secondary"
            >
              ×
            </button>
          </div>

          <p className="mt-5 text-sm leading-6 text-foreground">
            {trail.description}
          </p>
          <p className="mt-4 text-sm font-medium text-foreground-muted">
            {trail.totalNodes}{" "}
            {trail.totalNodes === 1 ? "etapa" : "etapas"}
            {trail.isStarted && ` · ${trail.completedNodes} concluídas`}
          </p>

          <div className="mt-7 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg px-4 py-3 text-sm font-semibold text-foreground-muted hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-brand-secondary"
            >
              Voltar ao mapa
            </button>
            <Link
              href={`/trails/${trail.id}`}
              className="rounded-lg bg-accent flex items-center px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
            >
              {trail.isStarted ? "Continuar trilha" : "Começar"}
              <span aria-hidden="true" className="ml-3">
                →
              </span>
            </Link>
          </div>
        </div>
      )}
    </dialog>
  );
}
