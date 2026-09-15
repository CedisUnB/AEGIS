import bcrypt from "bcryptjs";
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

  const user = await createUser({
    email: input.email,
    username: input.username,
    password: hashedPassword,
  });

  const token = await signToken({ sub: user.email, role: user.role });

  return { user, token };
}