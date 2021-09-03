import { AppComponents } from "../app/interfaces";
import { Friendship } from "../entities/types";
import { ServiceError } from "../utils/express-utils";
import { Edge, findPath as shouldSuggestFriendship } from "../utils/graph";

export function friendshipsLogic({
  usersRepo,
  friendshipsRepo,
}: Pick<AppComponents, "friendshipsRepo" | "usersRepo">) {
  return {
    async getAll() {
      return friendshipsRepo.getAll();
    },

    async create(friendship: Friendship) {
      if (await friendshipsRepo.exists(friendship)) {
        throw new ServiceError("The friendship already exists");
      }

      return friendshipsRepo.create(friendship);
    },

    async shouldSuggest(friendship: Friendship) {
      if (await friendshipsRepo.exists(friendship)) {
        return true; // or maybe false? No idea. Corner case.
      }

      // Check if both address are on the same parcel and connected.
      const addresses = [friendship.userAddress1, friendship.userAddress2];
      const users = await usersRepo.getByAddress(addresses);

      if (users.length !== addresses.length) {
        throw new ServiceError("Address not found");
      }

      if (users[0].x !== users[1].x || users[0].y !== users[1].y) {
        throw new ServiceError("The users are not in the same parcel");
      }

      // Get all the addresses that are connected at the same parcel.
      const addressesOnParcel = (await usersRepo.getByPosition({
        x: users[0].x, y: users[0].y,
      })).map(u => u.address);

      // Get all the friendhips relation between them.
      const friendships: Edge[] = (
        await friendshipsRepo.getByAddress(addressesOnParcel)
      ).map(f => [f.userAddress1, f.userAddress2]);

      return shouldSuggestFriendship(
        friendships,
        friendship.userAddress1,
        friendship.userAddress2,
      );
    },
  };
}