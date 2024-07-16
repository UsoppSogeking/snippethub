const express = require('express');
const { createSnippet, getSnippets, updateSnippet, deleteSnippet } = require('../controllers/snippetController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/snippets', authenticateToken, createSnippet);
router.get('/getsnippets', authenticateToken, getSnippets);
router.put('/updatesnippet/:id', authenticateToken, updateSnippet);
router.delete('/deletesnippet/:id', authenticateToken, deleteSnippet);

module.exports = router;