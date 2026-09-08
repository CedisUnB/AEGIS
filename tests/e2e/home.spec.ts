import { test, expect } from '@playwright/test';

test.describe('Página Inicial / Status da Aplicação', () => {
  test('deve carregar a home e exibir o status da aplicação', async ({ page }) => {
    // Acessa a raiz
    await page.goto('/');

    // Verifica se o título principal está visível
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    // Valida o texto que renderizamos no page.tsx
    await expect(page.getByText(/Status da Aplicação|Hello World/i)).toBeVisible();
  });
});