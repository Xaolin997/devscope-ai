import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import type { FastifyInstance } from "fastify";

import { createApp } from "../../src/app.js";
import { prisma } from "../../src/config/prisma.js";
import { limparBanco } from "../helpers/limpar-banco.js";

type LoginResposta = {
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
  token: string;
};

type EmpresaResposta = {
  id: string;
  nome: string;
};

type ProjetoResposta = {
  id: string;
  nome: string;
  descricao: string | null;
  status: "ATIVO" | "PAUSADO" | "CONCLUIDO" | "CANCELADO";
  dataInicio: string | null;
  dataLimite: string | null;
  empresaId: string;
  criadoEm: string;
  atualizadoEm: string;
};

describe("CRUD de projetos", () => {
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

  async function criarUsuarioEToken(email = "admin@devscope.com") {
    const cadastro = await app.inject({
      method: "POST",
      url: "/auth/cadastro",
      payload: {
        nome: "Usuário Teste",
        email,
        senha: "12345678",
      },
    });

    expect(cadastro.statusCode).toBe(201);

    const login = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email,
        senha: "12345678",
      },
    });

    expect(login.statusCode).toBe(200);

    const corpo = login.json<LoginResposta>();

    return {
      usuarioId: corpo.usuario.id,
      token: corpo.token,
    };
  }

  async function criarEmpresa(token: string, nome = "TechFlow") {
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

  async function criarProjeto(
    token: string,
    empresaId: string,
    nome = "DevScope",
  ) {
    const resposta = await app.inject({
      method: "POST",
      url: `/empresas/${empresaId}/projetos`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        nome,
        descricao: "Plataforma de gestão de projetos",
        status: "ATIVO",
        dataInicio: "2026-07-15T00:00:00.000Z",
        dataLimite: "2026-12-20T00:00:00.000Z",
      },
    });

    expect(resposta.statusCode).toBe(201);

    return resposta.json<ProjetoResposta>();
  }

  it("deve rejeitar acesso sem token", async () => {
    const resposta = await app.inject({
      method: "GET",
      url: "/empresas/00000000-0000-4000-8000-000000000000/projetos",
    });

    expect(resposta.statusCode).toBe(401);

    expect(resposta.json()).toMatchObject({
      codigo: "TOKEN_INVALIDO",
      erro: "Token inválido ou não informado",
    });
  });

  it("deve criar um projeto como ADMIN", async () => {
    const { token } = await criarUsuarioEToken();
    const empresa = await criarEmpresa(token);

    const resposta = await app.inject({
      method: "POST",
      url: `/empresas/${empresa.id}/projetos`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        nome: "DevScope",
        descricao: "SaaS de acompanhamento de projetos",
        status: "ATIVO",
        dataInicio: "2026-07-15T00:00:00.000Z",
        dataLimite: "2026-12-20T00:00:00.000Z",
      },
    });

    expect(resposta.statusCode).toBe(201);

    const projeto = resposta.json<ProjetoResposta>();

    expect(projeto).toMatchObject({
      nome: "DevScope",
      descricao: "SaaS de acompanhamento de projetos",
      status: "ATIVO",
      empresaId: empresa.id,
    });

    const projetoSalvo = await prisma.projeto.findUnique({
      where: {
        id: projeto.id,
      },
    });

    expect(projetoSalvo).not.toBeNull();
    expect(projetoSalvo?.nomeNormalizado).toBe("devscope");
  });

  it("deve impedir projeto duplicado na mesma empresa", async () => {
    const { token } = await criarUsuarioEToken();
    const empresa = await criarEmpresa(token);

    await criarProjeto(token, empresa.id, "DevScope");

    const duplicado = await app.inject({
      method: "POST",
      url: `/empresas/${empresa.id}/projetos`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        nome: "  DÉVSCOPE  ",
      },
    });

    expect(duplicado.statusCode).toBe(409);

    expect(duplicado.json()).toMatchObject({
      erro: "Já existe um projeto com esse nome nesta empresa",
      codigo: "RECURSO_DUPLICADO",
    });
  });

  it("deve permitir projetos iguais em empresas diferentes", async () => {
    const { token } = await criarUsuarioEToken();

    const empresaA = await criarEmpresa(token, "Empresa A");
    const empresaB = await criarEmpresa(token, "Empresa B");

    const projetoA = await criarProjeto(token, empresaA.id, "Portal");

    const projetoB = await criarProjeto(token, empresaB.id, "Portal");

    expect(projetoA.nome).toBe("Portal");
    expect(projetoB.nome).toBe("Portal");
    expect(projetoA.empresaId).not.toBe(projetoB.empresaId);
  });

  it("deve rejeitar período inválido", async () => {
    const { token } = await criarUsuarioEToken();
    const empresa = await criarEmpresa(token);

    const resposta = await app.inject({
      method: "POST",
      url: `/empresas/${empresa.id}/projetos`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        nome: "Projeto Inválido",
        dataInicio: "2026-12-20T00:00:00.000Z",
        dataLimite: "2026-07-15T00:00:00.000Z",
      },
    });

    expect(resposta.statusCode).toBe(400);

    expect(resposta.json()).toMatchObject({
      erro: "A data limite não pode ser anterior à data de início",
      codigo: "DADOS_INVALIDOS",
    });
  });

  it("deve listar os projetos da empresa", async () => {
    const { token } = await criarUsuarioEToken();
    const empresa = await criarEmpresa(token);

    await criarProjeto(token, empresa.id, "Projeto A");
    await criarProjeto(token, empresa.id, "Projeto B");

    const resposta = await app.inject({
      method: "GET",
      url: `/empresas/${empresa.id}/projetos`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(resposta.statusCode).toBe(200);

    const projetos = resposta.json<ProjetoResposta[]>();

    expect(projetos).toHaveLength(2);

    expect(projetos.map((projeto) => projeto.nome)).toEqual(
      expect.arrayContaining(["Projeto A", "Projeto B"]),
    );
  });

  it("deve buscar um projeto por ID", async () => {
    const { token } = await criarUsuarioEToken();
    const empresa = await criarEmpresa(token);
    const projeto = await criarProjeto(token, empresa.id);

    const resposta = await app.inject({
      method: "GET",
      url: `/empresas/${empresa.id}/projetos/${projeto.id}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(resposta.statusCode).toBe(200);

    expect(resposta.json()).toMatchObject({
      id: projeto.id,
      nome: "DevScope",
      empresaId: empresa.id,
    });
  });

  it("deve retornar 404 para projeto inexistente", async () => {
    const { token } = await criarUsuarioEToken();
    const empresa = await criarEmpresa(token);

    const resposta = await app.inject({
      method: "GET",
      url: `/empresas/${empresa.id}/projetos/00000000-0000-4000-8000-000000000000`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(resposta.statusCode).toBe(404);

    expect(resposta.json()).toMatchObject({
      erro: "Projeto não encontrado",
      codigo: "RECURSO_NAO_ENCONTRADO",
    });
  });

  it("deve atualizar um projeto", async () => {
    const { token } = await criarUsuarioEToken();
    const empresa = await criarEmpresa(token);
    const projeto = await criarProjeto(token, empresa.id);

    const resposta = await app.inject({
      method: "PATCH",
      url: `/empresas/${empresa.id}/projetos/${projeto.id}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        nome: "DevScope Pro",
        descricao: "Versão atualizada",
        status: "PAUSADO",
        dataLimite: "2027-01-15T00:00:00.000Z",
      },
    });

    expect(resposta.statusCode).toBe(200);

    expect(resposta.json()).toMatchObject({
      id: projeto.id,
      nome: "DevScope Pro",
      descricao: "Versão atualizada",
      status: "PAUSADO",
    });

    const atualizado = await prisma.projeto.findUnique({
      where: {
        id: projeto.id,
      },
    });

    expect(atualizado?.nomeNormalizado).toBe("devscope pro");
    expect(atualizado?.status).toBe("PAUSADO");
  });

  it("deve excluir um projeto", async () => {
    const { token } = await criarUsuarioEToken();
    const empresa = await criarEmpresa(token);
    const projeto = await criarProjeto(token, empresa.id);

    const resposta = await app.inject({
      method: "DELETE",
      url: `/empresas/${empresa.id}/projetos/${projeto.id}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(resposta.statusCode).toBe(204);

    const excluido = await prisma.projeto.findUnique({
      where: {
        id: projeto.id,
      },
    });

    expect(excluido).toBeNull();
  });

  it("deve impedir acesso de usuário que não pertence à empresa", async () => {
    const admin = await criarUsuarioEToken("admin@devscope.com");

    const externo = await criarUsuarioEToken("externo@devscope.com");

    const empresa = await criarEmpresa(admin.token);

    await criarProjeto(admin.token, empresa.id, "Projeto Privado");

    const resposta = await app.inject({
      method: "GET",
      url: `/empresas/${empresa.id}/projetos`,
      headers: {
        authorization: `Bearer ${externo.token}`,
      },
    });

    expect(resposta.statusCode).toBe(404);

    expect(resposta.json()).toMatchObject({
      erro: "Empresa não encontrada",
      codigo: "RECURSO_NAO_ENCONTRADO",
    });
  });

  it("deve impedir MEMBRO de criar projeto", async () => {
    const admin = await criarUsuarioEToken("admin@devscope.com");

    const membro = await criarUsuarioEToken("membro@devscope.com");

    const empresa = await criarEmpresa(admin.token);

    await prisma.membroEmpresa.create({
      data: {
        usuarioId: membro.usuarioId,
        empresaId: empresa.id,
        cargo: "MEMBRO",
      },
    });

    const resposta = await app.inject({
      method: "POST",
      url: `/empresas/${empresa.id}/projetos`,
      headers: {
        authorization: `Bearer ${membro.token}`,
      },
      payload: {
        nome: "Projeto Proibido",
      },
    });

    expect(resposta.statusCode).toBe(403);

    expect(resposta.json()).toMatchObject({
      erro: "Você não possui permissão para realizar esta operação",
      codigo: "SEM_PERMISSAO",
    });
  });

  it("deve permitir MEMBRO visualizar projetos", async () => {
    const admin = await criarUsuarioEToken("admin@devscope.com");

    const membro = await criarUsuarioEToken("membro@devscope.com");

    const empresa = await criarEmpresa(admin.token);

    await prisma.membroEmpresa.create({
      data: {
        usuarioId: membro.usuarioId,
        empresaId: empresa.id,
        cargo: "MEMBRO",
      },
    });

    await criarProjeto(admin.token, empresa.id, "Projeto Visível");

    const resposta = await app.inject({
      method: "GET",
      url: `/empresas/${empresa.id}/projetos`,
      headers: {
        authorization: `Bearer ${membro.token}`,
      },
    });

    expect(resposta.statusCode).toBe(200);

    expect(resposta.json()).toEqual([
      expect.objectContaining({
        nome: "Projeto Visível",
      }),
    ]);
  });
});
