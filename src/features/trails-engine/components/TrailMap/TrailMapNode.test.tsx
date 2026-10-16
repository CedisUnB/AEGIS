import { renderToStaticMarkup } from "react-dom/server";
import type { TrailMapDTO } from "@/features/trails-engine/types";
import { TrailMapNode } from "./TrailMapNode";

jest.mock("next/link", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  return {
    __esModule: true,
    default: ({
      href,
      children,
      className,
    }: {
      href: string;
      children: React.ReactNode;
      className?: string;
    }) => React.createElement("a", { href, className }, children),
  };
});

const baseNode: TrailMapDTO["nodes"][number] = {
  id: 42,
  orderIndex: 1,
  nodeType: "exercise",
  title: "Exercícios práticos",
  kindLabel: "Exercícios práticos",
  isCompleted: false,
  isCurrent: false,
  isMostAdvanced: false,
  isFinalTest: false,
};

describe("TrailMapNode", () => {
  it("renders an accessible button with bubble, step label, and modal action", () => {
    const markup = renderToStaticMarkup(
      <TrailMapNode
        node={baseNode}
        trailId={12}
        index={1}
        isLeft={false}
      />,
    );

    expect(markup).toContain('id="node-42"');
    expect(markup).toContain(
      'aria-label="Exercícios práticos: Exercícios práticos"',
    );
    expect(markup).toContain("Etapa 2");
    expect(markup).toContain("border-exercise-border bg-exercise-surface");
    expect(markup).toContain('href="/trails/12/nodes/42"');
    expect(markup).toContain("Começar");
    expect(markup).toContain("mr-[18%]");
  });

  it("passes highlighted state to the bubble and displays progress in its modal", () => {
    const markup = renderToStaticMarkup(
      <TrailMapNode
        node={{
          ...baseNode,
          isCompleted: true,
          isCurrent: true,
          isMostAdvanced: true,
        }}
        trailId={12}
        index={2}
        isLeft
      />,
    );

    expect(markup).toContain("border-accent-dark bg-accent");
    expect(markup).toContain("Etapa mais avançada alcançada");
    expect(markup).toContain("Revisar");
    expect(markup).toContain('aria-current="step"');
    expect(markup).toContain("ml-[18%]");
  });

  it("centers the final test bubble and labels it separately from its step number", () => {
    const markup = renderToStaticMarkup(
      <TrailMapNode
        node={{
          ...baseNode,
          kindLabel: "Teste final",
          isFinalTest: true,
          isMostAdvanced: true,
        }}
        trailId={12}
        index={7}
        isLeft={false}
      />,
    );

    expect(markup).toContain("border-alert bg-alert text-alert-foreground");
    expect(markup).toContain("Teste final");
    expect(markup).toContain("Etapa 8");
    expect(markup).toContain("justify-center");
    expect(markup).not.toContain("mr-[18%]");
  });
});
