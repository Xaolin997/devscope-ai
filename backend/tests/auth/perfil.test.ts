import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { createApp } from "../../src/app.js";

describe("GET /auth/perfil", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = createApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("deve rejeitar uma requisição sem token", async () => {
    const resposta = await app.inject({
      method: "GET",
      url: "/auth/perfil"
    });

    expect(resposta.statusCode).toBe(401);

    expect(resposta.json()).toEqual({
      erro: "Token inválido ou não informado"
    });
  });

  it("deve aceitar um token válido", async () => {
    const token = app.jwt.sign({
      sub: "usuario-teste-id",
      email: "teste@devscope.com"
    });

    const resposta = await app.inject({
      method: "GET",
      url: "/auth/perfil",
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    expect(resposta.statusCode).toBe(200);

    expect(resposta.json()).toEqual({
      usuarioId: "usuario-teste-id",
      email: "teste@devscope.com"
    });
  });
});