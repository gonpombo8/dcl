import pgPromise, { IDatabase } from "pg-promise";
import { DEFAULT_DATABASE_CONFIG } from "../config/db";
import { FriendshipsRepository } from "../entities/types";
import { createFriendshipsRepo as createFriendshipsRepo } from "./DbFriendshipsRepo";

interface DbExtensions {
  users: FriendshipsRepository;
}

export type Database = IDatabase<DbExtensions> & DbExtensions;

export function createDatabase(): Database {
  const pgp = pgPromise({
    extend: (db: Database) => {
      db.users = createFriendshipsRepo(db);
    },
  });

  return pgp(DEFAULT_DATABASE_CONFIG);
}
