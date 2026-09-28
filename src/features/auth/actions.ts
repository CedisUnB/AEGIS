"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signUpSchema, signInSchema, updateProfileSchema, deleteAccountSchema } from "./types/auth.types";
import type { DeleteAccountInput, SignInInput, SignUpInput, UpdateProfileInput, UserProfile } from "./types/auth.types";
import { deleteUserAccount, ForbiddenError, getAdminProfile, getUserProfile, InvalidCredentialsError, loginUser, registerUser, updateUserProfile } from "./services/auth";
import { getAuthErrorState } from "./errors";
import { verifyToken } from "@/core/security";
import { authRepository } from "./repositories/auth.repository";

const TOKEN_AGE = 60 * 60 * 2; // 2 hours

export type SignUpField = keyof SignUpInput;
export type SignInField = keyof SignInInput;

type ActionResponse<TData, TFields extends string = string> = 
  | { success: true; data: TData; requiresReauth: boolean; statusCode: number }
  | { success: false; error: string; fieldErrors?: Partial<Record<TFields, string>>; statusCode: number };

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
      data: profile,
      requiresReauth: false,
      statusCode: 200
    }
  } catch(err) {
    return {
      success: false,
      error: (err as Error).message || "Erro ao carregar perfil",
      statusCode: 500,
    }
  }

}

export async function updateProfileUserAction(input: UpdateProfileInput): Promise<ActionResponse<UserProfile>> {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return { success: false, error: "Não autorizado", statusCode: 401 };
    }

    const session = await verifyToken(token);
    const userId = session?.sub as string;

    if (!session || !userId) {
      return { success: false, error: "Sessão inválida ou expirada", statusCode: 401 };
    }

    const parsed = updateProfileSchema.safeParse(input);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof UpdateProfileInput, string>> = {};

      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof UpdateProfileInput;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }

      return {
        success: false,
        error: "Dados inválidos",
        fieldErrors,
        statusCode: 400,
      };
    }

    const currentUser = await authRepository.findById(userId);
    if (!currentUser) {
      return { success: false, error: "Usuário não encontrado", statusCode: 404 };
    }

    const emailChanged = currentUser.email !== parsed.data.email;
    const passwordChanged = Boolean(parsed.data.password && parsed.data.password.trim().length > 0);
    const usernameChanged = currentUser.username !== parsed.data.username;
    const requiresReauth = emailChanged || passwordChanged;

    const updatedProfile = await updateUserProfile(userId, parsed.data);
    
    if (requiresReauth) {
      (await cookies()).delete("token");
      (await cookies()).delete("username");

      return {
        success: true,
        data: updatedProfile,
        requiresReauth: true,
        statusCode: 200
      };
    } else if (usernameChanged) {
      (await cookies()).delete("username");
      (await cookies()).set("username", parsed.data.username, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: TOKEN_AGE,
      });
    }

    return {
      success: true,
      data: updatedProfile,
      requiresReauth: false,
      statusCode: 200
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message || "Erro ao atualizar perfil",
      statusCode: 500,
    };
  }
}

export async function deleteAccountAction(
  input: DeleteAccountInput
): Promise<ActionResponse<null, keyof DeleteAccountInput>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, error: "Não autorizado", statusCode: 401 };
    }

    const session = await verifyToken(token);
    const userId = session?.sub as string;

    if (!session || !userId) {
      return { success: false, error: "Sessão inválida ou expirada", statusCode: 401 };
    }

    const parsed = deleteAccountSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Senha inválida",
        statusCode: 400,
      };
    }

    await deleteUserAccount(userId, parsed.data);

    // Destrói imediatamente a sessão do usuário
    cookieStore.delete("token");

    return {
      success: true,
      data: null,
      requiresReauth: true,
      statusCode: 200
    };
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return { success: false, error: "Senha incorreta.", statusCode: 400 };
    }

    return {
      success: false,
      error: (err as Error).message || "Erro ao excluir conta",
      statusCode: 500,
    };
  }
}

export async function getAdminProfileAction(): Promise<ActionResponse<UserProfile>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { success: false, error: "Não autorizado", statusCode: 401 };
    }

    const session = await verifyToken(token);
    const userId = session?.sub as string;

    if (!session || !userId) {
      return { success: false, error: "Sessão inválida ou expirada", statusCode: 401 };
    }

    // Checagem prévia no payload JWT
    if (session.role !== "admin") {
      return { success: false, error: "Acesso proibido: Requer perfil administrativo", statusCode: 403 };
    }

    const profile = await getAdminProfile(userId);

    return {
      success: true,
      data: profile,
      requiresReauth: false,
      statusCode: 200
    };
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return { success: false, error: err.message, statusCode: 403 };
    }

    return {
      success: false,
      error: (err as Error).message || "Erro ao carregar perfil administrativo",
      statusCode: 500,
    };
  }
}