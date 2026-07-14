import type { FastifyInstance } from "fastify";

import { verificarAutenticacao } from "../../middlewares/autenticacao.js";

import {
  atualizarProjetoController,
  buscarProjetoController,
  criarProjetoController,
  excluirProjetoController,
  listarProjetosController
} from "./projeto.controller.js";

export async function projetoRoutes(app: FastifyInstance) {
  app.addHook("preHandler", verificarAutenticacao);

  app.post(
    "/:empresaId/projetos",
    criarProjetoController
  );

  app.get(
    "/:empresaId/projetos",
    listarProjetosController
  );

  app.get(
    "/:empresaId/projetos/:projetoId",
    buscarProjetoController
  );

  app.patch(
    "/:empresaId/projetos/:projetoId",
    atualizarProjetoController
  );

  app.delete(
    "/:empresaId/projetos/:projetoId",
    excluirProjetoController
  );
}