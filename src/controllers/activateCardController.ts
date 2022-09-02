import {Request, Response} from "express";
import cardPassword from "../services/activateCardService";

export async function activateCard(req: Request, res: Response){
    try{

    }catch(error: any){
        if(error.code === "not found"){
            return res.status(404).send(error.message)
        }
        res.sendStatus(500);
    }
}