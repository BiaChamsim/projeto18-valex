import { Request, Response, NextFunction } from "express";
import paymentSchema from "../schemas/paymentSchema";


export default function paymentMiddleware(req: Request, res: Response, next: NextFunction){

    const {error} = paymentSchema.validate(req.body, {abortEarly: false})

    if(error){
        const errors: string[] = error.details.map(err => err.message ) 
        return res.status(422).send(errors)
    }

    next()
}