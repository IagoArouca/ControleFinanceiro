const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Income = sequelize.define('Income', {
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = Income;