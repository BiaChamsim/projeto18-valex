import {Request, Response} from "express";
import addCard from "../services/addCardService";


export async function createCard(req: Request, res: Response){
    try{
        const companyKey = req.headers["x-api-key"];
        const employeeId = Number(req.params.id);
        const {cardType, isVirtual} = req.body;


        await addCard(companyKey, employeeId, isVirtual, cardType)
        
        res.sendStatus(201);

    }catch(error: any){
        if(error.code === "not found"){
            return res.status(404).send(error.message)
        }else if(error.code === "conflict"){
            return res.status(409).send(error.message)
        }
        
        res.sendStatus(500);
    }
};