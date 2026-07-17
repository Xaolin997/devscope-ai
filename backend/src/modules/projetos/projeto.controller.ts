import type { FastifyReply, FastifyRequest } from "fastify";

import { DadosInvalidosError } from "../../errors/domain-errors.js";

import {
  buscarProjeto,
  buscarProjetos,
  cadastrarProjeto,
  editarProjeto,
  removerProjeto,
} from "./projeto.service.js";

import {
  atualizarProjetoSchema,
  criarProjetoSchema,
  paramsEmpresaSchema,
  paramsProjetoSchema,
} from "./projeto.schema.js";

export async function criarProjetoController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const params = paramsEmpresaSchema.safeParse(request.params);
  const corpo = criarProjetoSchema.safeParse(request.body);

  if (!params.success || !corpo.success) {
    throw new DadosInvalidosError("Dados inválidos", {
      params: params.success ? undefined : params.error.flatten(),
      corpo: corpo.success ? undefined : corpo.error.flatten(),
    });
  }

  const projeto = await cadastrarProjeto({
    usuarioId: request.user.sub,
    empresaId: params.data.empresaId,
    ...corpo.data,
  });

  return reply.status(201).send(projeto);
}

export async function listarProjetosController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const params = paramsEmpresaSchema.safeParse(request.params);

  if (!params.success) {
    throw new DadosInvalidosError(
      "ID da empresa inválido",
      params.error.flatten(),
    );
  }

  const projetos = await buscarProjetos(
    params.data.empresaId,
    request.user.sub,
  );

  return reply.send(projetos);
}

export async function buscarProjetoController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const params = paramsProjetoSchema.safeParse(request.params);

  if (!params.success) {
    throw new DadosInvalidosError(
      "Parâmetros inválidos",
      params.error.flatten(),
    );
  }

  const projeto = await buscarProjeto(
    params.data.empresaId,
    params.data.projetoId,
    request.user.sub,
  );

  return reply.send(projeto);
}

export async function atualizarProjetoController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const params = paramsProjetoSchema.safeParse(request.params);
  const corpo = atualizarProjetoSchema.safeParse(request.body);

  if (!params.success || !corpo.success) {
    throw new DadosInvalidosError("Dados inválidos", {
      params: params.success ? undefined : params.error.flatten(),
      corpo: corpo.success ? undefined : corpo.error.flatten(),
    });
  }

  const projeto = await editarProjeto({
    usuarioId: request.user.sub,
    empresaId: params.data.empresaId,
    projetoId: params.data.projetoId,
    ...corpo.data,
  });

  return reply.send(projeto);
}

export async function excluirProjetoController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const params = paramsProjetoSchema.safeParse(request.params);

  if (!params.success) {
    throw new DadosInvalidosError(
      "Parâmetros inválidos",
      params.error.flatten(),
    );
  }

  await removerProjeto(
    params.data.empresaId,
    params.data.projetoId,
    request.user.sub,
  );

  return reply.status(204).send();
}
