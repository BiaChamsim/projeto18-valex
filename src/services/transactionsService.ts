import * as cardrepository from "../repositories/cardRepository";
import * as paymentRepository from "../repositories/paymentRepository"
import * as rechargeRepository from "../repositories/rechargeRepository";
import dayjs from "dayjs";


//Somente cartões cadastrados devem poder ser visualizados
async function checkCard(cardId: number){
    const cardData = await cardrepository.findById(cardId)

    if(!cardData){
        throw{
            code:"not found",
            message: "Card is not registered"
        }
    }
}


/*{
    "balance": 35000,
    "transactions": [
          { "id": 1, "cardId": 1, "businessId": 1, "businessName": "DrivenEats", "timestamp": "22/01/2022", "amount": 5000 }
      ]
    "recharges": [
          { "id": 1, "cardId": 1, "timestamp": "21/01/2022", "amount": 40000 }
      ]
  }*/
function formatTimestamp(transactionsList: any){
    const formatedTransactions = [];

    for(let i=0; i<transactionsList.length; i++){
        const date = dayjs(transactionsList[i].timestamp).format("DD/MM/YYYY")
        formatedTransactions.push({...transactionsList[i], timestamp: date});
    }

    return formatedTransactions;
}



async function formatBalanceTransactions(cardId: number){
    const balance = await cardrepository.getBalance(cardId)
    const transactions = await paymentRepository.findByCardId(cardId)
    const recharges = await rechargeRepository.findByCardId(cardId)

    const formatedTransactions = formatTimestamp(transactions)
    const formatedRecharge = formatTimestamp(recharges)
    
    const format = {
        balance: balance.balance,
        transactions: formatedTransactions,
        recharges: formatedRecharge
    }

    return format
}


export default async function balanceAndTransactions(cardId: number){
    await checkCard(cardId)
    const format = await formatBalanceTransactions(cardId)


    return format
}