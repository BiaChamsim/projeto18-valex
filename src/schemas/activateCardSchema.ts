import joi from "joi";

const passwordRegex = /^[0-9]{4}$/

const activateCardSchema = joi.object({
    cvv: joi.string().required(),
    password: joi.string().regex(passwordRegex).required(),
    number: joi.string().required(),
    cardholderName: joi.string().required(),
    expirationDate: joi.string().required()
})

export default activateCardSchema;