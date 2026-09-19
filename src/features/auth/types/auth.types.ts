import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

export const signUpSchema = z.object({
  username: z.string().min(3, "Nome de usuário muito curto").max(100),
  email: z.email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .max(20, "A senha deve ter no máximo 20 caracteres")
    .regex(passwordRegex, "A senha deve conter maiúscula, minúscula, número e caractere especial"),
});

export const signInSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(8, "Senha inválida"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;