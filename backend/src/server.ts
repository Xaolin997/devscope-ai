import "dotenv/config";
import { createApp } from "./app.js";

const app = createApp();

const port = Number(process.env.PORT) || 3333;

try {
  await app.listen({
    port,
    host: "0.0.0.0"
  });

  console.log(`Servidor rodando em http://localhost:${port}`);
} catch (error) {
  app.log.error(error);
  process.exit(1);
}