import express, { Express } from "express";
import morgan from "morgan";

import { AppComponents } from "./app/interfaces";
import { statusLogic } from "./logic/status";
import { friendshipsLogic } from "./logic/friendships";
import { usersLogic, UpdateBody } from "./logic/users";
import { asyncHandler, validateSchema } from "./utils/express-utils";

export async function configureRoutes(
  expressApp: Express,
  components: AppComponents
) {
  const friendships = friendshipsLogic(components);
  const users = usersLogic(components);
  const status = statusLogic();

  expressApp.use(express.json());
  expressApp.use(
    morgan('tiny')
  );

  expressApp.get(
    "/status",
    (_req, res) => res.send(status.getStatus()),
  );

  expressApp.get(
    "/friendships",
    asyncHandler(
      async (_req, res) => {
        res.send(await friendships.getAll());
      },
      components,
    ),
  );

  expressApp.post(
    "/friendships/:address1/:address2",
    asyncHandler(
      async (req, res) => {
        validateSchema(
          {
            address1: 'ethAddress',
            address2: 'ethAddress',
          },
          req.params,
        );
        res.send(
          await friendships.create({
            userAddress1: req.params.address1,
            userAddress2: req.params.address2,
          })
        );
      },
      components,
    ),
  );

  expressApp.post(
    "/users-update",
    asyncHandler(
      async (req, res) => {
        validateSchema<UpdateBody>(
          {
            moved: [{ id: 'ethAddress', position: { x: 'number', y: 'number' } }],
            disconnected: ['ethAddress'],
          },
          req.body,
        );
        await users.updateMoves(req.body);
        res.send({});
      },
      components,
    ),
  );

  expressApp.get(
    "/suggest-friendship/:address1/:address2",
    asyncHandler(
      async (req, res) => {
        validateSchema(
          {
            address1: 'ethAddress',
            address2: 'ethAddress',
          },
          req.params,
        );
        res.send(
          await friendships.shouldSuggest({
            userAddress1: req.params.address1,
            userAddress2: req.params.address2,
          })
        );
      },
      components,
    ),
  );
}
