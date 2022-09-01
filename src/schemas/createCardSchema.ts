import joi from "joi";

const createCardSchema = joi.object({
    cardType: joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required()
})

export default createCardSchema;