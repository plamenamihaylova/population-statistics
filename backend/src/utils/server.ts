import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import routes from "../routes/cities.routes";
import { DATA_FILE, ENCODING, RETRIEVING_DATA_ERR_MSG } from "../constants";
import { defaultErrorHandler, undefinedRoutesHandler } from "../errorHandlers";
import ICity from "../models";
import log from "./logger";

let cities: ICity[] = [];

const createServer = () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (cities.length === 0) {
      try {
        let data: ICity[] = JSON.parse(
          await fs.readFile(path.join(__dirname, "..", DATA_FILE), ENCODING)
        );
        if ("density" in data[0]) cities = data;
        else {
          cities = data.map((item) => {
            const density = Math.floor(item.population / item.area);
            return { ...item, density: density };
          });
        }
      } catch (err: any) {
        res
          .status(500)
          .send({ error: err.name, message: RETRIEVING_DATA_ERR_MSG });
        log.error(err.message);
      }
    }
    (req as any)["cities"] = cities;
    next();
  });

  routes(app);

  app.use(undefinedRoutesHandler);
  app.use(defaultErrorHandler);

  return app;
};

export default createServer;
