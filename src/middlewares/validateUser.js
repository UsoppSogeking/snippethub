const userSchema = require('../validators/userValidation');

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((err) => err.message);
        res.status(422).json({ errors });
        return;
    }
    next();
};

module.exports = validateUser;
