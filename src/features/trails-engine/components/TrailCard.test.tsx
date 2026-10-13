import { renderToStaticMarkup } from "react-dom/server";
import { trailCatalogFixture } from "../__fixtures__/trail-catalog";
import { TrailCard } from "./TrailCard";

describe("TrailCard", () => {
  const startedTrail = trailCatalogFixture[0];
  const notStartedTrail = trailCatalogFixture[1];

  it("renders a selectable card with progress for a started trail", () => {
    const markup = renderToStaticMarkup(
      <TrailCard
        trail={startedTrail}
        onSelect={() => undefined}
        variant="orbit"
      />,
    );

    expect(markup).toContain(
      `aria-label="Ver detalhes da trilha ${startedTrail.theme}"`,
    );
    expect(markup).toContain("aspect-square");
    expect(markup).toContain(startedTrail.theme);
    expect(markup).toContain(
      `${startedTrail.completedNodes}/${startedTrail.totalNodes} concluídos`,
    );
    expect(markup).toContain(`${startedTrail.totalNodes} etapas`);
    expect(markup).toContain("border-border");
    expect(markup).toContain("text-foreground");
  });

  it("uses the list layout and hides progress for a trail that has not started", () => {
    const markup = renderToStaticMarkup(
      <TrailCard
        trail={notStartedTrail}
        onSelect={() => undefined}
        variant="list"
      />,
    );

    expect(markup).toContain("min-h-28");
    expect(markup).toContain("flex-row");
    expect(markup).toContain(notStartedTrail.theme);
    expect(markup).toContain(`${notStartedTrail.totalNodes} etapas`);
    expect(markup).not.toContain("concluídos");
  });
});
