import { AppComponents } from "../app/interfaces";
import { Friendship } from "../entities/types";
import { ServiceError } from "../utils/express-utils";

export function friendshipsLogic({
  friendshipsRepo,
}: Pick<AppComponents, "friendshipsRepo">) {
  return {
    async getAll() {
      return friendshipsRepo.getAll();
    },

    async create(friendship: Friendship) {
      if (await friendshipsRepo.exists(friendship))
        throw new ServiceError("The friendship already exists");
      return friendshipsRepo.create(friendship);
    },
  };
}
