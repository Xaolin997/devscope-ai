import "dotenv/config";
import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.PORT) || 3333;

try {
  await app.listen({
    port,
    host: "0.0.0.0"
  });
} catch (erro) {
  app.log.error(erro);
  process.exit(1);
}