import { renderToStaticMarkup } from "react-dom/server";
import type { TrailMapDTO } from "../../types";
import { TrailMapNodeBubble } from "./TrailMapNodeBubble";

const baseNode: TrailMapDTO["nodes"][number] = {
  id: 1,
  orderIndex: 0,
  nodeType: "lesson",
  title: "Conceitos iniciais",
  kindLabel: "Teoria",
  isCompleted: false,
  isCurrent: false,
  isMostAdvanced: false,
  isFinalTest: false,
  isNextUp: false,
  isUnlocked: true,
};

describe("TrailMapNodeBubble", () => {
  it("renders theory and exercise bubbles with their distinct colors", () => {
    const lessonMarkup = renderToStaticMarkup(
      <TrailMapNodeBubble node={baseNode} />,
    );
    const exerciseMarkup = renderToStaticMarkup(
      <TrailMapNodeBubble
        node={{ ...baseNode, nodeType: "exercise" }}
      />,
    );

    expect(lessonMarkup).toContain(
      "border-lesson-border bg-lesson-surface text-lesson-foreground",
    );
    expect(exerciseMarkup).toContain(
      "border-exercise-border bg-exercise-surface text-exercise-foreground",
    );
  });

  it("uses the current-step accent for the next incomplete node", () => {
    const markup = renderToStaticMarkup(
      <TrailMapNodeBubble node={{ ...baseNode, isNextUp: true }} />,
    );

    expect(markup).toContain("border-current-border bg-current-surface");
    expect(markup).toContain("text-current-foreground");
  });

  it("uses the completion accent for a completed node", () => {
  it("uses the progress highlight when the node is highlighted", () => {
    const markup = renderToStaticMarkup(
      <TrailMapNodeBubble node={{ ...baseNode, isCompleted: true }} />,
    );

    expect(markup).toContain("border-accent-border bg-accent");
    expect(markup).toContain("text-accent-foreground");
  });

  it("renders a wider labeled bubble for the final test", () => {
    const markup = renderToStaticMarkup(
      <TrailMapNodeBubble
        node={{
          ...baseNode,
          nodeType: "exercise",
          kindLabel: "Teste final",
          isFinalTest: true,
        }}
      />,
    );

    expect(markup).toContain("h-16 w-28");
    expect(markup).toContain(
      "cursor-not-allowed opacity-50 border-border bg-surface-alt text-foreground-muted",
    );
    expect(markup).toContain("Teste Final Bloqueado");
  });

  it("renders an unlocked final test with its alert styling and label", () => {
    const markup = renderToStaticMarkup(
      <TrailMapNodeBubble
        node={{
          ...baseNode,
          nodeType: "exercise",
          kindLabel: "Teste final",
          isFinalTest: true,
          isUnlocked: true,
        }}
      />,
    );

    expect(markup).toContain("h-16 w-28");
    expect(markup).toContain("border-alert bg-alert text-alert-foreground");
    expect(markup).toContain("Teste final");
  });
});
