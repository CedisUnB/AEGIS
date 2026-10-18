// components/TrailMapNodeBubble.tsx
import type { TrailMapDTO } from "../../types";
import { NodeStatusIcon } from "./NodeStatusIcon";

interface TrailMapNodeBubbleProps {
  node: TrailMapDTO["nodes"][number];
}

export function TrailMapNodeBubble({ node }: TrailMapNodeBubbleProps) {
  if (node.isFinalTest) {
    const finalTestClassName = [
      "flex h-16 w-28 items-center justify-center gap-2 rounded-xl border-b-4 px-3 shadow-md transition",
      "hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:border-b-2",
      "border-alert bg-alert text-alert-foreground",
    ].join(" ");

    return (
      <span className={finalTestClassName}>
        <NodeStatusIcon node={node} />
        <span className="text-xs font-bold uppercase tracking-wide">
          Teste final
        </span>
      </span>
    );
  }

  const toneClassName = node.isCompleted
  ? "border-accent-border bg-accent text-accent-foreground"
  : node.isNextUp
    ? "border-current-border bg-current-surface text-current-foreground"
    : node.nodeType === "lesson"
      ? "border-lesson-border bg-lesson-surface text-lesson-foreground"
      : "border-exercise-border bg-exercise-surface text-exercise-foreground";

  const bubbleClassName = [
    "flex h-16 w-16 items-center justify-center rounded-full border-b-4 shadow-md transition",
    "hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:border-b-2",
    toneClassName,
  ].join(" ");

  return (
    <span className={bubbleClassName}>
      <NodeStatusIcon node={node} />
    </span>
  );
}