//VALIDATION
const Joi = require('@hapi/joi');

//Register Validation
const registerValidation = async (data) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    try {
        const value = await schema.validateAsync(data, schema);
    }
    catch (err) { }
}

const loginValidation = async (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email({ minDomainSegments: 2 }),
        password: Joi.string().min(6).required(),
    });
    try {
        const value = await schema.validateAsync(data, schema);
    }
    catch (err) { }
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
