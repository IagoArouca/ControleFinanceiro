const express = require('express');
const router = express.Router();
const { Income, Expense } = require('../models');
const auth = require('../middleware/auth');
const moment = require('moment');

router.get('/balance', auth, async (req, res) => {
    try {
        const userId = req.user;
        const totalIncomes = await Income.sum('amount', { where: { userId } });
        const totalExpenses = await Expense.sum('amount', { where: { userId } });
        const balance = (totalIncomes || 0) - (totalExpenses || 0);
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao calcular o saldo.', details: error.message });
    }
});

router.get('/forecast', auth, async (req, res) => {
    try {
        const userId = req.user;
        const incomes = await Income.findAll({ where: { userId } });
        const expenses = await Expense.findAll({ where: { userId } });

        const now = moment();
        const allTransactionDates = incomes.map(i => moment(i.date)).concat(expenses.map(e => moment(e.date)));
        
        const firstTransactionDate = allTransactionDates.length > 0
            ? moment.min(allTransactionDates)
            : now; 
            
        const monthsSinceStart = now.diff(firstTransactionDate, 'months') + 1;
        
        const totalIncomeSum = incomes.reduce((sum, i) => sum + i.amount, 0);
        const totalExpenseSum = expenses.reduce((sum, e) => sum + e.amount, 0);

        const avgMonthlyIncome = totalIncomeSum / monthsSinceStart;
        const avgMonthlyExpense = totalExpenseSum / monthsSinceStart;

        const currentBalance = (await Income.sum('amount', { where: { userId } }) || 0) -
                             (await Expense.sum('amount', { where: { userId } }) || 0);
        
        const forecastData = [];
        let projectedBalance = currentBalance;
        for (let i = 0; i < 6; i++) {
            const month = moment().add(i, 'months').format('MMM YYYY');
            projectedBalance += avgMonthlyIncome - avgMonthlyExpense;
            forecastData.push({ month, balance: projectedBalance });
        }

        res.json(forecastData);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar previsão.', details: error.message });
    }
});

module.exports = router;