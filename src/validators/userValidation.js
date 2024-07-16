//Schema de Validação com Joi
const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm password must match password'
    }),
    profile_picture: Joi.string().optional()
});

module.exports = userSchema;