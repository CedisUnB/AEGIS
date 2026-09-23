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
  fieldValues: { username: string; email: string };
  resetKey: string;
}

export interface SignInState {
  error: string | null;
  fieldErrors: Partial<Record<SignInField, string>>;
  fieldValues: { email: string };
  resetKey: string;
}

export async function logoutAction(): Promise<never> {
  (await cookies()).delete("token");
  (await cookies()).delete("username")
  redirect("/");
}


export async function signInAction(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const fieldValues = { email: String(formData.get("email") ?? "") };
  const resetKey = crypto.randomUUID();

  const parsed = signInSchema.safeParse({
    email: fieldValues.email,
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

    return { error: null, fieldErrors, fieldValues, resetKey };
  }

  try {
    const { user, token } = await loginUser(parsed.data);

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_AGE,
    });

    (await cookies()).set("username", user, {
      httpOnly: false,
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

    return { ...result, fieldValues, resetKey };
  }

  redirect("/trails");
}

export async function signUpAction(
  _prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const fieldValues = {
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
  };
  const resetKey = crypto.randomUUID();

  const parsed = signUpSchema.safeParse({
    username: fieldValues.username,
    email: fieldValues.email,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<SignUpField, string>> = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (
        (field === "username" || field === "email" || field === "password" || field === "confirmPassword") &&
        !fieldErrors[field]
      ) {
        fieldErrors[field] = issue.message;
      }
    }

    return { error: null, fieldErrors, fieldValues, resetKey };
  }

  try {
    const { user, token } = await registerUser({
      username: parsed.data.username,
      email: parsed.data.email,
      password: parsed.data.password,
      confirmPassword: parsed.data.confirmPassword,
    });

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_AGE,
    });

    (await cookies()).set("username", user, {
      httpOnly: false,
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

    return { ...result, fieldValues, resetKey };
  }

  redirect("/trails");
}

export async function getProfileUserAction(): Promise<ActionResponse<UserProfile>> {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return { success: false, error: "Não autorizado", statusCode: 401 };
    }

    const session = await verifyToken(token);
    if (!session || !session.sub) {
      return { success: false, error: "Sessão inválida ou expirada", statusCode: 401 };
    }

    const profile = await getUserProfile(session.sub);

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