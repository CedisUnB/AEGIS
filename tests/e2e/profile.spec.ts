import { test, expect, type Page } from '@playwright/test';

const PASSWORD = 'Senha@123';

function uniqueUser(prefix: string) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000);
  return {
    username: `${prefix}_${timestamp}_${random}`,
    email: `${prefix}_${timestamp}_${random}@example.com`,
  };
}

async function registerUser(page: Page, user: { username: string; email: string }) {
  await page.goto('/auth/register');
  await page.getByLabel('Nome de usuário').fill(user.username);
  await page.getByLabel('E-mail').fill(user.email);
  await page.getByLabel('Senha', { exact: true }).fill(PASSWORD);
  await page.getByLabel('Confirmar Senha').fill(PASSWORD);
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page).toHaveURL(/\/tracks$/);
}

async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/auth/login');
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
}

test.describe('Perfil de usuário', () => {
  test('deve visualizar os dados cadastrados no perfil', async ({ page }) => {
    const user = uniqueUser('view_profile');
    await registerUser(page, user);

    await page.goto('/profile');

    await expect(page.getByRole('heading', { name: 'Meu Perfil' })).toBeVisible();
    await expect(page.getByRole('heading', { name: user.username })).toBeVisible();
    await expect(page.getByText(user.email, { exact: true })).toBeVisible();
  });

  test('deve atualizar apenas o username sem exigir novo login', async ({ page }) => {
    const user = uniqueUser('update_username');
    await registerUser(page, user);

    await page.goto('/profile');
    await page.getByRole('button', { name: 'Editar Perfil' }).click();

    const newUsername = `${user.username}_renamed`;
    await page.getByLabel('Nome de Utilizador').fill(newUsername);
    await page.getByRole('button', { name: 'Salvar Alterações' }).click();

    await expect(page.getByText('Perfil atualizado com sucesso')).toBeVisible();
    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByRole('heading', { name: newUsername })).toBeVisible();
  });

  test('deve exigir novo login ao atualizar o e-mail', async ({ page }) => {
    const user = uniqueUser('update_email');
    await registerUser(page, user);

    await page.goto('/profile');
    await page.getByRole('button', { name: 'Editar Perfil' }).click();

    const newEmail = `updated_${user.email}`;
    await page.getByLabel('E-mail').fill(newEmail);
    await page.getByRole('button', { name: 'Salvar Alterações' }).click();

    await expect(page).toHaveURL(/\/auth\/login\?reauth=1$/);

    await loginUser(page, newEmail, PASSWORD);
    await expect(page).toHaveURL(/\/tracks$/);
  });

  test('deve rejeitar atualização para um e-mail já utilizado por outro usuário', async ({ page }) => {
    const userA = uniqueUser('taken_email_owner');
    const userB = uniqueUser('taken_email_wanter');

    await registerUser(page, userA);
    await page.context().clearCookies();

    await registerUser(page, userB);
    await page.goto('/profile');
    await page.getByRole('button', { name: 'Editar Perfil' }).click();

    await page.getByLabel('E-mail').fill(userA.email);
    await page.getByRole('button', { name: 'Salvar Alterações' }).click();

    await expect(page.getByText('Este e-mail já foi cadastrado.')).toBeVisible();
    await expect(page).toHaveURL(/\/profile$/);
  });

  test('deve rejeitar exclusão de conta com senha incorreta', async ({ page }) => {
    const user = uniqueUser('delete_wrong_password');
    await registerUser(page, user);

    await page.goto('/profile');
    await page.getByRole('button', { name: 'Excluir Conta' }).click();
    await page.getByLabel('Digite sua senha atual para confirmar').fill('SenhaErrada@999');
    await page.getByRole('button', { name: 'Confirmar Exclusão' }).click();

    await expect(page.getByText('Senha incorreta.')).toBeVisible();
    await expect(page).toHaveURL(/\/profile$/);
  });

  test('deve excluir a conta com a senha correta e exibir confirmação na home', async ({ page }) => {
    const user = uniqueUser('delete_ok');
    await registerUser(page, user);

    await page.goto('/profile');
    await page.getByRole('button', { name: 'Excluir Conta' }).click();
    await page.getByLabel('Digite sua senha atual para confirmar').fill(PASSWORD);
    await page.getByRole('button', { name: 'Confirmar Exclusão' }).click();

    await expect(page).toHaveURL(/\/\?deleted=true$/);
    await expect(page.getByText(/conta.*exclu[ií]da/i)).toBeVisible();
  });

  test('deve negar acesso ao perfil administrativo para um estudante', async ({ page }) => {
    const user = uniqueUser('student_no_admin');
    await registerUser(page, user);

    await page.goto('/admin/profile');

    await expect(page.getByText('Acesso Proibido')).toBeVisible();
  });
});
