/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

const TABLE_NAME = "users";
export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(TABLE_NAME, {
    address: { type: "text", primaryKey: true },
    x: { type: "smallint" },
    y: { type: "smallint" },
    disconnected: { type: "boolean" },
  });
  pgm.createIndex(TABLE_NAME, ['x', 'y']);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(TABLE_NAME);
}
