import { Friendship, FriendshipsRepository, Position, User, UsersRepository } from "../src/entities/types";

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
    async getByAddress(addresses: string[]): Promise<Friendship[]> {
      return [...friendships.values()].filter(
        f => addresses.includes(f.userAddress1) || addresses.includes(f.userAddress2)
      );
    }
  };
}

export function createUsersRepo(): UsersRepository {
  return {
    async getByAddress(address: User['address'][]): Promise<User[]> {
      return [];
    },
    async getByPosition(position: Position): Promise<User[]> {
      return [];
    },
    async upsertMulti(users: User[]): Promise<User[]> {
      return [];
    },
    async updateDisconnected(addresses: User['address'][]): Promise<void> {
    }
  }
}
