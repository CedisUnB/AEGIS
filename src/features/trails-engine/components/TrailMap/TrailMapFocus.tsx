"use client";

import { useEffect } from "react";

interface TrailMapFocusProps {
  nodeId: number | null;
}

export function TrailMapFocus({ nodeId }: TrailMapFocusProps) {
  useEffect(() => {
    if (nodeId === null) {
      return;
    }

    document
      .getElementById(`node-${nodeId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [nodeId]);

  return null;
}
