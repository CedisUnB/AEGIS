import { renderToStaticMarkup } from "react-dom/server";
import type { TrailMapDTO } from "../../types";
import { TrailMap } from "./TrailMap";

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

const trail: TrailMapDTO = {
  id: 12,
  theme: "Segurança Web",
  focusNodeId: 42,
  nodes: [
    {
      id: 41,
      orderIndex: 0,
      nodeType: "lesson",
      title: "Introdução",
      kindLabel: "Teoria",
      isCompleted: true,
      isCurrent: false,
      isMostAdvanced: false,
      isFinalTest: false,
    },
    {
      id: 42,
      orderIndex: 1,
      nodeType: "exercise",
      title: "Teste final",
      kindLabel: "Teste final",
      isCompleted: false,
      isCurrent: true,
      isMostAdvanced: true,
      isFinalTest: true,
    },
    {
      id: 43,
      orderIndex: 2,
      nodeType: "exercise",
      title: "Exercícios práticos",
      kindLabel: "Exercícios práticos",
      isCompleted: false,
      isCurrent: false,
      isMostAdvanced: false,
      isFinalTest: false,
    },
    {
      id: 44,
      orderIndex: 3,
      nodeType: "lesson",
      title: "Próxima lição",
      kindLabel: "Teoria",
      isCompleted: false,
      isCurrent: false,
      isMostAdvanced: false,
      isFinalTest: false,
    },
  ],
};

describe("TrailMap", () => {
  it("renders the trail heading, ordered nodes, connectors, and focus target", () => {
    const markup = renderToStaticMarkup(<TrailMap trail={trail} />);

    expect(markup).toContain("Segurança Web");
    expect(markup).toContain('aria-label="Etapas da trilha em sequência"');
    expect(markup).toContain('id="node-41"');
    expect(markup).toContain('id="node-42"');
    expect(markup).toContain('id="node-43"');
    expect(markup).toContain('id="node-44"');
    expect(markup).toContain('viewBox="0 0 100 472"');
    expect(markup).toContain('stroke-dasharray="7 7"');
    expect(markup).toContain('d="M 30 44 L 50 172 L 30 300 L 70 428"');
    expect(markup).toContain("pointer-events-none");
    expect(markup).toContain('aria-labelledby="trail-node-title-42"');
  });

  it("renders an empty state when the trail has no nodes", () => {
    const markup = renderToStaticMarkup(
      <TrailMap trail={{ ...trail, nodes: [] }} />,
    );

    expect(markup).toContain("Esta trilha ainda não possui etapas disponíveis.");
    expect(markup).not.toContain("<path");
  });
});
