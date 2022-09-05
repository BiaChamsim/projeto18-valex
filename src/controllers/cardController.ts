import {Request, Response} from "express";
import addCard from "../services/addCardService";
import activationCard from "../services/activateCardService";
import rechargeCardService from "../services/rechargeCardService";
import paymentService from "../services/paymentService";
import balanceAndTransactions from "../services/transactionsService";
import blockCard from "../services/blockedCardService";
import unblockCard from "../services/unblockCardService";


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

export async function cardTransactions(req: Request, res: Response){
    try{
        const cardId = Number(req.params.id);

        const formatedBalanceTransactions = await balanceAndTransactions(cardId)

        res.status(200).send(formatedBalanceTransactions)

    }catch(error: any){
        if(error.code === "not found"){
            return res.status(404).send(error.message)
        }

        console.log(error)
        res.sendStatus(500);
    }
}

export async function block(req: Request, res: Response){
    try{
        const cardId = Number(req.params.id)
        const {password} = req.body

        await blockCard(cardId, password)

        res.sendStatus(201);

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

export async function unblock(req: Request, res: Response){
    try{
        const cardId = Number(req.params.id)
        const {password} = req.body

        await unblockCard(cardId, password)

        res.sendStatus(201);

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

export async function rechargeCard(req: Request, res: Response){
    try{
        const companyKey = req.headers["x-api-key"];
        const {cardId, amount} = req.body;

        await rechargeCardService(companyKey, cardId, amount)

        res.sendStatus(201);

    }catch(error: any){
        if(error.code === "not found"){
            return res.status(404).send(error.message)
        }else if(error.code === "conflict"){
            return res.status(409).send(error.message)
        }
    }
}

export async function payment(req: Request, res: Response){
    try{
        const {cardId, password, businessId, amount} = req.body;

        await paymentService(cardId, password, businessId, amount)

        res.sendStatus(201);

    }catch(error: any){
        if(error.code === "not found"){
            return res.status(404).send(error.message)
        }else if(error.code === "conflict"){
            return res.status(409).send(error.message)
        }else if(error.code === "not acceptable"){
            return res.status(406).send(error.message)
        }else if(error.code === "Unprocessable Entity"){
            return res.status(422).send(error.message)
        }
    }
}

