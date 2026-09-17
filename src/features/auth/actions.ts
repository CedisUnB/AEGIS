"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signUpSchema } from "./types/auth.types";
import type { SignUpInput } from "./types/auth.types";
import { EmailAlreadyExistsError, registerUser } from "../services/auth";

export type SignUpField = keyof SignUpInput;

export interface SignUpState {
  error: string | null;
  fieldErrors: Partial<Record<SignUpField, string>>;
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

  if (!parsed.success) {
    const fieldErrors: Partial<Record<SignUpField, string>> = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (
        (field === "username" || field === "email" || field === "password") &&
        !fieldErrors[field]
      ) {
        fieldErrors[field] = issue.message;
      }
    }

    return { error: null, fieldErrors };
  }

  try {
    const { token } = await registerUser(parsed.data);

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours, same time of the signToken
    });
  } catch (err) {
    if (err instanceof EmailAlreadyExistsError) {
      return {
        error: null,
        fieldErrors: { email: err.message },
      };
    }
    return {
      error: "Não foi possível criar a conta. Tente novamente.",
      fieldErrors: {},
    };
  }

  redirect("/trails");
}