import * as companyRepository from "../repositories/companyRepository";


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


export default async function addCard(companyKey: any){
    const companyData = await validateApiKey(companyKey)
}
