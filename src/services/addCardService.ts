import * as companyRepository from "../repositories/companyRepository";
import * as employeesRepository from "../repositories/employeeRepository";
import * as cardrepository from "../repositories/cardRepository";
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from "cryptr";
import dotenv from "dotenv";

dotenv.config()


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

async function validateEmployee(id: number){
    const employeeData = await employeesRepository.findById(id)
    if(!employeeData){
        throw{
            code: "not found",
            message: "this employee does not exist"
        }
    }
    return employeeData
}

async function validateDuplicityCard(type:any, employeeId:number){
    const duplicityExists = await cardrepository.findByTypeAndEmployeeId(type, employeeId)
    if(duplicityExists){
        throw{
            code: "conflict",
            message: "Type already exists"
        }
    }
    return duplicityExists
}

function cardName(name: string){
    const arrName = name.split(" ")
    const firstName = arrName[0]
    const lastName = arrName[arrName.length-1]
    const arrMiddleName = []

    for(let i=1; i<arrName.length-2; i++){       

        if(arrName[i].length > 2){
            arrMiddleName.push(arrName[i][0])
        }
    }

    const middleName = arrMiddleName.join(" ")

    const arrFullName = []

    arrFullName.push(firstName, middleName, lastName)
    const fullName = arrFullName.join(" ")

    return fullName;
}

function createCardNumber(){
     const randomCardNumber = faker.finance.creditCardNumber('VISA');

     return randomCardNumber;
}

function createExpirationDate(){
    const expirationDate = dayjs().locale('pt-br').add(5,'years').format('MM/YY');

    return expirationDate;
}

function securityCode(){

    const randomCVV = faker.finance.creditCardCVV();
    const CRYPTRKEY: string = process.env.CRYPTRKEY || "";

    const cryptr = new Cryptr(CRYPTRKEY);
    const encryptedString = cryptr.encrypt(randomCVV);

    return encryptedString;
}

function formatCardData(employeeId: number, cardNumber: string, memberName: string, cvv: string, expiration: any, isVirtual: boolean, type: any){
    const cardData = {
        employeeId: employeeId,
        number: cardNumber,
        cardholderName: memberName,
        securityCode: cvv,
        expirationDate: expiration,
        isVirtual,
        isBlocked: true,
        type
    } 
    return cardData;   
}


export default async function addCard(companyKey: any, employeeId:number, isVirtual: boolean, type:any){
    const companyData = await validateApiKey(companyKey)
    const employeeData = await validateEmployee(employeeId)
    const duplicityExists = await validateDuplicityCard(type, employeeId)
    const cardNumber = createCardNumber()
    const memberName = cardName(employeeData.fullName)
    const cvv = securityCode()
    const expiration = createExpirationDate()
    const cardIfos = formatCardData(employeeId, cardNumber, memberName, cvv, expiration, isVirtual, type)


    await cardrepository.insert(cardIfos)
}
