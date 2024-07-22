const Joi = require('joi');

const snippetSchema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
        'string.base': 'O título deve ser uma string',
        'string.empty': 'O título não pode ser vazio',
        'string.min': 'O título deve ter pelo menos 3 caracteres',
        'string.max': 'O título deve ter no máximo 100 caracteres',
        'any.required': 'O título é obrigatório',
    }),
    description: Joi.string().min(3).max(255).optional().messages({
        'string.base': 'A descrição deve ser uma string',
        'string.min': 'A descrição deve ter pelo menos 3 caracteres',
        'string.max': 'A descrição deve ter no máximo 255 caracteres',
    }),
    code: Joi.string().optional().messages({
        'string.base': 'O código deve ser uma string',
    }),
    language: Joi.string().min(2).max(50).required().messages({
        'string.base': 'A linguagem deve ser uma string',
        'string.empty': 'A linguagem não pode ser vazia',
        'string.min': 'A linguagem deve ter pelo menos 2 caracteres',
        'string.max': 'A linguagem deve ter no máximo 50 caracteres',
        'any.required': 'A linguagem é obrigatória',
    }),
    tags: Joi.array().items(Joi.string()).optional().messages({
        'array.base': 'As tags devem ser uma lista de strings',
        'array.includes': 'Cada tag deve ser uma string',
    }),
});

const validateSnippet = (req, res, next) => {
    const { error } = snippetSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateSnippet;
