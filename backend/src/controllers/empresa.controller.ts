import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  buscarEmpresasDoUsuario,
  criarEmpresa
} from "../services/empresa.service.js";

const criarEmpresaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
});

export async function criarEmpresaController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const validacao = criarEmpresaSchema.safeParse(request.body);

  if (!validacao.success) {
    return reply.status(400).send({
      erro: "Dados inválidos",
      detalhes: validacao.error.flatten()
    });
  }

  try {
    const empresa = await criarEmpresa({
      nome: validacao.data.nome,
      usuarioId: request.user.sub
    });

    return reply.status(201).send(empresa);
  } catch (erro) {
    request.log.error(erro);

    return reply.status(500).send({
      erro: "Não foi possível criar a empresa"
    });
  }
}

export async function listarEmpresasController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const empresas = await buscarEmpresasDoUsuario(request.user.sub);

    return reply.send(empresas);
  } catch (erro) {
    request.log.error(erro);

    return reply.status(500).send({
      erro: "Não foi possível listar as empresas"
    });
  }
}