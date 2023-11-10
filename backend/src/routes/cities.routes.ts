import { Express } from "express";
import {
  addNewCity,
  getCities,
  getFilteredCities,
  getSortedCities,
} from "../controllers/cities.controller";

const routes = (app: Express) => {
  app.get("/", getCities);
  app.post("/", addNewCity);
  app.get("/sort/:property/:order", getSortedCities);
  app.get("/contains/:searchTerm", getFilteredCities);
};

export default routes;