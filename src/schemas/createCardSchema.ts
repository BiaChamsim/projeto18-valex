import joi from "joi";

const createCardSchema = joi.object(
    {
        cardType: joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required(),
        isVirtual: joi.boolean().required()
    }
)

export default createCardSchema;