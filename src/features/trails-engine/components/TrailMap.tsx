import type { TrailMapDTO } from "../types";
import { TrailMapFocus } from "./TrailMapFocus";
import { TrailMapNode } from "./TrailMapNode";

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
      <ol
        aria-label="Etapas da trilha em sequência"
        className="relative mx-auto flex max-w-lg flex-col items-center gap-7 before:absolute before:bottom-8 before:left-1/2 before:top-8 before:w-1 before:-translate-x-1/2 before:rounded-full before:bg-border"
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
      <TrailMapFocus nodeId={trail.focusNodeId} />
    </section>
  );
}
