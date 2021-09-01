import { Friendship, FriendshipsRepository } from "../src/entities/types";

export function createFriendshipsRepoMock(): FriendshipsRepository {
  const friendships = new Map<string, Friendship>();

  function keyFor(friendship: Friendship): string {
    return [friendship.userAddress1, friendship.userAddress2].sort().join("-");
  }

  return {
    async create(friendship: Friendship): Promise<Friendship> {
      friendships.set(keyFor(friendship), friendship);
      return friendship;
    },
    async exists(friendship: Friendship): Promise<boolean> {
      return friendships.has(keyFor(friendship));
    },
    async getAll(): Promise<Friendship[]> {
      return [...friendships.values()];
    },
  };
}
