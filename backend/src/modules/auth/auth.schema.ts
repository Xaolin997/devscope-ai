import { z } from "zod";

export const cadastroSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .transform((email) => email.toLowerCase()),
  senha: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(72, "A senha deve ter no máximo 72 caracteres"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .transform((email) => email.toLowerCase()),
  senha: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(72, "A senha deve ter no máximo 72 caracteres"),
});

export type DadosCadastro = z.infer<typeof cadastroSchema>;
export type DadosLogin = z.infer<typeof loginSchema>;
