import { NextFunction, Request, Response } from "express"

export const errorLogger = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.log('An error occurred:')
    console.log(error)
    console.log("End of error log.")
    next(error)
}

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error.type) {
        switch (error.type) {
            case 'data retrieval':
                res.status(500).send({error: 'data-retrieval', message: 'An error occurred while retrieving the data.'})

        }
    }
    // console.log(error.message)
    // console.log(error.name)
    // console.log(error['type'])
    else next(error)
}

export const defaultErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('end of the handling')
 }