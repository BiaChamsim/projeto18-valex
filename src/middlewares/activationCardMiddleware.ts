import { Request, Response, NextFunction } from "express";
import activateCardSchema from "../schemas/activateCardSchema";


export default function activationCardMiddleware(req: Request, res: Response, next: NextFunction){

    const {error} = activateCardSchema.validate(req.body, {abortEarly: false})

    if(error){
        const errors: string[] = error.details.map(err => err.message ) 
        return res.status(422).send(errors)
    }

    next()
}
