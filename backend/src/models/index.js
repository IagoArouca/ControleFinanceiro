const sequelize = require('../database');
const User = require('./User');
const Income = require('./Income');
const Expense = require('./Expense');
const Category = require('./Category'); 


User.hasMany(Income, { foreignKey: 'userId', as: 'incomes' });
Income.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Expense, { foreignKey: 'userId', as: 'expenses' });
Expense.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Category.hasMany(Income, { foreignKey: 'categoryId', as: 'incomes' });
Income.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Category.hasMany(Expense, { foreignKey: 'categoryId', as: 'expenses' });
Expense.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

const syncModels = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados com o banco de dados.');
    } catch (error) {
        console.error('Erro ao sincronizar os modelos:', error);
    }
};

module.exports = {
    sequelize,
    User,
    Income,
    Expense,
    Category,
    syncModels
};