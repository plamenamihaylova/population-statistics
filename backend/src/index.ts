import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import ICity from './models';
import fs from "fs/promises"
import path from "path";
import { PORT, DATA_FILE, ENCODING } from "./constants";
import { defaultErrorHandler, errorHandler, errorLogger } from "./errorHandlers";

let cities: ICity[] = [];

const app = express();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}))

app.use(bodyParser.json());

// const readFile = async () => {
//     // try {
//     //const data = await fs.readFile(path.join(__dirname, 'cities.json'), 'utf-8')
//     //cities = JSON.parse(data)
//     cities = JSON.parse(await fs.readFile(path.join(__dirname, 'DATA_FILE'), ENCODING))
//     // } catch (err) {
//     //     throw new Error('Error occurred while trying to read the data.');
//     // }
// }

const addCity = async (city: ICity) => {
    try {
        // const data = await fs.readFile(path.join(__dirname, DATA_FILE), ENCODING)
        // let dataJson: ICity[] = JSON.parse(data)
        // dataJson.push(city)
        cities.push(city)
        await fs.writeFile(path.join(__dirname, DATA_FILE), JSON.stringify(cities, null, 1))
    } catch (err) {
        throw new Error();
    }
}

app.use(async (req: Request, res: Response, next: NextFunction) => {
    console.log('hello from use method')
    if (cities.length === 0) {
        try {
            cities = JSON.parse(await fs.readFile(path.join(__dirname, DATA_FILE), ENCODING))
        } catch (err: any) {
            err.type ='data retrieval'
            next(err)
        }
    }
    next()
})

app.get("/api/cities", async (req: Request, res: Response, next: NextFunction) => {
    res.send(cities);
})

app.get('/api/cities/density', (req: Request, res: Response) => {
    const citiesWithDensity: ICity[] = cities.map((city) => {
        let density = Math.floor(city.population / city.area)
        return { ...city, density: density };
    })
    return res.send(citiesWithDensity);
})

app.get('/api/sort/:order/:property', (req: Request, res: Response) => {
    const sortProperty: any = req.params.property
    const sortOrder: string = req.params.order
    const sortedCities = sortCities(sortOrder, sortProperty)
    return res.send(sortedCities)
})

app.post('/api/create', async (req: Request, res: Response) => {
    const { name, area, population } = req.body
    const params = [name, area, population]

    try {
        params.forEach((param) => {
            if (param === undefined) return res.status(400).send({ error: 'Bad Request', message: 'Cannot create new city. Missing parameter(s).' })
        })

        // if (cities.length === 0) await readFile();

        // console.log(`city name ${name}`)
        // console.log(`city area ${area}`)
        // console.log(`city population ${population}`)

        // const newCity: ICity = {
        //     name: name,
        //     area: area,
        //     population: population,
        // }

        await addCity({ name: name, area: area, population: population })

        return res.send(cities)
    } catch (err) {
        return res.status(400)
    }


})


const sortCities = (sortOrder: string, sortProperty: keyof ICity): ICity[] => {
    if (!(sortProperty in cities[0])) {
        throw new Error('Invalid sorting parameter')
    }
    // add error handling for the cases when sort order is not the correct value
    return cities.sort((city1, city2) => {
        const city1Value = city1[sortProperty] ?? '';
        const city2Value = city2[sortProperty] ?? '';

        if (sortOrder === 'asc') {
            return city1Value < city2Value ? -1 : 1;
        }

        return city1Value < city2Value ? 1 : -1;
    })
}

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

app.use(errorLogger)
app.use(errorHandler)
app.use(defaultErrorHandler)


app.listen(PORT, () => {
    console.log(`Population statistics server started on http://localhost:${PORT}`);
})