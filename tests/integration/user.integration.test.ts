/**
 * @jest-environment node
 */
import { prisma } from '@/app/lib/prisma';

// Aumenta o timeout padrão deste arquivo de teste para 30 segundos
jest.setTimeout(30000);

describe('Integração: Operações de Usuário e Trilhas', () => {
  const testEmail = 'integration_test@example.com';

  beforeAll(async () => {
    // 1. Força a conexão imediata antes de rodar queries
    await prisma.$connect();
    // 2. Limpeza inicial
    await prisma.user.deleteMany({ where: { email: testEmail } });
  }, 30000); // 30s de timeout no hook

  afterAll(async () => {
    try {
      await prisma.user.deleteMany({ where: { email: testEmail } });
    } finally {
      // 3. Garante que o pool TCP seja fechado para liberar o Jest
      await prisma.$disconnect();
    }
  }, 30000);

  it('deve persistir um usuário no MySQL e associar a uma trilha', async () => {
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        username: 'integration_user',
        password: 'hashed_password_123',
        role: 'student',
      },
    });
    expect(user.email).toBe(testEmail);

    const track = await prisma.track.create({
      data: {
        theme: 'Introdução à Segurança Web',
        sequence: '01',
      },
    });

    const take = await prisma.takes.create({
      data: {
        userEmail: user.email,
        trackId: track.id,
        status: 'IN_PROGRESS',
      },
    });

    expect(take.status).toBe('IN_PROGRESS');
    expect(take.trackId).toBe(track.id);

    await prisma.track.delete({ where: { id: track.id } });
  });
});