// components/TrailMap.tsx
import type { TrailMapDTO } from "../../types";
import { TrailMapFocus } from "./TrailMapFocus";
import { TrailMapNode } from "./TrailMapNode";
import { TrailMapConnectors } from "./TrailMapConnectors";

interface TrailMapProps {
  trail: TrailMapDTO;
}

export function TrailMap({ trail }: TrailMapProps) {
  if (trail.nodes.length === 0) {
    return (
      <section
        aria-label={`Mapa da trilha ${trail.theme}`}
        className="w-full max-w-3xl rounded-3xl border border-border bg-surface p-8 text-center text-foreground shadow-sm"
      >
        <p className="text-foreground-muted">
          Esta trilha ainda não possui etapas disponíveis.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label={`Mapa da trilha ${trail.theme}`}
      className="w-full max-w-3xl rounded-3xl border border-border bg-surface p-6 text-foreground shadow-sm sm:p-10"
    >
      <h1 className="mb-8 text-center text-2xl font-bold">{trail.theme}</h1>

      <p className="mb-6 text-center text-sm font-semibold text-foreground-muted">
        {trail.completedNodes} de {trail.totalNodes} etapas concluídas
        {trail.totalNodes > 0 && ` · ${Math.round((trail.completedNodes / trail.totalNodes) * 100)}%`}
      </p>

      <div className="relative mx-auto max-w-lg">
        <TrailMapConnectors nodes={trail.nodes} />

        <ol
          aria-label="Etapas da trilha em sequência"
          className="relative z-10 flex flex-col items-center gap-10"
        >
          {trail.nodes.map((node, index) => (
            <TrailMapNode
              key={node.id}
              node={node}
              trailId={trail.id}
              index={index}
              isLeft={index % 2 === 0}
            />
          ))}
        </ol>
      </div>

      <TrailMapFocus nodeId={trail.focusNodeId} />
    </section>
  );
}