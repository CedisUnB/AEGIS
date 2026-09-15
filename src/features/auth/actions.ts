"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signUpSchema } from "./types/auth.types";
import { EmailAlreadyExistsError, registerUser } from "../services/auth";

export interface SignUpState {
  error: string | null;
}

export async function logoutAction(): Promise<never> {
  (await cookies()).delete("token");
  redirect("/auth/register");
}

export async function signUpAction(
  _prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // AC1 + AC2: validação de campos obrigatórios e força da senha
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const { token } = await registerUser(parsed.data);

    // AC5: autentica o usuário após o cadastro
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours, same time of the signToken
    });
  } catch (err) {
    // AC3: e-mail já cadastrado
    if (err instanceof EmailAlreadyExistsError) {
      return { error: err.message };
    }
    return { error: "Não foi possível criar a conta. Tente novamente." };
  }

  redirect("/trails");
}