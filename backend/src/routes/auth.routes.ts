import type { FastifyInstance } from "fastify";
import {
  cadastroController,
  loginController
} from "../controllers/auth.controller.js";
import { verificarAutenticacao } from "../middlewares/autenticacao.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/cadastro", cadastroController);
  app.post("/login", loginController);

  app.get(
    "/perfil",
    {
      preHandler: verificarAutenticacao
    },
    async request => {
      return {
        usuarioId: request.user.sub,
        email: request.user.email
      };
    }
  );
}