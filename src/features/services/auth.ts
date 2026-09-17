import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { signToken } from "@/core/security";
import { findByEmail, createUser } from "../auth/repositories/auth.repository";
import type { SignUpInput } from "../auth/types/auth.types";

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("Este e-mail já foi cadastrado.");
    this.name = "EmailAlreadyExistsError";
  }
}

export async function registerUser(input: SignUpInput) {

  const existing = await findByEmail(input.email);
  if (existing) throw new EmailAlreadyExistsError();

  const hashedPassword = await bcrypt.hash(input.password, 10);

  let user;
  try {
    user = await createUser({
      email: input.email,
      username: input.username,
      password: hashedPassword,
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new EmailAlreadyExistsError();
    }

    throw error;
  }

  const token = await signToken({ sub: user.email, role: user.role });

  return { user, token };
}