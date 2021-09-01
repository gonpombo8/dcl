import { Express } from "express";
import { AppComponents } from "./app/interfaces";
import { statusLogic } from "./logic/status";
import { friendshipsLogic } from "./logic/friendships";
import { asyncHandler } from "./utils/express-utils";

export async function configureRoutes(
  expressApp: Express,
  components: AppComponents
) {
  const friendships = friendshipsLogic(components);
  const status = statusLogic();

  expressApp.get("/status", (_req, res) => res.send(status.getStatus()));

  expressApp.get(
    "/friendships",
    asyncHandler(async (_req, res) => {
      res.send(await friendships.getAll());
    }, components)
  );

  expressApp.post(
    "/friendships/:address1/:address2",
    asyncHandler(async (req, res) => {
      res.send(
        await friendships.create({
          userAddress1: req.params.address1,
          userAddress2: req.params.address2,
        })
      );
    }, components)
  );
}
