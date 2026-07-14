import type {
  FastifyReply,
  FastifyRequest
} from "fastify";

import { z } from "zod";

import { Prisma } from "../../generated/prisma/client.js";

import {
  buscarProjeto,
  buscarProjetos,
  cadastrarProjeto,
  editarProjeto,
  removerProjeto
} from "./projeto.service.js";

const paramsEmpresaSchema = z.object({
  empresaId: z.string().uuid()
});

const paramsProjetoSchema = z.object({
  empresaId: z.string().uuid(),
  projetoId: z.string().uuid()
});

const statusProjetoSchema = z.enum([
  "ATIVO",
  "PAUSADO",
  "CONCLUIDO",
  "CANCELADO"
]);

const criarProjetoSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  descricao: z.string().trim().max(2000).optional(),
  status: statusProjetoSchema.optional(),
  dataInicio: z.string().datetime().optional(),
  dataLimite: z.string().datetime().optional()
});

const atualizarProjetoSchema = z
  .object({
    nome: z.string().trim().min(2).max(120).optional(),
    descricao: z.string().trim().max(2000).nullable().optional(),
    status: statusProjetoSchema.optional(),
    dataInicio: z.string().datetime().nullable().optional(),
    dataLimite: z.string().datetime().nullable().optional()
  })
  .refine(dados => Object.keys(dados).length > 0, {
    message: "Informe pelo menos um campo para atualização"
  });

function tratarErro(
  erro: unknown,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (
    erro instanceof Prisma.PrismaClientKnownRequestError &&
    erro.code === "P2002"
  ) {
    return reply.status(409).send({
      erro: "Já existe um projeto com esse nome nesta empresa"
    });
  }

  if (erro instanceof Error) {
    if (erro.message === "EMPRESA_NAO_ENCONTRADA") {
      return reply.status(404).send({
        erro: "Empresa não encontrada"
      });
    }

    if (erro.message === "PROJETO_NAO_ENCONTRADO") {
      return reply.status(404).send({
        erro: "Projeto não encontrado"
      });
    }

    if (erro.message === "SEM_PERMISSAO") {
      return reply.status(403).send({
        erro: "Você não possui permissão para realizar esta operação"
      });
    }

    if (erro.message === "PERIODO_INVALIDO") {
      return reply.status(400).send({
        erro: "A data limite não pode ser anterior à data de início"
      });
    }
  }

  request.log.error(erro);

  return reply.status(500).send({
    erro: "Erro interno do servidor"
  });
}

export async function criarProjetoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = paramsEmpresaSchema.safeParse(request.params);
  const corpo = criarProjetoSchema.safeParse(request.body);

  if (!params.success || !corpo.success) {
    return reply.status(400).send({
      erro: "Dados inválidos",
      detalhes: {
        params: params.success ? undefined : params.error.flatten(),
        corpo: corpo.success ? undefined : corpo.error.flatten()
      }
    });
  }

  try {
    const projeto = await cadastrarProjeto({
      usuarioId: request.user.sub,
      empresaId: params.data.empresaId,
      ...corpo.data
    });

    return reply.status(201).send(projeto);
  } catch (erro) {
    return tratarErro(erro, request, reply);
  }
}

export async function listarProjetosController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = paramsEmpresaSchema.safeParse(request.params);

  if (!params.success) {
    return reply.status(400).send({
      erro: "ID da empresa inválido"
    });
  }

  try {
    const projetos = await buscarProjetos(
      params.data.empresaId,
      request.user.sub
    );

    return reply.send(projetos);
  } catch (erro) {
    return tratarErro(erro, request, reply);
  }
}

export async function buscarProjetoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = paramsProjetoSchema.safeParse(request.params);

  if (!params.success) {
    return reply.status(400).send({
      erro: "Parâmetros inválidos"
    });
  }

  try {
    const projeto = await buscarProjeto(
      params.data.empresaId,
      params.data.projetoId,
      request.user.sub
    );

    return reply.send(projeto);
  } catch (erro) {
    return tratarErro(erro, request, reply);
  }
}

export async function atualizarProjetoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = paramsProjetoSchema.safeParse(request.params);
  const corpo = atualizarProjetoSchema.safeParse(request.body);

  if (!params.success || !corpo.success) {
    return reply.status(400).send({
      erro: "Dados inválidos",
      detalhes: {
        params: params.success ? undefined : params.error.flatten(),
        corpo: corpo.success ? undefined : corpo.error.flatten()
      }
    });
  }

  try {
    const projeto = await editarProjeto({
      usuarioId: request.user.sub,
      empresaId: params.data.empresaId,
      projetoId: params.data.projetoId,
      ...corpo.data
    });

    return reply.send(projeto);
  } catch (erro) {
    return tratarErro(erro, request, reply);
  }
}

export async function excluirProjetoController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const params = paramsProjetoSchema.safeParse(request.params);

  if (!params.success) {
    return reply.status(400).send({
      erro: "Parâmetros inválidos"
    });
  }

  try {
    await removerProjeto(
      params.data.empresaId,
      params.data.projetoId,
      request.user.sub
    );

    return reply.status(204).send();
  } catch (erro) {
    return tratarErro(erro, request, reply);
  }
}