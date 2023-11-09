import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import routes from "../routes";
import { DATA_FILE, ENCODING, RETRIEVING_DATA_ERR_MSG } from "../constants";
import { defaultErrorHandler, undefinedRoutesHandler } from "../errorHandlers";
import ICity from "../models";
import log from "./logger";

let cities: ICity[] = [];

const createServer = () => {
  const app = express();

  // app.use(express.json());

  app.use(bodyParser.json());
  //app.use(bodyParser.urlencoded({extended: true}));

  app.use(cors());

  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (cities.length === 0) {
      try {
        let data: ICity[] = JSON.parse(
          await fs.readFile(path.join(__dirname, "..", DATA_FILE), ENCODING)
        );
        cities = data.map((item) => {
          const density = Math.floor(item.population / item.area);
          return { ...item, density: density };
        });
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
