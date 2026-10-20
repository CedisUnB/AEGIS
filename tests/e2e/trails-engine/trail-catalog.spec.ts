import { expect, test } from '@playwright/test';
import { prisma } from '@/core/database/prisma';
import { loginAs } from '../../helpers/auth';
import {
  cleanup,
  completeNodes,
  createStudent,
  createTestPrefix,
  createTrail,
  markTrailCompleted,
  startTrail,
} from '../../helpers/trail-fixtures';

const PREFIX = createTestPrefix();

test.describe('Catálogo de trilhas (US06/US09)', () => {
  test.afterAll(async () => {
    try {
      await cleanup(PREFIX);
    } finally {
      await prisma.$disconnect();
    }
  });

  test('abre os detalhes da trilha e navega para o mapa', async ({ page }) => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: false,
    });

    await loginAs(page, student);

    await page
      .getByRole('button', { name: `Ver detalhes da trilha ${trail.theme}` })
      .click();
    const dialog = page.getByRole('dialog', { name: trail.theme });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(`Trilha de integração ${trail.theme}`)).toBeVisible();
    await dialog.getByRole('link', { name: 'Começar' }).click();

    await expect(page).toHaveURL(`/trails/${trail.id}`);
    await expect(
      page.getByRole('heading', { name: trail.theme }),
    ).toBeVisible();
  });

  test('mostra o progresso da trilha iniciada e omite o indicador sem progresso', async ({
    page,
  }) => {
    const student = await createStudent(PREFIX);
    const startedTrail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: false,
    });
    const untouchedTrail = await createTrail(PREFIX, {
      lessons: 1,
      withFinalTest: false,
    });
    await startTrail(student.id, startedTrail.id);
    await completeNodes(student.id, startedTrail.contentNodeIds.slice(0, 2));

    await loginAs(page, student);

    const startedCard = page.getByRole('button', {
      name: `Ver detalhes da trilha ${startedTrail.theme}`,
    });
    await expect(startedCard).toContainText('2/4 concluídos');

    const untouchedCard = page.getByRole('button', {
      name: `Ver detalhes da trilha ${untouchedTrail.theme}`,
    });
    await expect(untouchedCard).toBeVisible();
    await expect(untouchedCard).not.toContainText(/concluídos|Concluída/);
  });

  test('marca como concluída a trilha com todos os nós concluídos', async ({
    page,
  }) => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: true,
    });
    if (trail.finalTestNodeId === null) {
      throw new Error('A trilha de fixture deveria ter um teste final.');
    }
    await completeNodes(student.id, [
      ...trail.contentNodeIds,
      trail.finalTestNodeId,
    ]);
    await markTrailCompleted(student.id, trail.id);

    await loginAs(page, student);

    const completedCard = page.getByRole('button', {
      name: `Ver detalhes da trilha ${trail.theme}, concluída`,
    });
    await expect(completedCard).toBeVisible();
    await expect(completedCard).toContainText('Concluída');
  });
});
