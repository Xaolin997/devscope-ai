import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import type { FastifyInstance } from "fastify";

import { createApp } from "../../src/app.js";
import { prisma } from "../../src/config/prisma.js";
import { limparBanco } from "../helpers/limpar-banco.js";

describe("POST /auth/cadastro", () => {
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

  it("deve cadastrar um usuário", async () => {
    const resposta = await app.inject({
      method: "POST",
      url: "/auth/cadastro",
      payload: {
        nome: "Usuário Teste",
        email: "teste@devscope.com",
        senha: "12345678",
      },
    });

    expect(resposta.statusCode).toBe(201);

    const corpo = resposta.json();

    expect(corpo).toMatchObject({
      nome: "Usuário Teste",
      email: "teste@devscope.com",
    });

    expect(corpo).not.toHaveProperty("senha");
    expect(corpo).not.toHaveProperty("senhaHash");

    const usuarioSalvo = await prisma.usuario.findUnique({
      where: {
        email: "teste@devscope.com",
      },
    });

    expect(usuarioSalvo).not.toBeNull();
    expect(usuarioSalvo?.senhaHash).not.toBe("12345678");
  });

  it("deve impedir e-mail duplicado", async () => {
    const dados = {
      nome: "Usuário Teste",
      email: "duplicado@devscope.com",
      senha: "12345678",
    };

    await app.inject({
      method: "POST",
      url: "/auth/cadastro",
      payload: dados,
    });

    const resposta = await app.inject({
      method: "POST",
      url: "/auth/cadastro",
      payload: dados,
    });

    expect(resposta.statusCode).toBe(409);

    expect(resposta.json()).toMatchObject({
      erro: "Este e-mail já está cadastrado",
      codigo: "RECURSO_DUPLICADO",
    });
  });
});
