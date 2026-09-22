import { prisma } from "@/core/database/prisma";

export async function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: { email: string; username: string; password: string }) {
  return prisma.user.create({ data });
}