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
  
  async findById(id: string): Promise<UserProfile | null> {
    return prisma.user.findUnique({
      where: {id},
      select: {
        username: true,
        email: true,
        createdAt: true
      }
    })
  }

  async updateUser(
    id: string,
    data: {
      username: string,
      email: string,
      password?: string
    }
  ): Promise<UserProfile> {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    })
  }
}

export const authRepository = new AuthRepository();