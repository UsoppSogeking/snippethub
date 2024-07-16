require('dotenv').config();
const express = require('express');
const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const snippetsRoutes = require('./routes/snippetsRoutes');
const commentsRoutes = require('./routes/commentsRoutes');

const app = express();
app.use(express.json());

db.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso');
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });

app.use('/', userRoutes);
app.use('/', snippetsRoutes);
app.use('/', commentsRoutes);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});