import type { FastifyReply, FastifyRequest } from "fastify";

import { DadosInvalidosError } from "../../errors/domain-errors.js";
import { obterUsuarioId } from "../../helpers/obter-usuario-id.js";
import {
  buscarEmpresaDoUsuario,
  buscarEmpresasDoUsuario,
  criarEmpresa,
  editarEmpresa,
  removerEmpresa,
} from "./empresa.service.js";
import {
  atualizarEmpresaSchema,
  criarEmpresaSchema,
  empresaParamsSchema,
} from "./empresa.schema.js";

export async function criarEmpresaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const corpo = criarEmpresaSchema.safeParse(request.body);

  if (!corpo.success) {
    throw new DadosInvalidosError(
      "Dados inválidos",
      corpo.error.flatten(),
    );
  }

  const empresa = await criarEmpresa({
    nome: corpo.data.nome,
    usuarioId: obterUsuarioId(request),
  });

  return reply.status(201).send(empresa);
}

export async function listarEmpresasController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const empresas = await buscarEmpresasDoUsuario(
    obterUsuarioId(request),
  );

  return reply.send(empresas);
}

export async function buscarEmpresaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const params = empresaParamsSchema.safeParse(request.params);

  if (!params.success) {
    throw new DadosInvalidosError(
      "ID da empresa inválido",
      params.error.flatten(),
    );
  }

  const empresa = await buscarEmpresaDoUsuario(
    params.data.id,
    obterUsuarioId(request),
  );

  return reply.send(empresa);
}

export async function atualizarEmpresaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const params = empresaParamsSchema.safeParse(request.params);
  const corpo = atualizarEmpresaSchema.safeParse(request.body);

  if (!params.success) {
    throw new DadosInvalidosError(
      "ID da empresa inválido",
      params.error.flatten(),
    );
  }

  if (!corpo.success) {
    throw new DadosInvalidosError(
      "Dados inválidos",
      corpo.error.flatten(),
    );
  }

  const empresa = await editarEmpresa({
    empresaId: params.data.id,
    usuarioId: obterUsuarioId(request),
    nome: corpo.data.nome,
  });

  return reply.send(empresa);
}

export async function excluirEmpresaController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const params = empresaParamsSchema.safeParse(request.params);

  if (!params.success) {
    throw new DadosInvalidosError(
      "ID da empresa inválido",
      params.error.flatten(),
    );
  }

  await removerEmpresa(
    params.data.id,
    obterUsuarioId(request),
  );

  return reply.status(204).send();
}
