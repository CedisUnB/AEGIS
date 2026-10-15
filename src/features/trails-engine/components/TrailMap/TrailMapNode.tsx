// components/TrailMapNode.tsx
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

  return (
    <li
      id={`node-${node.id}`}
      className={`flex w-full ${
        node.isFinalTest ? "justify-center" : isLeft ? "justify-start" : "justify-end"
      }`}
    >
      <div className={node.isFinalTest ? "" : isLeft ? "ml-[18%]" : "mr-[18%]"}>
        <TrailMapNodeModal trailId={trailId} node={node}>
          <TrailMapNodeBubble node={node} highlight={highlight} />
        </TrailMapNodeModal>
        <span className="mt-2 block text-center text-xs font-semibold text-foreground-muted">
          Etapa {index + 1}
        </span>
      </div>
    </li>
  );
}