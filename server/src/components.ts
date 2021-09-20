import { AppComponents } from "./app/interfaces";
import { createDatabase } from "./db/database";

export async function initComponents(): Promise<AppComponents> {
  const db = createDatabase();
  return {
    friendshipsRepo: db.friendships,
    logger: console,
    usersRepo: db.users,
  };
}
