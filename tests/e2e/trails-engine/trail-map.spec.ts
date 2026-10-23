import { expect, test } from '@playwright/test';
import { loginAs } from '../../helpers/auth';
import {
  cleanup,
  completeNodes,
  createStudent,
  createTestPrefix,
  createTrail,
} from '../../helpers/trail-fixtures';
import { prisma } from '@/core/database/prisma';

const PREFIX = createTestPrefix();

test.describe('Mapa da trilha e progresso (US07/US08)', () => {
  test.afterAll(async () => {
    try {
      await cleanup(PREFIX);
    } finally {
      await prisma.$disconnect();
    }
  });

  test('mostra título, percentual, estados e etapas em sequência', async ({
    page,
  }) => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: false,
    });
    await completeNodes(student.id, trail.contentNodeIds.slice(0, 2));

    await loginAs(page, student);
    await page.goto(`/trails/${trail.id}`);

    await expect(page.getByRole('heading', { name: trail.theme })).toBeVisible();
    await expect(page.getByText('2 de 4 etapas concluídas · 50%')).toBeVisible();

    const firstLesson = page.getByRole('button', {
      name: `Teoria: ${trail.theme} lesson 1, concluído`,
    });
    const firstExercise = page.getByRole('button', {
      name: 'Exercícios práticos: Exercícios práticos, concluído, etapa mais avançada alcançada',
    });
    const secondLesson = page.getByRole('button', {
      name: `Teoria: ${trail.theme} lesson 2`,
    });
    const secondExercise = page.getByRole('button', {
      name: `Exercícios práticos: Exercícios práticos`,
      exact: true,
    });

    await expect(firstLesson).toBeVisible();
    await expect(firstExercise).toBeVisible();
    await expect(secondLesson).toBeVisible();
    await expect(secondExercise).toBeVisible();
    await expect(page.getByText('Etapa 1 · Concluída', { exact: true })).toBeVisible();
    await expect(page.getByText('Etapa 2 · Concluída', { exact: true })).toBeVisible();
    await expect(page.getByText('Etapa 3', { exact: true })).toBeVisible();
    await expect(page.getByText('Etapa 4', { exact: true })).toBeVisible();

    const orderedNodes = [firstLesson, firstExercise, secondLesson, secondExercise];
    const positions = await Promise.all(
      orderedNodes.map(async (node) => (await node.boundingBox())?.y),
    );
    expect(positions.every((position) => position !== undefined)).toBe(true);
    expect(positions).toEqual([...positions].sort((left, right) => left! - right!));
  });

  test('oferece Começar ou Revisar e navega à rota do nó escolhido', async ({
    page,
  }) => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 2,
      withFinalTest: false,
    });
    await completeNodes(student.id, [trail.contentNodeIds[0]]);

    await loginAs(page, student);
    await page.goto(`/trails/${trail.id}`);

    await page
      .getByRole('button', {
        name: `Teoria: ${trail.theme} lesson 2`,
      })
      .click();
    const beginDialog = page.getByRole('dialog', {
      name: `${trail.theme} lesson 2`,
    });
    await expect(beginDialog).toBeVisible();
    await beginDialog.getByRole('link', { name: 'Começar' }).click();
    await expect(page).toHaveURL(
      `/trails/${trail.id}/nodes/${trail.contentNodeIds[2]}`,
    );

    await page.goto(`/trails/${trail.id}`);
    await page
      .getByRole('button', {
        name: `Teoria: ${trail.theme} lesson 1, concluído, etapa mais avançada alcançada`,
      })
      .click();
    const reviewDialog = page.getByRole('dialog', {
      name: `${trail.theme} lesson 1`,
    });
    await expect(reviewDialog).toBeVisible();
    await reviewDialog.getByRole('link', { name: 'Revisar' }).click();
    await expect(page).toHaveURL(
      `/trails/${trail.id}/nodes/${trail.contentNodeIds[0]}`,
    );
  });

  test('restaura o foco no nó solicitado após rolar um mapa longo', async ({
    page,
  }) => {
    const student = await createStudent(PREFIX);
    const trail = await createTrail(PREFIX, {
      lessons: 10,
      withFinalTest: false,
    });
    const focusNodeId = trail.contentNodeIds[trail.contentNodeIds.length - 1];

    await loginAs(page, student);
    await page.goto(
      `/trails/${trail.id}?focus=${focusNodeId}#node-${focusNodeId}`,
    );

    await expect(page).toHaveURL(
      new RegExp(`/trails/${trail.id}\\?focus=${focusNodeId}#node-${focusNodeId}$`),
    );
    await expect(
      page.locator(`#node-${focusNodeId}`).getByRole('button'),
    ).toBeInViewport();
  });
});
