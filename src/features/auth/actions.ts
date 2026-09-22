"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signUpSchema, signInSchema } from "./types/auth.types";
import type { SignInInput, SignUpInput, UserProfile } from "./types/auth.types";
import { getUserProfile, loginUser, registerUser } from "../services/auth";
import { getAuthErrorState } from "./errors";
import { verifyToken } from "@/core/security";

const TOKEN_AGE = 60 * 60 * 2; // 2 hours, same time of the signToken

export type SignUpField = keyof SignUpInput;
export type SignInField = keyof SignInInput;

type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string; statusCode: number };

export interface SignUpState {
  error: string | null;
  fieldErrors: Partial<Record<SignUpField, string>>;
}

export interface SignInState {
  error: string | null;
  fieldErrors: Partial<Record<SignInField, string>>;
}

export async function logoutAction(): Promise<never> {
  (await cookies()).delete("token");
  redirect("/");
}

export async function signInAction(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<SignInField, string>> = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (
        (field === "email" || field === "password") &&
        !fieldErrors[field]
      ) {
        fieldErrors[field] = issue.message;
      }
    }

    return {
      error: null,
      fieldErrors,
    };
  }

  try {
    const { token } = await loginUser(parsed.data);

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_AGE,
    });
  } catch (err) {
    const result = getAuthErrorState(
      err,
      "Não foi possível logar a conta. Tente novamente."
    );

    return result;
  }

  redirect("/trails");
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
      maxAge: TOKEN_AGE,
    });
  } catch (err) {
    const result = getAuthErrorState(
      err,
      "Não foi possível criar a conta. Tente novamente.",
      "email"
    );

    return result;
  }

  redirect("/trails");
}

export async function getProfileUserAction(): Promise<ActionResponse<UserProfile>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, error: "Não autorizado", statusCode: 401 };
    }

    const session = await verifyToken(token);
    if (!session || !session.email) {
      return { success: false, error: "Sessão inválida ou expirada", statusCode: 401 };
    }

    const profile = await getUserProfile(session.email);

    return {
      success: true,
      data: profile
    }
  } catch(err) {
    return {
      success: false,
      error: (err as Error).message || "Erro ao carregar perfil",
      statusCode: 500,
    }
  }

}