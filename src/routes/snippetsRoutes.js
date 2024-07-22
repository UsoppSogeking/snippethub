const express = require('express');
const { createSnippet, getSnippets, updateSnippet, deleteSnippet } = require('../controllers/snippetController');
const authenticateToken = require('../middlewares/authenticateToken');
const validateSnippet = require('../middlewares/validateSnippet');

const router = express.Router();

router.post('/snippets', authenticateToken, validateSnippet, createSnippet);
router.get('/getsnippets', authenticateToken, getSnippets);
router.put('/updatesnippet/:id', authenticateToken, validateSnippet, updateSnippet);
router.delete('/deletesnippet/:id', authenticateToken, deleteSnippet);

module.exports = router;