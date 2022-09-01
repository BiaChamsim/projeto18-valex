import {Request, Response} from "express";
import addCard from "../services/addCardService";

export async function createCard(req: Request, res: Response){
    try{
        const companyKey = req.headers["x-api-key"];
        await addCard(companyKey)
        
        res.sendStatus(200);

    }catch(error: any){
        if(error.code === "not found"){
            return res.status(404).send(error.message)
        }
        res.sendStatus(500);
    }
};