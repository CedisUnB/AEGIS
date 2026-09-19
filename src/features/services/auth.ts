import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { signToken } from "@/core/security";
import { findByEmail, createUser } from "../auth/repositories/auth.repository";
import type { SignUpInput, SignInInput } from "../auth/types/auth.types";

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("Este e-mail já foi cadastrado.");
    this.name = "EmailAlreadyExistsError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("E-mail ou senha inválidos.");
    this.name = "InvalidCredentialsError";
  }
}

export async function loginUser(input: SignInInput) {
  const user = await findByEmail(input.email);

  if (!user) {
    throw new InvalidCredentialsError();
  }

  const isValidPassword = await bcrypt.compare(input.password, user.password);

  if (!isValidPassword) {
    throw new InvalidCredentialsError();
  }
  const token = await signToken({
    sub: user.email,
    role: user.role,
  });

  return { user, token };
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