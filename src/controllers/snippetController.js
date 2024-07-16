const { Op } = require('sequelize');
const Snippet = require('../models/Snippet');
const User = require('../models/User');

exports.createSnippet = async (req, res) => {
    try {
        const { title, description, code, language, tags } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const newSnippet = await Snippet.create({
            title,
            description,
            code,
            language,
            tags,
            user_id: userId,
        });

        res.status(200).json(newSnippet);
    } catch (error) {
        console.error('Erro ao criar o snippet:', error);
        res.status(500).json({ error: 'Erro ao criar o snippet' });
    }
}

exports.getSnippets = async (req, res) => {
    try {
        const title = req.query.title ? `%${req.query.title}%` : null;
        const description = req.query.description ? `%${req.query.description}%` : null;

        let whereClause = {};

        if (title) {
            whereClause.title = { [Op.like]: title };
        }

        if (description) {
            whereClause.description = { [Op.like]: description };
        }

        const snippets = await Snippet.findAll({ where: whereClause });

        if (snippets.length === 0) {
            return res.status(404).json({ error: 'Snippet não encontrado' });
        }

        res.status(200).json(snippets);
    } catch (error) {
        console.error('Erro ao buscar snippet: ', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao buscar snippet' });
    }
};

exports.updateSnippet = async (req, res) => {
    try {
        const snippetId = req.params.id;
        const { title, description, code, language } = req.body;
        const snippet = await Snippet.findByPk(snippetId);

        if (!snippet) {
            res.status(404).json({ error: 'Snippet não encontrado' });
        }

        if (title) {
            snippet.title = title;
        }

        if (description) {
            snippet.description = description;
        }

        if (code) {
            snippet.code = code;
        }

        if (language) {
            snippet.language = language;
        }

        await snippet.save();

        res.status(200).json({ message: 'Snippet atualiado com sucesso!', snippet });
    } catch (error) {
        console.error('Erro ao buscar snippet: ', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao buscar snippet' });
    }
}

exports.deleteSnippet = async (req, res) => {
    try {
        const snippetId = req.params.id;
        const snippet = await Snippet.findByPk(snippetId);

        if (!snippet) {
            res.status(404).json({ error: 'Snippet não econtrado' });
        }

        await snippet.destroy();

        res.status(200).json({ message: 'Snippet deletado com sucesso!', snippet });
    } catch (error) {
        console.error('Erro ao deletar snippet: ', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao deletar snippet' });
    }
}
