"use client";

import type { TrailCatalogEntry } from "../../types";

export interface TrailCardProps {
  trail: TrailCatalogEntry;
  onSelect: (trail: TrailCatalogEntry) => void;
  variant: "orbit" | "list";
}

export function TrailCard({ trail, onSelect, variant }: TrailCardProps) {
  const layoutClasses =
    variant === "orbit"
      ? "aspect-square"
      : "min-h-28 flex-row justify-between text-left sm:flex-col sm:justify-center sm:text-center";

  const isCompleted = trail.isStarted && trail.completedNodes === trail.totalNodes;

  const stateClasses = isCompleted
    ? "border-confirm bg-surface-alt hover:border-confirm hover:bg-surface-hover"
    : "border-border bg-surface-alt hover:border-accent hover:bg-surface-hover";

  return (
    <button
      type="button"
      onClick={() => onSelect(trail)}
      aria-label={`Ver detalhes da trilha ${trail.theme}${
        isCompleted ? ", concluída" : ""
      }`}
      className={`cursor-pointer group relative flex h-full w-full min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 p-3 text-center text-foreground shadow-md shadow-foreground/10 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-secondary sm:rounded-3xl sm:p-4 ${stateClasses} ${layoutClasses}`}
    >
      {isCompleted && (
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-confirm text-surface">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}

      <span className="line-clamp-3 text-xs font-bold leading-tight text-foreground sm:text-sm">
        {trail.theme}
      </span>

      {trail.isStarted && (
        <span
          className={`text-[0.625rem] font-semibold sm:text-xs ${
            isCompleted ? "text-confirm" : "text-accent"
          }`}
        >
          {isCompleted
            ? "Concluída"
            : `${trail.completedNodes}/${trail.totalNodes} concluídos`}
        </span>
      )}

      <span className="text-[0.625rem] text-foreground-muted sm:text-xs">
        {trail.totalNodes} {trail.totalNodes === 1 ? "etapa" : "etapas"}
      </span>
    </button>
  );
}