import { Express } from "express";
import { addNewCity, getCities, getCitiesDensity, getFilteredCities, getSortedCities } from "./controllers/cities.controller";

const routes = (app: Express) => {
    app.get("/", getCities);
    app.get('/density', getCitiesDensity);
    app.get('/sort/:property/:order', getSortedCities);
    app.get("/filter/:searchTerm", getFilteredCities);
    app.post("/add", addNewCity);
}

export default routes;