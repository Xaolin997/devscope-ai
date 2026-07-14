import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";

import { createApp } from "../src/app.js";

describe("GET /health", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = createApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("deve informar que a API está funcionando", async () => {
    const resposta = await app.inject({
      method: "GET",
      url: "/health"
    });

    expect(resposta.statusCode).toBe(200);

    expect(resposta.json()).toEqual({
      status: "ok",
      service: "DevScope API"
    });
  });
});