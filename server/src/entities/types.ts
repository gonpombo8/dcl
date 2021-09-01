export interface FriendshipsRepository {
  create(friendship: Friendship): Promise<Friendship>;
  exists(friendship: Friendship): Promise<boolean>;
  getAll(): Promise<Friendship[]>;
}

export type Friendship = {
  userAddress1: string;
  userAddress2: string;
};
