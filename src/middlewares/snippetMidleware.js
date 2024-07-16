const Snippet = require('../models/Snippet');

const snippetMiddleware = async (req, res, next) => {
    const snippetId = req.params.snippet_id;

    if (!snippetId) {
        return res.status(400).json({ error: 'Snippet ID não fornecido' });
    }

    try {
        const snippet = await Snippet.findByPk(snippetId);

        if (!snippet) {
            return res.status(404).json({ error: 'Snippet não encontrado' });
        }

        req.snippet = snippet;
        next();
    } catch (error) {
        console.error('Erro ao encontrar snippet', error);
        res.status(500).json({ error: 'Erro ao encontrar snippet' });
    }
}

module.exports = snippetMiddleware;