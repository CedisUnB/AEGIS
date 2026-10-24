import { renderToStaticMarkup } from "react-dom/server";
import { trackCatalogFixture } from "../../__fixtures__/track-catalog";
import { TrackDetailsDialog } from "./TrackDetailsDialog";

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

describe("TrackDetailsDialog", () => {
  it("renders the selected track details and its action", () => {
    const track = trackCatalogFixture[0];
    const markup = renderToStaticMarkup(
      <TrackDetailsDialog track={track} onClose={() => undefined} />,
    );

    expect(markup).toContain('aria-labelledby="track-dialog-title"');
    expect(markup).toContain(track.theme);
    expect(markup).toContain(track.description);
    expect(markup).toContain(`${track.completedNodes} concluídas`);
    expect(markup).toContain(`href="/tracks/${track.id}"`);
    expect(markup).toContain("Continuar trilha");
    expect(markup).toContain("bg-surface");
    expect(markup).toContain("backdrop:bg-overlay");
  });
});
