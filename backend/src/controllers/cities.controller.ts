import { NextFunction, Request, Response } from 'express';
import ICity from '../models';
import fs from "fs/promises"
import path from "path";
import { ASCENDING, BAD_POST_REQUEST_ERR_MSG, DATA_FILE, DESCENDING } from "../constants";

export const getCities = (req: Request, res: Response) => {
    const cities: ICity[] = (req as any).cities;
    res.send(cities);
};

export const getCitiesDensity = (req: Request, res: Response) => {
    const cities: ICity[] = (req as any).cities;

    const citiesWithDensity: ICity[] = cities.map((city) => {
        let density = Math.floor(city.population / city.area)
        return { ...city, density: density };
    })
    res.send(citiesWithDensity);
}

export const getSortedCities = (req: Request, res: Response, next: NextFunction) => {
    const cities: ICity[] = (req as any).cities;

    const sortProperty: keyof ICity | any = req.params.property
    const sortOrder: string = req.params.order

    try {
        if (!(sortProperty in cities[0])) throw new Error("Invalid sorting parameter. Should be either 'name', 'population' or 'area'.")
        if (sortOrder !== ASCENDING && sortOrder !== DESCENDING) throw new Error(`Invalid sorting order. Should be either '${ASCENDING}' or '${DESCENDING}'.`)
        const sortedCities = sortCities(cities, sortOrder, sortProperty)
        res.send(sortedCities)
    } catch (err) {
        (err as any).type = 'invalid-query'
        next(err)
    }
}

const sortCities = (cities: ICity[], sortOrder: string, sortProperty: keyof ICity): ICity[] => {
    // make a deep copy of cities, so that sorting don't change global cities param
    const result: ICity[] = JSON.parse(JSON.stringify(cities))

    return result.sort((city1, city2) => {
        const city1Value = city1[sortProperty] ?? '';
        const city2Value = city2[sortProperty] ?? '';
        if (sortOrder === ASCENDING) {
            return city1Value < city2Value ? -1 : 1;
        }
        return city1Value < city2Value ? 1 : -1;
    })
}

export const getFilteredCities = (req: Request, res: Response, next: NextFunction) => {
    const cities: ICity[] = (req as any).cities;

    const searchTerm: string = req.params.searchTerm;
    const filteredCities = cities.reduce((accumulator: ICity[], city: ICity) => {
        if (city.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            accumulator.push(city);
        }
        return accumulator;
    }, [])

    res.send(filteredCities);
}

export const addNewCity = async (req: Request, res: Response, next: NextFunction) => {
    const cities: ICity[] = (req as any).cities;
    const { name, area, population } = req.body;
    const requiredParams = [name, area, population]

    try {
        if (requiredParams.includes(undefined)) throw new Error(BAD_POST_REQUEST_ERR_MSG)
        const newCity = { name: name, area: area, population: population };
        cities.push(newCity)
        await fs.writeFile(path.join(__dirname, '..', DATA_FILE), JSON.stringify(cities, null, 1))
        res.send(newCity)
    } catch (err) {
        if ((err as any).message === BAD_POST_REQUEST_ERR_MSG)
            (err as any).type = 'bad-request'
        next(err)
    }
}

export default {
    getCities,
    getCitiesDensity,
    sortCities,
    getFilteredCities,
    addNewCity,
}
