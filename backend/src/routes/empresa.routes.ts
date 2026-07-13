import type { FastifyInstance } from "fastify";
import {
  criarEmpresaController,
  listarEmpresasController
} from "../controllers/empresa.controller.js";
import { verificarAutenticacao } from "../middlewares/autenticacao.js";

export async function empresaRoutes(app: FastifyInstance) {
  app.addHook("preHandler", verificarAutenticacao);

  app.post("/", criarEmpresaController);
  app.get("/", listarEmpresasController);
}