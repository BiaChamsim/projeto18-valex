import * as cardrepository from "../repositories/cardRepository";
import dayjs from 'dayjs';
import Cryptr from "cryptr";
import bcrypt from 'bcrypt';


async function registeredCard(number: string, cardholderName: string, expirationDate: string){
    const isRegistered = await cardrepository.findByCardDetails(number, cardholderName, expirationDate)

    if(!isRegistered){
        throw{
            code: "not found",
            message: "Card does not exist"
        }
    }
    return isRegistered;
}

function expirationCard(expirationDate: string){  
    const currentDate: string = dayjs().locale('pt-br').format('MM/YY');

    if(currentDate > expirationDate){
        throw{
            code: "unauthorized",
            message: "Expired card"
        }
    }    
}

function alreadyActivated(password: any){
    if(password){
        throw{
            code: "conflict",
            message: "Card is already activated"
        }
    }
}

function checkCVV(securityCode: string, cvv: string){

    const cryptr = new Cryptr("myTotallySecretKey")
    const cvvDecrypted = cryptr.decrypt(securityCode)

    if(cvvDecrypted !== cvv){
        throw{
            code: "not found",
            message: "Card does not exist"
        }
    }
}

function encryptPassword(password: string){    
    const encryptedPassword = bcrypt.hashSync(password, 10)

    return encryptedPassword;
}


export default async function activationCard(number: string, cardholderName: string, expirationDate: string, password: string, cvv: string){

    const cardData: any = await registeredCard(number, cardholderName, expirationDate)
    const isExpiredCard = expirationCard(expirationDate)
    const isActivated = alreadyActivated(cardData.password)
    const verifyCVV = checkCVV(cardData.securityCode, cvv)
    const encryptedPassword = encryptPassword(password)

    await cardrepository.update(cardData.id, {...cardData, password: encryptedPassword})
}