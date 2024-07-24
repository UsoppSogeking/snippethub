require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const snippetsRoutes = require('./routes/snippetsRoutes');
const commentsRoutes = require('./routes/commentsRoutes');

const app = express();

const uploadDir = path.join(__dirname, 'uploads', 'profile_picture');

const createUploadDirectory = () => {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Upload directory created:', uploadDir);
    }
};

createUploadDirectory();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});