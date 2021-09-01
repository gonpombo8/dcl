import runner from "node-pg-migrate";
import { MigrationDirection, RunnerOption } from "node-pg-migrate/dist/types";
import { join } from "path";
import { DEFAULT_DATABASE_CONFIG } from "../config/db";

export const MigrationsRunner = {
  async run() {
    const migrationsFolder = join(__dirname, "scripts");

    const options: RunnerOption = {
      migrationsTable: "migrations",
      dir: migrationsFolder,
      direction: "up" as MigrationDirection,
      createSchema: true,
      createMigrationsSchema: true,
      ignorePattern: ".*.ts|.*.map",
      count: Infinity,
      databaseUrl: DEFAULT_DATABASE_CONFIG,
      verbose: true,
    };

    await runner(options);
  },
};
