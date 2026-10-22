import {
  CheckIcon,
  ExerciseIcon,
  LessonIcon,
  TrophyIcon,
} from "@/components/icons";
import type { TrailMapDTO } from "../../types";

interface NodeStatusIconProps {
  node: TrailMapDTO["nodes"][number];
}

export function NodeStatusIcon({ node }: NodeStatusIconProps) {
  if (node.isCompleted) {
    return <CheckIcon className="h-5 w-5" />;
  }

  if (node.isFinalTest) {
    return <TrophyIcon className="h-5 w-5" />;
  }

  if (node.nodeType === "lesson") {
    return <LessonIcon className="h-5 w-5" />;
  }

  return <ExerciseIcon className="h-5 w-5" />;
}
