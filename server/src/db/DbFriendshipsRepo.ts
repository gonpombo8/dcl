import { Friendship, FriendshipsRepository } from "../entities/types";
import { Database } from "./database";

export function createFriendshipsRepo(db: Database): FriendshipsRepository {
  return {
    async getAll() {
      return db.manyOrNone("SELECT * FROM FRIENDSHIPS");
    },

    async getByAddress(addresses: string[]) {
      return db.manyOrNone(
        'SELECT * FROM FRIENDSHIPS WHERE "userAddress1" IN ($1:csv) AND "userAddress2" IN ($1:csv)',
        [addresses],
      );
    },

    async create(friendship: Friendship) {
      await db.none(
        'INSERT INTO FRIENDSHIPS ("userAddress1", "userAddress2") VALUES ($1, $2)',
        [friendship.userAddress1, friendship.userAddress2]
      );
      return friendship;
    },

    async exists(friendship: Friendship) {
      return (
        await db.one(
          'SELECT EXISTS (SELECT 1 FROM FRIENDSHIPS WHERE ("userAddress1" = $1 AND "userAddress2" = $2) OR ("userAddress2" = $1 AND "userAddress1" = $2))',
          [friendship.userAddress1, friendship.userAddress2]
        )
      ).exists as boolean;
    },
  };
}
