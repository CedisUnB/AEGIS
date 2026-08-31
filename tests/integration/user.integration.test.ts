/**
 * @jest-environment node
 */
import { prisma } from "@/app/lib/prisma";

describe('Integração: Operações de Usuário e Trilhas', () => {
  const testEmail = 'integration_test@example.com';

  // Limpeza antes e depois dos testes
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  it('deve persistir um usuário no MySQL e associar a uma trilha', async () => {
    // 1. Cria usuário
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        username: 'integration_user',
        password: 'hashed_password_123',
        role: 'student',
      },
    });
    expect(user.email).toBe(testEmail);

    // 2. Cria trilha
    const track = await prisma.track.create({
      data: {
        theme: 'Introdução à Segurança Web',
        sequence: '01',
      },
    });

    // 3. Cria vínculo na tabela associativa Takes (RF08 / Progresso)
    const take = await prisma.takes.create({
      data: {
        userEmail: user.email,
        trackId: track.id,
        status: 'IN_PROGRESS',
      },
    });

    expect(take.status).toBe('IN_PROGRESS');
    expect(take.trackId).toBe(track.id);

    // Limpeza da trilha criada
    await prisma.track.delete({ where: { id: track.id } });
  });
});