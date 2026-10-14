import Link from "next/link";
import type { TrailMapDTO } from "../types";
import { NodeStatusIcon } from "./NodeStatusIcon";

interface TrailMapNodeProps {
  node: TrailMapDTO["nodes"][number];
  trailId: number;
  index: number;
  isLeft: boolean;
}

export function TrailMapNode({
  node,
  trailId,
  index,
  isLeft,
}: TrailMapNodeProps) {
  const highlight = node.isMostAdvanced || node.isCurrent;
  const cardClassName = [
    "block rounded-2xl border-2 border-l-4 p-4 shadow-md transition hover:-translate-y-1",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-secondary",
    node.isFinalTest &&
      "w-[90%] border-amber-400 bg-amber-50 text-amber-950 shadow-amber-400/30 sm:w-5/6",
    !node.isFinalTest &&
      highlight &&
      "w-[82%] border-accent bg-accent text-accent-foreground shadow-accent/20 sm:w-4/5",
    !node.isFinalTest &&
      !highlight && [
        "w-[82%] border-border bg-surface-alt text-foreground hover:border-accent sm:w-4/5",
        node.nodeType === "lesson" ? "border-l-sky-400" : "border-l-emerald-400",
      ],
    !node.isFinalTest &&
      (isLeft
        ? "-translate-x-3 sm:-translate-x-5"
        : "translate-x-3 sm:translate-x-5"),
  ]
    .flat()
    .filter(Boolean)
    .join(" ");

  return (
    <li
      id={`node-${node.id}`}
      className={`relative z-10 flex w-full ${
        node.isFinalTest
          ? "justify-center"
          : isLeft
            ? "justify-start"
            : "justify-end"
      }`}
    >
      <Link
        href={`/trails/${trailId}/nodes/${node.id}`}
        aria-current={node.isCurrent ? "step" : undefined}
        aria-label={`${node.kindLabel}: ${node.title}${
          node.isCompleted ? ", concluído" : ""
        }${node.isMostAdvanced ? ", etapa mais avançada alcançada" : ""}`}
        className={cardClassName}
      >
        <span className="flex items-center justify-between gap-3">
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-wide opacity-80">
              Etapa {index + 1} · {node.kindLabel}
            </span>
            <span className="mt-1 block truncate text-sm font-bold sm:text-base">
              {node.title}
            </span>
          </span>
          <span aria-hidden="true" className="shrink-0">
            <NodeStatusIcon node={node} />
          </span>
        </span>
        {(node.isCurrent || node.isMostAdvanced) && (
          <span className="mt-3 block text-xs font-semibold">
            {node.isMostAdvanced
              ? "Etapa mais avançada alcançada"
              : "Etapa selecionada"}
          </span>
        )}
      </Link>
    </li>
  );
}
