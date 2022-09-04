import * as companyRepository from "../repositories/companyRepository";
import * as cardRepository from "../repositories/cardRepository";
import * as rechargeRepository from "../repositories/rechargeRepository";
import dayjs from 'dayjs';

async function validateApiKey(companyKey: any){
    const companyData = await companyRepository.findByApiKey(companyKey)
    if(!companyData){
        throw {
            code: "not found",
            message: "there isn't any company whith this APIkey"
        }
    }
    return companyData
}

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

function cardStatus(isBlocked: boolean){
    if(isBlocked === true){
        throw{
            code: "conflict",
            message: "This card is blocked"
        }
    }
}

function expirationCardData(expirationDate: string){
    const currentDate: string = dayjs().locale('pt-br').format('MM/YY');

    if(currentDate > expirationDate){
        throw{
            code: "unauthorized",
            message: "Expired card"
        }
    }    
}

function formatAmountData(cardId: number, amount: number){
    const rechargeData = {
        cardId, 
        amount 
    }
    return rechargeData
}


export default async function rechargeCardService(companyKey: any, cardId: number, amount: number){
    const isApiKeyValid = await validateApiKey(companyKey)
    const cardData = await validateCard(cardId)
    const amountData = formatAmountData(cardId, amount)
    const isActivated = cardStatus(cardData.isBlocked)
    const isExpiredCard = expirationCardData(cardData.expirationDate)

    await rechargeRepository.insert(amountData)

}