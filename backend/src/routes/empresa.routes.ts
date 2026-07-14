import type { FastifyInstance } from "fastify";

import {
  atualizarEmpresaController,
  buscarEmpresaController,
  criarEmpresaController,
  excluirEmpresaController,
  listarEmpresasController,
} from "../controllers/empresa.controller.js";

import { verificarAutenticacao } from "../middlewares/autenticacao.js";

export async function empresaRoutes(app: FastifyInstance) {
  app.addHook("preHandler", verificarAutenticacao);

  app.post("/", criarEmpresaController);

  app.get("/", listarEmpresasController);

  app.get("/:id", buscarEmpresaController);

  app.patch("/:id", atualizarEmpresaController);

  app.delete("/:id", excluirEmpresaController);
}
