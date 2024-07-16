const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres', //tipo de banco de dados
    logging: false,
});

// Sincroniza os modelos com o banco de dados
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Todos os modelos foram sincronizados com o banco de dados.');
    })
    .catch(err => {
        console.error('Erro ao sincronizar modelos:', err);
    });

module.exports = sequelize;
