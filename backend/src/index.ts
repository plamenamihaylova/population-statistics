import express, { Request, Response } from "express";
import cors from "cors";
import data from "./cities.json";
import bodyParser from "body-parser";

const port = 3000;

const app = express();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}))

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
    return res.send(data)
})

app.get("/cities", (req: Request, res: Response) => {
    const citiesNames = data.map((item) => item.name)
    return res.send(data.map(item => { return {name: item.name}} ))
})

app.listen(port, () => {
    console.log(`Population statistics server started on http://localhost:${port}`);
})