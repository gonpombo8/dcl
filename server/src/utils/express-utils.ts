import { RequestHandler, Request, Response } from "express";
import { parseSchema, Type } from "mural-schema";
import { TypeMap } from "mural-schema/types";

import { AppComponents } from "../app/interfaces";

const statusTexts: Record<number, string> = {
  400: "bad-request",
  401: "unauthorized",
  402: "method-not-allowed",
  403: "forbidden",
  404: "not-found",
  500: "internal-server-error",
  501: "not-implemented",
  503: "service-unavailable",
};

export class ServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public statusMessage?: string
  ) {
    super(message);
  }
}

export function asyncHandler(
  handler: (req: Request, res: Response) => Promise<void>,
  { logger }: Pick<AppComponents, "logger">
): RequestHandler {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (e) {
      if (e instanceof ServiceError) {
        logger.error(
          "info",
          `Error while performing request ${req.method} ${req.originalUrl}`,
          e
        );
        res
          .status(e.statusCode)
          .send({
            status: e.statusMessage ?? statusTexts[e.statusCode] ?? "error",
            message: e.message,
          });
      } else {
        // Unexpected errors should terminate the application
        logger.error(
          "Unexpected error in server. Application will terminate",
          e
        );
        process.exit(1);
      }
    }
  };
}

const customTypes: TypeMap = {
  ethAddress: (v) => typeof v === 'string' && !!(/0x[a-fA-F0-9]{40}/.test(v)),
};

export function validateSchema<T = unknown>(schema: Type, body: T) {
  const validate = parseSchema(schema, { customTypes });
  const errors = validate(body);

  if (!errors.length) {
    return;
  }

  throw new ServiceError('INVALID_PAYLOAD', 400, errors[0]?.message);
}