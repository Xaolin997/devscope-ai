import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  buscarEmpresaDoUsuario,
  buscarEmpresasDoUsuario,
  criarEmpresa,
  editarEmpresa,
  removerEmpresa,
} from "./empresa.service.js";

import { Prisma } from "../../generated/prisma/client.js";

const empresaParamsSchema = z.object({
  id: z.string().uuid("ID da empresa inválido"),
});

const empresaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
});

function erroDeDuplicidade(erro: unknown) {
  return (
    erro instanceof Prisma.PrismaClientKnownRequestError &&
    erro.code === "P2002"
  );
}

export async function criarEmpresaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const validacao = empresaSchema.safeParse(request.body);

  if (!validacao.success) {
    return reply.status(400).send({
      erro: "Dados inválidos",
      detalhes: validacao.error.flatten(),
    });
  }

  try {
    const empresa = await criarEmpresa({
      nome: validacao.data.nome,
      usuarioId: request.user.sub,
    });

    return reply.status(201).send(empresa);
  } catch (erro) {
    if (erroDeDuplicidade(erro)) {
      return reply.status(409).send({
        erro: "Você já possui uma empresa com esse nome",
      });
    }

    request.log.error(erro);

    return reply.status(500).send({
      erro: "Não foi possível criar a empresa",
    });
  }
}

export async function listarEmpresasController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const empresas = await buscarEmpresasDoUsuario(request.user.sub);

    return reply.send(empresas);
  } catch (erro) {
    request.log.error(erro);

    return reply.status(500).send({
      erro: "Não foi possível listar as empresas",
    });
  }
}

export async function buscarEmpresaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const validacao = empresaParamsSchema.safeParse(request.params);

  if (!validacao.success) {
    return reply.status(400).send({
      erro: "ID da empresa inválido",
    });
  }

  try {
    const empresa = await buscarEmpresaDoUsuario(
      validacao.data.id,
      request.user.sub,
    );

    return reply.send(empresa);
  } catch (erro) {
    if (erro instanceof Error && erro.message === "EMPRESA_NAO_ENCONTRADA") {
      return reply.status(404).send({
        erro: "Empresa não encontrada",
      });
    }

    request.log.error(erro);

    return reply.status(500).send({
      erro: "Não foi possível buscar a empresa",
    });
  }
}

export async function atualizarEmpresaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const params = empresaParamsSchema.safeParse(request.params);

  const corpo = empresaSchema.safeParse(request.body);

  if (!params.success) {
    return reply.status(400).send({
      erro: "ID da empresa inválido",
    });
  }

  if (!corpo.success) {
    return reply.status(400).send({
      erro: "Dados inválidos",
      detalhes: corpo.error.flatten(),
    });
  }

  try {
    const empresa = await editarEmpresa({
      empresaId: params.data.id,
      usuarioId: request.user.sub,
      nome: corpo.data.nome,
    });

    return reply.send(empresa);
  } catch (erro) {
    if (erro instanceof Error && erro.message === "EMPRESA_NAO_ENCONTRADA") {
      return reply.status(404).send({
        erro: "Empresa não encontrada",
      });
    }

    if (erro instanceof Error && erro.message === "SEM_PERMISSAO") {
      return reply.status(403).send({
        erro: "Você não possui permissão para editar esta empresa",
      });
    }

    if (erroDeDuplicidade(erro)) {
      return reply.status(409).send({
        erro: "Você já possui uma empresa com esse nome",
      });
    }

    request.log.error(erro);

    return reply.status(500).send({
      erro: "Não foi possível atualizar a empresa",
    });
  }
}

export async function excluirEmpresaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const validacao = empresaParamsSchema.safeParse(request.params);

  if (!validacao.success) {
    return reply.status(400).send({
      erro: "ID da empresa inválido",
    });
  }

  try {
    await removerEmpresa(validacao.data.id, request.user.sub);

    return reply.status(204).send();
  } catch (erro) {
    if (erro instanceof Error && erro.message === "EMPRESA_NAO_ENCONTRADA") {
      return reply.status(404).send({
        erro: "Empresa não encontrada",
      });
    }

    if (erro instanceof Error && erro.message === "SEM_PERMISSAO") {
      return reply.status(403).send({
        erro: "Você não possui permissão para excluir esta empresa",
      });
    }

    request.log.error(erro);

    return reply.status(500).send({
      erro: "Não foi possível excluir a empresa",
    });
  }
}
