import type { TrailMapDTO } from "@/features/trails-engine/types";
import { TrailMapNodeBubble } from "./TrailMapNodeBubble";
import { TrailMapNodeModal } from "./TrailMapNodeModal";

interface TrailMapNodeProps {
  node: TrailMapDTO["nodes"][number];
  trailId: number;
  index: number;
  isLeft: boolean;
}

export function TrailMapNode({ node, trailId, index, isLeft }: TrailMapNodeProps) {
  const highlight = node.isMostAdvanced || node.isCurrent;

  const statusLabelClassName = [
    "mt-2 block text-center text-xs font-semibold",
    node.isCompleted ? "text-confirm" : "text-foreground-muted",
  ].join(" ");

  const wrapperClassName = [
    "flex w-24 flex-col items-center",
    node.isFinalTest ? "" : isLeft ? "ml-[18%]" : "mr-[18%]",
  ].join(" ");

  return (
    <li
      id={`node-${node.id}`}
      className={`flex w-full ${
        node.isFinalTest ? "justify-center" : isLeft ? "justify-start" : "justify-end"
      }`}
    >
      <div className={wrapperClassName}>
        <TrailMapNodeModal trailId={trailId} node={node}>
          <TrailMapNodeBubble node={node} highlight={highlight} />
        </TrailMapNodeModal>
        <span className={statusLabelClassName}>
          Etapa {index + 1}
          {node.isCompleted && " · Concluída"}
        </span>
      </div>
    </li>
  );
}