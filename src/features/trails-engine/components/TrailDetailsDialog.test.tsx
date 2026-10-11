import { renderToStaticMarkup } from "react-dom/server";
import { trailCatalogFixture } from "../__fixtures__/trail-catalog";
import { TrailDetailsDialog } from "./TrailDetailsDialog";

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

describe("TrailDetailsDialog", () => {
  it("renders the selected trail details and its action", () => {
    const trail = trailCatalogFixture[0];
    const markup = renderToStaticMarkup(
      <TrailDetailsDialog trail={trail} onClose={() => undefined} />,
    );

    expect(markup).toContain('aria-labelledby="trail-dialog-title"');
    expect(markup).toContain(trail.theme);
    expect(markup).toContain(trail.description);
    expect(markup).toContain(`${trail.completedNodes} concluídas`);
    expect(markup).toContain(`href="/trails/${trail.id}"`);
    expect(markup).toContain("Continuar trilha");
    expect(markup).toContain("bg-surface");
    expect(markup).toContain("backdrop:bg-overlay");
  });
});
