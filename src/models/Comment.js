const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Snippet = require('./Snippet');

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
    },
    profile_picture: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    snippet_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Snippet,
            key: 'id'
        }
    }
});

Comment.belongsTo(User, {
    foreignKey: 'user_id',
});

Comment.belongsTo(Snippet, {
    foreignKey: 'snippet_id'
});

module.exports = Comment;
