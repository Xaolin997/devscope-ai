import type { FastifyInstance } from "fastify";

import { obterUsuarioId } from "../../helpers/obter-usuario-id.js";
import { verificarAutenticacao } from "../../middlewares/autenticacao.js";
import {
  cadastroController,
  loginController,
} from "./auth.controller.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/cadastro", cadastroController);
  app.post("/login", loginController);

  app.get(
    "/perfil",
    {
      preHandler: verificarAutenticacao,
    },
    async (request) => {
      return {
        usuarioId: obterUsuarioId(request),
        email: request.user.email,
      };
    },
  );
}
