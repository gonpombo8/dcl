import express from "express";

import { initComponents } from "./components";
import { MigrationsRunner } from "./migrations/Runner";
import { configureRoutes } from "./routes";

export async function main() {
  const expressApp = express();

  const components = await initComponents();

  await MigrationsRunner.run();

  await configureRoutes(expressApp, components);

  const port = parseInt(process.env.PORT ?? "8081", 10);

  return new Promise((resolve, reject) => {
    const server = expressApp
      .listen(port, () => {
        components.logger.info(`Application listening in port ${port}`);
        resolve(server);
      })
      .on("error", (e) => {
        reject(e);
      });
  });
}
