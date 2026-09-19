import { test, expect } from '@playwright/test';

test.describe('Página Inicial / Auth', () => {
  test('deve carregar a home e exibir o status da aplicação', async ({ page }) => {
    await page.goto('/');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(page.getByText(/Hello World/i)).toBeVisible();
  });

  test('deve fazer login com usuário existente e redirecionar para /trails', async ({ page }) => {
    await page.goto('/auth/login');

    await page.getByLabel('E-mail').fill('student@example.com');
    await page.getByLabel('Senha').fill('Senha@123');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/\/trails$/);
    await expect(page.getByRole('heading', { name: 'Trilhas disponíveis' })).toBeVisible();
  });

  test('deve criar uma conta nova e redirecionar para /trails', async ({ page }) => {
    const uniqueEmail = `playwright-${Date.now()}@example.com`;

    await page.goto('/auth/register');

    await page.getByLabel('Nome de usuário').fill('playwright_user');
    await page.getByLabel('E-mail').fill(uniqueEmail);
    await page.getByLabel('Senha').fill('Senha@123');
    await page.getByRole('button', { name: 'Criar conta' }).click();

    await expect(page).toHaveURL(/\/trails$/);
    await expect(page.getByRole('heading', { name: 'Trilhas disponíveis' })).toBeVisible();
  });
});