const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Comment = require('./Comment');

const Snippet = sequelize.define('Snippet', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    code: {
        type: DataTypes.TEXT,
    },
    language: {
        type: DataTypes.STRING,
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
});

Snippet.belongsTo(User, {
    foreignKey: 'user_id',
});

Snippet.hasMany(Comment, { foreignKey: 'snippet_id', onDelete: 'CASCADE' });

module.exports = Snippet;
