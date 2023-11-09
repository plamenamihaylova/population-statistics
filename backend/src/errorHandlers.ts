import { NextFunction, Request, Response } from "express";
import log from "./utils/logger";

export function undefinedRoutesHandler(req: Request, res: Response, next: NextFunction) {
  const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function defaultErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  const statusCode: number = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).send({
    error: error.name,
    message: error.message,
  });
  log.error(error.message);
}
