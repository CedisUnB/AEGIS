import { prisma } from "@/core/database/prisma";
import { UserProfile } from "../types";
import "server-only";

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
  
  async createUser(data: { email: string; username: string; password: string }) {
    return prisma.user.create({ data });
  }
  
  async findProfileByEmail(email: string): Promise<UserProfile | null> {
    return prisma.user.findUnique({
      where: {email},
      select: {
        username: true,
        email: true,
        createdAt: true
      }
    })
  }
}

export const authRepository = new AuthRepository();