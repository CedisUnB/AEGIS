"use client";

import type { TrailCatalogEntry } from "../types";

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

  return (
    <button
      type="button"
      onClick={() => onSelect(trail)}
      aria-label={`Ver detalhes da trilha ${trail.theme}`}
      className={`cursor-pointer group flex h-full w-full min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-border bg-surface-alt p-3 text-center text-foreground shadow-md shadow-foreground/10 transition hover:-translate-y-1 hover:border-accent hover:bg-surface-hover hover:shadow-lg hover:shadow-foreground/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-secondary sm:rounded-3xl sm:p-4 ${layoutClasses}`}
    >
      <span className="line-clamp-3 text-xs font-bold leading-tight text-foreground sm:text-sm">
        {trail.theme}
      </span>
      {trail.isStarted && (
        <span className="text-[0.625rem] font-semibold text-accent sm:text-xs">
          {trail.completedNodes}/{trail.totalNodes} concluídos
        </span>
      )}
      <span className="text-[0.625rem] text-foreground-muted sm:text-xs">
        {trail.totalNodes} {trail.totalNodes === 1 ? "etapa" : "etapas"}
      </span>
    </button>
  );
}
