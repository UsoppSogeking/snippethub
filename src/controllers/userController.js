const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const baseUrl = 'https://snippethub.onrender.com';

exports.createUser = async (req, res) => {
    const { username, email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (user) {
        res.status(422).json({ error: "Por favor, utilize outro e-mail" });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    if (!newUser) {
        res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] });
        return;
    }

    res.status(201).json({ _id: newUser.id, token });
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(422).json({ error: 'Senha inválida.' });
        return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login bem-sucedido', token });
}

exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
    }

    if (user.profile_picture) {
        if (!user.profile_picture.startsWith('http')) {
            user.profile_picture = `${baseUrl}/uploads/profile_picture/${user.profile_picture}`;
        }
    }

    res.status(200).json(user);
}

exports.getUserByName = async (req, res) => {
    const username = req.query.username ? `${req.query.username}` : null;

    let whereClause = {};

    if (username) {
        whereClause.username = { [Op.like]: username };
    }

    const users = await User.findAll({ where: whereClause, attributes: { exclude: ['password'] } });

    users.forEach(user => {
        if (user.profile_picture) {
            user.profile_picture = `${baseUrl}/uploads/profile_picture/${user.profile_picture}`;
        }
    });

    res.status(200).json(users);
}


exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
    }

    if (username) {
        user.username = username;
    }

    if (req.file) {
        user.profile_picture = `${baseUrl}/uploads/profile_picture/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({ message: 'Dados do usuario atualizado com sucesso' });
}

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
    }

    await user.destroy();

    res.status(200).json({ message: 'Usuário deletado com sucesso' });
}