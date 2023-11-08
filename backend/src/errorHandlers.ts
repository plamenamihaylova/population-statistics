import { NextFunction, Request, Response } from "express"

export const errorLogger = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.log('AN ERROR HAS OCCURRED:');
    console.log(error);
    console.log("------------END OF ERROR LOG------------");
    next(error)
}

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error.type) {
        switch (error.type) {
            case 'data-retrieval':
                res.status(500).send({ error: error.name, type: error.type, message: 'An error occurred while retrieving the data.' })
            case 'invalid-query':
                res.status(400).send({ error: error.name, type: error.type, message: error.message })
            case 'bad-request':
                res.status(400).send({ error: error.name, type: error.type, message: error.message })
            default:
                res.send({ error: error.name, type: error.type, message: error.message })
        }
    }
    else next(error)
}

export function undefinedRoutesHandler(req: Request, res: Response, next: NextFunction) {
    const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`);
    res.status(404);
    next(error);
}

export function defaultErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    const statusCode: number = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).send({
        error: error.name,
        message: error.message,
    });
}