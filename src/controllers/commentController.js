const Comment = require('../models/Comment');
const User = require('../models/User');

exports.createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;
        const snippetId = req.snippet.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const newComment = await Comment.create({
            content,
            user_id: userId,
            snippet_id: snippetId,
            username: user.username,
            profile_picture: user.profile_picture
        });

        res.status(200).json(newComment);
    } catch (error) {
        console.error('Erro ao criar comentário', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao criar comentário' });
    }
}

exports.getCommentsBySnippetId = async (req, res) => {
    try {
        const snippetId = req.params.snippetId;

        const comments = await Comment.findAll({ where: { snippet_id: snippetId }, order: [['createdAt', 'DESC']] });

        if (!comments) {
            res.status(404).json({ error: 'Nenhum comentário encontrado' });
        }

        res.status(200).json(comments);
    } catch (error) {
        console.error('Erro ao buscar comentários', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao buscar comentários' });
    }
}

exports.updateComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const { content } = req.body;

        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            res.status(404).json({ error: 'Comentário não econtrado' });
        }

        comment.content = content;
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        console.error('Erro ao editar comentário', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao editar o comentário' });
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            res.status(404).json({ error: 'Comentário não encontrado' });
        }

        await comment.destroy();

        res.status(200).json({ message: 'Comentário deletado com sucesso ', comment });
    } catch (error) {
        console.error('Erro ao deletar comentário: ', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ai deletar comentário' });
    }
}