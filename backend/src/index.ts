import express, { Request, Response } from "express";
import cors from "cors";
import data from "./cities.json";
import bodyParser from "body-parser";
import ICity from './models';

const port = 3000;
const cities: ICity[] = data;

const app = express();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}))

app.use(bodyParser.json());

app.get("/api/cities", (req: Request, res: Response) => {
    return res.send(cities);
})

app.get('/api/cities/density', (req: Request, res: Response) => {
    const citiesWithDensity: ICity[] = cities.map((city) => {
        let density = Math.floor(city.population / city.area)
        return { ...city, density: density };
    })
    return res.send(citiesWithDensity);
})

app.get("/api/cities/filter/:searchTerm", (req: Request, res: Response) => {
    const searchTerm = req.params.searchTerm;
    const filteredCities = cities.reduce((accumulator: ICity[], city: ICity) => {
        if (city.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            accumulator.push(city);
        }
        return accumulator;
    }, [])

    return res.send(filteredCities);
})

app.listen(port, () => {
    console.log(`Population statistics server started on http://localhost:${port}`);
})