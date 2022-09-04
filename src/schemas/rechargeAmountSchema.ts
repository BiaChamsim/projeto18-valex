import joi from "joi";

const amountSchema = joi.object(
    {
         cardId: joi.number().required(), 
         amount: joi.number().integer().min(1).required()
    }
)

export default amountSchema;