import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import ICity from './models';
import fs from "fs/promises"
import path from "path";
import { PORT, DATA_FILE, ENCODING } from "./constants";
import { defaultErrorHandler, errorHandler, errorLogger, undefinedRoutesHandler } from "./errorHandlers";
import { getFilteredCities, getCities, getCitiesDensity, getSortedCities, addNewCity } from "./controllers/cities.controller";

let cities: ICity[] = [];

const app = express();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}))

app.use(bodyParser.json());

app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (cities.length === 0) {
        try {
            cities = JSON.parse(await fs.readFile(path.join(__dirname, DATA_FILE), ENCODING))
        } catch (err) {
            (err as any).type = 'data-retrieval'
            next(err)
        }
    }
    (req as any)['cities'] = cities
    next()
})

app.get("/", getCities);
app.get('/density', getCitiesDensity);
app.get('/sort/:property/:order', getSortedCities);
app.get("/filter/:searchTerm", getFilteredCities);
app.post("/add", addNewCity)

app.use(errorHandler)
app.use(undefinedRoutesHandler)
app.use(errorLogger)
app.use(defaultErrorHandler)


app.listen(PORT, () => {
    console.log(`Population statistics server started on http://localhost:${PORT}`);
})