import pgPromise, { IDatabase, IInitOptions, IMain } from "pg-promise";
import { DEFAULT_DATABASE_CONFIG } from "../config/db";
import { FriendshipsRepository, UsersRepository } from "../entities/types";
import { createFriendshipsRepo } from "./DbFriendshipsRepo";
import { createUserRepo } from "./DbUsersRepo";

interface DbExtensions {
  friendships: FriendshipsRepository;
  users: UsersRepository;
}

export type Database = IDatabase<DbExtensions> & DbExtensions;

export function createDatabase(): Database {
  const init: IInitOptions<DbExtensions> = {
    extend: (db: Database) => {
      db.friendships = createFriendshipsRepo(db);
      db.users = createUserRepo(db, pgp);
    },
  };
  const pgp: IMain = pgPromise(init);

  return pgp(DEFAULT_DATABASE_CONFIG);
}
