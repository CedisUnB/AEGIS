import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { signToken } from "@/core/security";
import { authRepository } from "../auth/repositories/auth.repository";
import { SignUpInput, SignInInput, UserProfileSchema, UserProfile } from "../auth/types/auth.types";

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
  const user = await authRepository.findByEmail(input.email);

  if (!user) {
    throw new InvalidCredentialsError();
  }

  const isValidPassword = await bcrypt.compare(input.password, user.password);

  if (!isValidPassword) {
    throw new InvalidCredentialsError();
  }
  const token = await signToken({
    username: user.username,
    email: user.email,
    role: user.role,
  });

  return { user, token };
}

export async function registerUser(input: SignUpInput) {

  const existing = await authRepository.findByEmail(input.email);
  if (existing) throw new EmailAlreadyExistsError();

  const hashedPassword = await bcrypt.hash(input.password, 10);

  let user;
  try {
    user = await authRepository.createUser({
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

  const token = await signToken({ username: user.username, email: user.email, role: user.role });

  return { user, token };
}

export async function getUserProfile(email: string): Promise <UserProfile> {
  if(!email) {
    throw new Error("Identificador do usuário é obrigatório.")
  }

  const user = await authRepository.findProfileByEmail(email);

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  return UserProfileSchema.parse(user);
}