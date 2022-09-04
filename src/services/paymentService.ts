import * as cardRepository from "../repositories/cardRepository";
import * as businessRepository from "../repositories/businessRepository";
import * as paymentRepository from "../repositories/paymentRepository";
import dayjs from 'dayjs';
import bcrypt from "bcrypt";

//Somente cartões cadastrados devem poder comprar
async function validateCard(cardId: number){
    const isRegistered = await cardRepository.findById(cardId)

    if(!isRegistered){
        throw{
            code: "not found",
            message: "Card does not exist"
        }
    }
    return isRegistered;
}

//Somente cartões não expirados devem poder comprar
function expirationCardData(expirationDate: string){
    const currentDate: string = dayjs().locale('pt-br').format('MM/YY');

    if(currentDate > expirationDate){
        throw{
            code: "unauthorized",
            message: "Expired card"
        }
    }    
}

//Somente cartões não bloqueados devem poder comprar && //Somente cartões ativos devem poder comprar
function cardStatus(isBlocked: boolean){
    if(isBlocked === true){
        throw{
            code: "conflict",
            message: "This card is blocked or inactive"
        }
    }
}

//A senha do cartão deverá ser recebida e verificada para garantir a segurança da requisição
function checkPassword(dbPassword: string, password: string){

    const isValidPassword = bcrypt.compareSync(password, dbPassword)

    if(isValidPassword !== true){
        throw{
            code: "conflict",
            message: "invalid data"
        }
    }
}

//Somente estabelecimentos cadastrados devem poder transacionar
async function checkBusiness(businessId: number){
    const isBusinessRegistered = await businessRepository.findById(businessId)

    if(!isBusinessRegistered){
        throw{
            code: "not found",
            message: "Business is not registered"
        }
    }
    
    return isBusinessRegistered;
}

//Somente estabelecimentos do mesmo tipo do cartão devem poder transacionar com ele
function isSameType(companyData: any, cardData: any){
    if(companyData.type !== cardData.type){
        throw{
            code: "not acceptable",
            message: "The card type does not match"
        }
    }
}

//O cartão deve possuir saldo suficiente para cobrir o montante da compra
async function calcBalance(amount: number, cardId: number){
    const balanceCard = await cardRepository.getBalance(cardId)

    if(balanceCard.balance < amount){
        throw{
            code: "Unprocessable Entity",
            message: "insufficient balance"
        }
    }
}


export default async function paymentService(cardId: number, password: string, businessId: number, amount: number){
    const cardData: any = await validateCard(cardId)
    expirationCardData(cardData.expirationDate)
    cardStatus(cardData.isBlocked)
    checkPassword(cardData.password, password)
    const companyData = await checkBusiness(businessId)
    isSameType(companyData, cardData)
    await calcBalance(amount, cardId)

    await paymentRepository.insert({cardId, businessId, amount})
}