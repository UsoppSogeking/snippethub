const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
require('dotenv').config();

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

//Criar um novo usuário
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, profile_picture } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            profile_picture
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro interno ao criar usuário' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Comparar a senha fornecida com a senha hasheada no banco de dados
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Senha válida - prossiga com a autenticação (JWT, sessão, etc.)
        res.status(200).json({ message: 'Login bem-sucedido', token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro interno ao fazer login' });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }// Exclui a senha do resultado
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (user.profile_picture) {
            user.profile_picture = `${baseUrl}/uploads/profile_picture/${user.profile_picture}`;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro interno ao buscar usuário' });
    }
}

exports.getUserByName = async (req, res) => {
    try {
        const username = req.query.username ? `${req.query.username}` : null;

        let whereClause = {};

        if (username) {
            whereClause.username = { [Op.like]: username };
        }

        const users = await User.findAll({ where: whereClause, attributes: {exclude: ['password']} });

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        users.forEach(user => {
            if (user.profile_picture) {
                user.profile_picture = `${baseUrl}/uploads/profile_picture/${user.profile_picture}`;
            }
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários: ', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao buscar usuários' });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao buscar todos os usuários:', error);
        res.status(500).json({ error: 'Erro interno ao buscar usuários' });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (username) {
            user.username = username;
        }

        if (req.file) {
            user.profile_picture = user.profile_picture = `${baseUrl}/uploads/profile_picture/${req.file.filename}`;
        }

        await user.save();

        res.status(200).json({ message: 'Dados do usuario atualizado com sucesso', user });
    } catch (error) {
        console.error('Erro ao atualizar nome do usuário', error);
        res.status(500).json({ error: 'Erro interno ao atualizar nome do usuário' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        await user.destroy();

        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar usuário', error);
        res.status(500).json({ error: 'Erro interno ao deletar usuário' });
    }
}