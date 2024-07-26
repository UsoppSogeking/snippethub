const Comment = require('../models/Comment');
const User = require('../models/User');

exports.createComment = async (req, res) => {
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
}

exports.getCommentsBySnippetId = async (req, res) => {
    const snippetId = req.params.snippetId;

    const comments = await Comment.findAll({ where: { snippet_id: snippetId }, order: [['createdAt', 'DESC']] });

    if (!comments) {
        res.status(404).json({ error: 'Nenhum comentário encontrado' });
    }

    res.status(200).json(comments);
}

exports.updateComment = async (req, res) => {
    const commentId = req.params.id;
    const { content } = req.body;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
        res.status(404).json({ error: 'Comentário não econtrado' });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json(comment);
}

exports.deleteComment = async (req, res) => {
    const commentId = req.params.id;
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
        res.status(404).json({ error: 'Comentário não encontrado' });
    }

    await comment.destroy();

    res.status(200).json({ message: 'Comentário deletado com sucesso ', comment });
}