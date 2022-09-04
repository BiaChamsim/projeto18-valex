import { Request, Response, NextFunction } from "express";
import amountSchema from "../schemas/rechargeAmountSchema";

export default function cardAmountMiddleware(req: Request, res: Response, next: NextFunction){
    const amount = req.body;

    const{error} = amountSchema.validate(amount, {abortEarly: false})

    if(error){
        const errors: string[] = error.details.map(err => err.message ) 
        return res.status(422).send(errors)
    }

    next()
}