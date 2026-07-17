import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import type { FastifyInstance } from "fastify";

import { createApp } from "../../src/app.js";
import { prisma } from "../../src/config/prisma.js";
import { limparBanco } from "../helpers/limpar-banco.js";

type UsuarioResposta = {
  id: string;
  nome: string;
  email: string;
};

type LoginResposta = {
  usuario: UsuarioResposta;
  token: string;
};

type EmpresaResposta = {
  id: string;
  nome: string;
  criadoEm: string;
  atualizadoEm?: string;
};

describe("CRUD de empresas", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp();
    await app.ready();
  });

  beforeEach(async () => {
    await limparBanco();
  });

  afterAll(async () => {
    await limparBanco();
    await app.close();
    await prisma.$disconnect();
  });

  async function criarUsuarioEToken() {
    const cadastro = await app.inject({
      method: "POST",
      url: "/auth/cadastro",
      payload: {
        nome: "Usuário Teste",
        email: "empresa@devscope.com",
        senha: "12345678",
      },
    });

    expect(cadastro.statusCode).toBe(201);

    const login = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: "empresa@devscope.com",
        senha: "12345678",
      },
    });

    expect(login.statusCode).toBe(200);

    const corpo = login.json<LoginResposta>();

    expect(corpo.token).toBeTypeOf("string");

    return corpo.token;
  }

  async function criarEmpresa(token: string, nome: string) {
    const resposta = await app.inject({
      method: "POST",
      url: "/empresas",
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        nome,
      },
    });

    expect(resposta.statusCode).toBe(201);

    return resposta.json<EmpresaResposta>();
  }

  it("deve rejeitar acesso sem token", async () => {
    const resposta = await app.inject({
      method: "GET",
      url: "/empresas",
    });

    expect(resposta.statusCode).toBe(401);

    expect(resposta.json()).toMatchObject({
      erro: "Token inválido ou não informado",
      codigo: "TOKEN_INVALIDO",
    });
  });

  it("deve criar uma empresa", async () => {
    const token = await criarUsuarioEToken();

    const resposta = await app.inject({
      method: "POST",
      url: "/empresas",
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        nome: "TechFlow",
      },
    });

    expect(resposta.statusCode).toBe(201);

    const corpo = resposta.json<EmpresaResposta>();

    expect(corpo).toMatchObject({
      nome: "TechFlow",
    });

    expect(corpo.id).toBeTypeOf("string");

    const empresaSalva = await prisma.empresa.findUnique({
      where: {
        id: corpo.id,
      },
      include: {
        membros: true,
      },
    });

    expect(empresaSalva).not.toBeNull();
    expect(empresaSalva?.membros).toHaveLength(1);
    expect(empresaSalva?.membros[0]?.cargo).toBe("ADMIN");
  });

  it("deve impedir empresa duplicada para o mesmo usuário", async () => {
    const token = await criarUsuarioEToken();

    const primeira = await app.inject({
      method: "POST",
      url: "/empresas",
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        nome: "TechFlow",
      },
    });

    expect(primeira.statusCode).toBe(201);

    const duplicada = await app.inject({
      method: "POST",
      url: "/empresas",
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        nome: "  TÉCHFLOW  ",
      },
    });

    expect(duplicada.statusCode).toBe(409);

    expect(duplicada.json()).toMatchObject({
      erro: "Você já possui uma empresa com esse nome",
      codigo: "RECURSO_DUPLICADO",
    });
  });

  it("deve listar as empresas do usuário", async () => {
    const token = await criarUsuarioEToken();

    await criarEmpresa(token, "TechFlow");
    await criarEmpresa(token, "DevCorp");

    const resposta = await app.inject({
      method: "GET",
      url: "/empresas",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(resposta.statusCode).toBe(200);

    const empresas = resposta.json<Array<EmpresaResposta>>();

    expect(empresas).toHaveLength(2);

    expect(empresas.map((empresa) => empresa.nome)).toEqual(
      expect.arrayContaining(["TechFlow", "DevCorp"]),
    );
  });

  it("deve buscar uma empresa por ID", async () => {
    const token = await criarUsuarioEToken();
    const empresa = await criarEmpresa(token, "TechFlow");

    const resposta = await app.inject({
      method: "GET",
      url: `/empresas/${empresa.id}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(resposta.statusCode).toBe(200);

    expect(resposta.json()).toMatchObject({
      id: empresa.id,
      nome: "TechFlow",
    });
  });

  it("deve retornar 404 ao buscar empresa inexistente", async () => {
    const token = await criarUsuarioEToken();

    const resposta = await app.inject({
      method: "GET",
      url: "/empresas/00000000-0000-4000-8000-000000000000",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(resposta.statusCode).toBe(404);

    expect(resposta.json()).toMatchObject({
      erro: "Empresa não encontrada",
      codigo: "RECURSO_NAO_ENCONTRADO",
    });
  });

  it("deve atualizar uma empresa", async () => {
    const token = await criarUsuarioEToken();
    const empresa = await criarEmpresa(token, "TechFlow");

    const resposta = await app.inject({
      method: "PATCH",
      url: `/empresas/${empresa.id}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        nome: "TechFlow Sistemas",
      },
    });

    expect(resposta.statusCode).toBe(200);

    expect(resposta.json()).toMatchObject({
      id: empresa.id,
      nome: "TechFlow Sistemas",
    });

    const empresaAtualizada = await prisma.empresa.findUnique({
      where: {
        id: empresa.id,
      },
    });

    expect(empresaAtualizada?.nome).toBe("TechFlow Sistemas");
    expect(empresaAtualizada?.nomeNormalizado).toBe("techflow sistemas");
  });

  it("deve excluir uma empresa", async () => {
    const token = await criarUsuarioEToken();
    const empresa = await criarEmpresa(token, "TechFlow");

    const resposta = await app.inject({
      method: "DELETE",
      url: `/empresas/${empresa.id}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(resposta.statusCode).toBe(204);

    const empresaExcluida = await prisma.empresa.findUnique({
      where: {
        id: empresa.id,
      },
    });

    expect(empresaExcluida).toBeNull();
  });
});
