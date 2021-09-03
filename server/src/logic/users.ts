import { AppComponents } from "../app/interfaces";
import { Position, User } from "../entities/types";
import { ServiceError } from "../utils/express-utils";

interface UpdateBody {
  moved: { id: string, position: Position } [];
  disconnected: string[];
}

export function usersLogic({
  usersRepo,
}: Pick<AppComponents, "usersRepo">) {
  return {
    async updateMoves(body: UpdateBody) {
      // Remove duplicate ones just in case and add disconnect.
      const usersMoved: User[] = body.moved
        .filter(m => !body.disconnected.includes(m.id))
        .map(m => ({
          address: m.id,
          x: m.position.x,
          y: m.position.y,
          disconnected: false
        }));

      const updateDisconnected = body.disconnected
        ? usersRepo.updateDisconnected(body.disconnected)
        : undefined;
      const updatePosition = usersMoved.length
        ? usersRepo.upsertMulti(usersMoved)
        : undefined;

      await Promise.all([updateDisconnected, updatePosition]);
    },
  };
}
