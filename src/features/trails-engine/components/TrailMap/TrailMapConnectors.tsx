import type { TrailMapDTO } from "../../types";

interface TrailMapConnectorsProps {
  nodes: TrailMapDTO["nodes"];
}

const NODE_HEIGHT = 88;
const NODE_GAP = 40;

function nodeX(isFinalTest: boolean, isLeft: boolean) {
  if (isFinalTest) return 50;
  return isLeft ? 30 : 70;
}

export function TrailMapConnectors({ nodes }: TrailMapConnectorsProps) {
  if (nodes.length < 2) {
    return null;
  }

  const viewBoxHeight =
    nodes.length * NODE_HEIGHT + (nodes.length - 1) * NODE_GAP;
  const nodeStride = NODE_HEIGHT + NODE_GAP;
  const points = nodes.map((node, index) => ({
    x: nodeX(node.isFinalTest, index % 2 === 0),
    y: index * nodeStride + NODE_HEIGHT / 2,
  }));

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 100 ${viewBoxHeight}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="7 7"
        strokeLinecap="round"
        className="text-border"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}