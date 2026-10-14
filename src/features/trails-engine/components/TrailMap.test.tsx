import { renderToStaticMarkup } from "react-dom/server";
import type { TrailMapDTO } from "../types";
import { TrailMap } from "./TrailMap";

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
  it("renders a connected sequence with content routes and progress highlighting", () => {
    const markup = renderToStaticMarkup(<TrailMap trail={trail} />);

    expect(markup).toContain('aria-label="Etapas da trilha em sequência"');
    expect(markup).toContain('href="/trails/12/nodes/41"');
    expect(markup).toContain('href="/trails/12/nodes/42"');
    expect(markup).toContain('href="/trails/12/nodes/43"');
    expect(markup).toContain('href="/trails/12/nodes/44"');
    expect(markup).toContain('id="node-42"');
    expect(markup).toContain('aria-current="step"');
    expect(markup).toContain("Etapa mais avançada alcançada");
    expect(markup).toContain("Teste final");
    expect(markup).toContain('class="relative z-10 flex w-full justify-center"');
    expect(markup).toContain("border-amber-400 bg-amber-50 text-amber-950");
    expect(markup).toContain("border-l-sky-400");
    expect(markup).toContain("border-l-emerald-400");
    expect(markup).toContain("<svg");
    expect(markup).toContain(
      'd="M12 6.5c-1.5-1-3.5-1.5-6-1.5v13c2.5 0 4.5.5 6 1.5m0-13c1.5-1 3.5-1.5 6-1.5v13c-2.5 0-4.5.5-6 1.5m0-13v13"',
    );
    expect(markup).toContain('<circle cx="12" cy="12" r="8"');
    expect(markup).toContain('<circle cx="12" cy="12" r="3"');
    expect(markup).not.toContain("★");
    expect(markup).toContain("before:bg-border");
  });

  it("renders an empty state for a track without nodes", () => {
    const markup = renderToStaticMarkup(
      <TrailMap trail={{ ...trail, nodes: [] }} />,
    );

    expect(markup).toContain("Esta trilha ainda não possui etapas disponíveis.");
  });
});
