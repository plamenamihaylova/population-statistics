import { Request, Response } from "express";
import ICity from "../models";
import fs from "fs/promises";
import path from "path";
import {
    ADD_NEW_CITY_ERR_MSG,
    ASCENDING,
    BAD_POST_REQUEST_ERR_MSG,
    BAD_REQUEST,
    DATA_FILE,
    DESCENDING,
    INVALID_SORT_ORDER_ERR_MSG,
    INVALID_SORT_PROPERTY_ERR_MSG,
} from "../constants";
import log from "../utils/logger";

export const getCities = (req: Request, res: Response) => {
    const cities: ICity[] = (req as any).cities;
    res.send(cities);
};

export const getSortedCities = (req: Request, res: Response) => {
    const cities: ICity[] = (req as any).cities;

    const sortProperty: keyof ICity | any = req.params.property;
    const sortOrder: string = req.params.order;

    try {
        if (!(sortProperty in cities[0])) {
            throw new Error(INVALID_SORT_PROPERTY_ERR_MSG);
        }
        if (sortOrder !== ASCENDING && sortOrder !== DESCENDING) {
            throw new Error(INVALID_SORT_ORDER_ERR_MSG);
        }
        const sortedCities = sortCities(cities, sortOrder, sortProperty);
        res.send(sortedCities);
    } catch (err: any) {
        res.status(400).send({ error: BAD_REQUEST, message: err.message });
        log.error(err.message);
    }
};

const sortCities = (
    cities: ICity[],
    sortOrder: string,
    sortProperty: keyof ICity
): ICity[] => {
    // make a deep copy of cities, so that sorting don't change global cities param
    const result: ICity[] = JSON.parse(JSON.stringify(cities));

    return result.sort((city1, city2) => {
        const city1Value = city1[sortProperty] ?? "";
        const city2Value = city2[sortProperty] ?? "";
        if (sortOrder === ASCENDING) {
            return city1Value < city2Value ? -1 : 1;
        }
        return city1Value < city2Value ? 1 : -1;
    });
};

export const getFilteredCities = (req: Request, res: Response) => {
    const cities: ICity[] = (req as any).cities;

    const searchTerm: string = req.params.searchTerm;
    const filteredCities = cities.reduce((accumulator: ICity[], city: ICity) => {
        if (city.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            accumulator.push(city);
        }
        return accumulator;
    }, []);

    res.send(filteredCities);
};

export const addNewCity = async (req: Request, res: Response) => {
    const cities: ICity[] = (req as any).cities;
    const { name, area, population } = req.body;
    const requiredParams = [name, area, population];

    try {
        if (requiredParams.includes(undefined))
            throw new Error(BAD_POST_REQUEST_ERR_MSG);
        const density = Math.floor(population / area);
        const newCity = { name: name, area: area, population: population, density: density };
        cities.push(newCity);
        await fs.writeFile(path.join(__dirname, "..", DATA_FILE), JSON.stringify(cities, null, 1));
        res.send(newCity);
    } catch (err: any) {
        if (err.message === BAD_POST_REQUEST_ERR_MSG) {
            res.status(400).send({ error: BAD_REQUEST, message: err.message });
            log.error(err.message);
        } else {
            res.status(500).send({ error: err.name, message: ADD_NEW_CITY_ERR_MSG });
            log.error(ADD_NEW_CITY_ERR_MSG);
        }
    }
};

export default {
    getCities,
    sortCities,
    getFilteredCities,
    addNewCity,
};
