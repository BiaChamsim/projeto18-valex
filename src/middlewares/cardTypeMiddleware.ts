import createCardSchema from "../schemas/createCardSchema";
import { Request, Response, NextFunction } from "express";

export default function cardTypeMiddleware(req: Request, res: Response, next: NextFunction){
    const cardType = req.body;


    const {error} = createCardSchema.validate(cardType, {abortEarly: false})

    if(error){
        const errors: string[] = error.details.map(err => err.message ) 
        return res.status(422).send(errors)
    }

    next()
}