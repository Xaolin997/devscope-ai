import { z } from "zod";

export const paramsEmpresaSchema = z.object({
  empresaId: z.string().uuid(),
});

export const paramsProjetoSchema = z.object({
  empresaId: z.string().uuid(),
  projetoId: z.string().uuid(),
});

export const statusProjetoSchema = z.enum([
  "ATIVO",
  "PAUSADO",
  "CONCLUIDO",
  "CANCELADO",
]);

export const criarProjetoSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  descricao: z.string().trim().max(2000).optional(),
  status: statusProjetoSchema.optional(),
  dataInicio: z.string().datetime().optional(),
  dataLimite: z.string().datetime().optional(),
});

export const atualizarProjetoSchema = z
  .object({
    nome: z.string().trim().min(2).max(120).optional(),
    descricao: z.string().trim().max(2000).nullable().optional(),
    status: statusProjetoSchema.optional(),
    dataInicio: z.string().datetime().nullable().optional(),
    dataLimite: z.string().datetime().nullable().optional(),
  })
  .refine((dados) => Object.keys(dados).length > 0, {
    message: "Informe pelo menos um campo para atualização",
  });
