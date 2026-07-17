import { z } from "zod";

export const empresaParamsSchema = z.object({
  id: z.string().uuid("ID da empresa inválido"),
});

export const criarEmpresaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
});

export const atualizarEmpresaSchema = criarEmpresaSchema;

export type DadosCriacaoEmpresa = z.infer<typeof criarEmpresaSchema>;
export type DadosAtualizacaoEmpresa = z.infer<
  typeof atualizarEmpresaSchema
>;
