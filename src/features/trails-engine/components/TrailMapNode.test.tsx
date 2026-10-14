import { renderToStaticMarkup } from "react-dom/server";
import type { TrailMapDTO } from "../types";
import { TrailMapNode } from "./TrailMapNode";

jest.mock("next/link", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  return {
    __esModule: true,
    default: ({
      href,
      children,
      className,
      id,
      "aria-current": ariaCurrent,
      "aria-label": ariaLabel,
    }: {
      href: string;
      children: React.ReactNode;
      className?: string;
      id?: string;
      "aria-current"?: string;
      "aria-label"?: string;
    }) =>
      React.createElement(
        "a",
        {
          href,
          className,
          id,
          "aria-current": ariaCurrent,
          "aria-label": ariaLabel,
        },
        children,
      ),
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
  it("renders a regular exercise node on the requested side", () => {
    const markup = renderToStaticMarkup(
      <TrailMapNode
        node={baseNode}
        trailId={12}
        index={1}
        isLeft={false}
      />,
    );

    expect(markup).toContain('id="node-42"');
    expect(markup).toContain('href="/trails/12/nodes/42"');
    expect(markup).toContain("aria-label=\"Exercícios práticos: Exercícios práticos\"");
    expect(markup).toContain("Etapa 2 · Exercícios práticos");
    expect(markup).toContain("justify-end");
    expect(markup).toContain("border-l-emerald-400");
    expect(markup).toContain("translate-x-3 sm:translate-x-5");
  });

  it("centers the final test and retains its amber highlight", () => {
    const markup = renderToStaticMarkup(
      <TrailMapNode
        node={{
          ...baseNode,
          isFinalTest: true,
          isCurrent: true,
          isMostAdvanced: true,
        }}
        trailId={12}
        index={7}
        isLeft={false}
      />,
    );

    expect(markup).toContain("justify-center");
    expect(markup).toContain("w-[90%] border-amber-400 bg-amber-50");
    expect(markup).toContain("Etapa mais avançada alcançada");
    expect(markup).not.toContain("translate-x-3");
  });
});
