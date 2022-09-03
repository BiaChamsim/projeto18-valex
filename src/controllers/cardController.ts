import {Request, Response} from "express";
import addCard from "../services/addCardService";
import activationCard from "../services/activateCardService";


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

export async function activateCard(req: Request, res: Response){
    try{
        const {cvv, password, number, cardholderName, expirationDate} = req.body;

        await activationCard(number, cardholderName, expirationDate, password, cvv)

        res.sendStatus(201)
        

    }catch(error: any){
        if(error.code === "not found"){
            return res.status(404).send(error.message)
        }else if(error.code === "unauthorized"){
            return res.status(401).send(error.message)
        }else if(error.code === "conflict"){
            return res.status(409).send(error.message)
        }

        console.log(error)
        res.sendStatus(500);
    }
}