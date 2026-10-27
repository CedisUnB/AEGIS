import { calculateProgress } from "./progress";

describe("calculateProgress", () => {
  it.each([
    [0, 8, 0],
    [1, 8, 13], // 12,5 arredonda para cima
    [3, 8, 38], // 37,5 arredonda para cima
    [1, 3, 33],
    [2, 3, 67],
    [4, 8, 50],
    [8, 8, 100],
  ])("calcula %i de %i como %i%%", (completed, total, expected) => {
    expect(calculateProgress(completed, total)).toBe(expected);
  });

  it("retorna 0 quando o total é zero, sem gerar NaN", () => {
    expect(calculateProgress(0, 0)).toBe(0);
  });

  it("retorna 0 quando o total é negativo", () => {
    expect(calculateProgress(3, -5)).toBe(0);
  });

  it("não passa de 100% quando há mais concluídos que o total", () => {
    expect(calculateProgress(9, 8)).toBe(100);
  });

  it("não fica abaixo de 0% com concluídos negativos", () => {
    expect(calculateProgress(-2, 8)).toBe(0);
  });

  it("retorna 0 para entradas não numéricas", () => {
    expect(calculateProgress(Number.NaN, 8)).toBe(0);
    expect(calculateProgress(3, Number.NaN)).toBe(0);
    expect(calculateProgress(3, Number.POSITIVE_INFINITY)).toBe(0);
  });
});