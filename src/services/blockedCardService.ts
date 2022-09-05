import * as cardRepository from "../repositories/cardRepository";
import dayjs from "dayjs"
import bcrypt from "bcrypt";


//Somente cartões cadastrados devem ser bloqueados
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

//Somente cartões não expirados devem ser bloqueados
function expirationCardData(expirationDate: string){
    const currentDate: string = dayjs().locale('pt-br').format('MM/YY');

    if(currentDate > expirationDate){
        throw{
            code: "unauthorized",
            message: "Expired card"
        }
    }    
}

//Somente cartões não bloqueados devem ser bloqueados
function cardStatus(isBlocked: boolean){
    if(isBlocked === true){
        throw{
            code: "conflict",
            message: "This card is already blocked"
        }
    }
}

//A senha do cartão deverá ser recebida e verificada para garantir a segurança da requisição
function checkPassword(dbPassword: string, password: string){

    const isValidPassword = bcrypt.compareSync(password, dbPassword)

    if(isValidPassword !== true){
        throw{
            code: "unauthorized",
            message: "An error occurred"
        }
    }
}

async function updateIsblockedCard(cardId:number){
    await cardRepository.update(cardId,{isBlocked:true})
}


export default async function blockCard(cardId: number, password: string){
    const cardData: any = await validateCard(cardId)
    expirationCardData(cardData.expirationDate)
    cardStatus(cardData.isBlocked)
    checkPassword(cardData.password, password)

    await updateIsblockedCard(cardId)

}