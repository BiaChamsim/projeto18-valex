import {Request, Response} from "express";

export function createCard(req: Request, res: Response){
    const companyKey = req.headers["x-api-key"];
    
    res.send("oi").status(200)
}