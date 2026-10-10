import { renderToStaticMarkup } from "react-dom/server";
import { trailCatalogFixture } from "../__fixtures__/trail-catalog";
import { TrailsMap } from "./TrailsMap";

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

describe("TrailsMap", () => {
  it("renders an empty state when there are no trails", () => {
    const markup = renderToStaticMarkup(<TrailsMap trails={[]} />);

    expect(markup).toContain(
      "Nenhuma trilha está disponível no momento.",
    );
  });

  it("renders selectable trail nodes and progress only for started trails", () => {
    const markup = renderToStaticMarkup(
      <TrailsMap trails={trailCatalogFixture} />,
    );

    expect(markup).toContain("Segurança Web");
    expect(markup).toContain("8 etapas");
    expect(markup).toContain("3/8 concluídos");
    expect(markup).toContain('aria-label="Ver detalhes da trilha Segurança Web"');
    expect(markup).toContain("Proteção de Dados");
    expect(markup).toContain("5 etapas");
    expect(markup).not.toContain("0/5 concluídos");
    expect(markup).toContain("🧭");
    expect(markup).toContain('class="md:hidden"');
    expect(markup).toContain('class="hidden md:block"');
  });

  it("keeps trails beyond the compass ring available in a separate grid", () => {
    const markup = renderToStaticMarkup(
      <TrailsMap trails={trailCatalogFixture} />,
    );

    expect(trailCatalogFixture).toHaveLength(11);
    expect(markup).toContain("<h2");
    expect(markup).toContain("Mais trilhas");
    expect(markup).toContain("(3)");
    expect(markup).toContain("Segurança em Nuvem");
    expect(markup).toContain("Resposta a Incidentes");
    expect(markup).toContain("Segurança de Dispositivos");
    expect(markup).toContain('aria-label="Mais trilhas"');
  });
});
