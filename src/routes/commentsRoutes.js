const express = require('express');
const { createComment, deleteComment, getCommentsBySnippetId, updateComment } = require('../controllers/commentController');
const authenticateToken = require('../middlewares/authenticateToken');
const snippetMiddleware = require('../middlewares/snippetMidleware');

const router = express.Router();

router.post('/snippets/:snippet_id/comments', authenticateToken, snippetMiddleware, createComment);
router.get('/snippet/:snippetId/comments', authenticateToken, getCommentsBySnippetId);
router.put('/comment/:id', authenticateToken, updateComment);
router.delete('/comment/:id', authenticateToken, deleteComment);

module.exports = router;