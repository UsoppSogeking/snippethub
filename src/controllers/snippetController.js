const { Op } = require('sequelize');
const Snippet = require('../models/Snippet');
const User = require('../models/User');
const Comment = require('../models/Comment');

exports.createSnippet = async (req, res) => {
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

    res.status(201).json(newSnippet);
}

exports.getSnippets = async (req, res) => {
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
        return res.status(404).json({ error: 'Snippets não encontrados' });
    }

    res.status(200).json(snippets);
};

exports.getSnippetById = async (req, res) => {
    const snippetId = req.params.snippetId;

    const snippet = await Snippet.findByPk(snippetId);

    if (!snippet) {
        return res.status(404).json({ error: 'Snippet não encontrado' });
    }

    res.status(200).json(snippet);
};

exports.getUserSnippetsById = async (req, res) => {
    const userId = req.params.userId;

    const snippets = await Snippet.findAll({ where: { user_id: userId } });

    if (snippets.length === 0) {
        return res.status(404).json({ error: 'Nenhum snippet encontrado para este usuário' });
    }

    res.status(200).json(snippets);
}

exports.updateSnippet = async (req, res) => {
    const snippetId = req.params.id;
    const { title, description, code, language } = req.body;
    const snippet = await Snippet.findByPk(snippetId);

    if (!snippet) {
        return res.status(404).json({ error: 'Snippet não encontrado' });
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
}

exports.deleteSnippet = async (req, res) => {
    const snippetId = req.params.id;
    const snippet = await Snippet.findByPk(snippetId);

    if (!snippet) {
        return res.status(404).json({ error: 'Snippet não econtrado' });
    }

    await Comment.destroy({ where: { snippet_id: snippetId } });

    await snippet.destroy();

    res.status(200).json({ message: 'Snippet deletado com sucesso!', snippet });
}
