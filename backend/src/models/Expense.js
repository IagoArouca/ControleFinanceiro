const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Expense = sequelize.define('Expense', {
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

module.exports = Expense;