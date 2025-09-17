const express = require('express');
const router = express.Router();
const { Expense, Category } = require('../models'); 
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { description, amount, date, categoryId } = req.body;
        const userId = req.user;
        const newExpense = await Expense.create({ description, amount, date, userId, categoryId });
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar despesa.', details: error.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user;
        const expenses = await Expense.findAll({ 
            where: { userId },
            include: [{ model: Category, as: 'category' }] 
        });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar despesas.', details: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;
        const [updated] = await Expense.update(req.body, {
            where: { id, userId }
        });
        if (updated) {
            const updatedExpense = await Expense.findOne({ 
                where: { id },
                include: [{ model: Category, as: 'category' }] 
            });
            return res.json(updatedExpense);
        }
        res.status(404).json({ error: 'Despesa não encontrada.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar despesa.', details: error.message });
    }
});
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;
        const deleted = await Expense.destroy({
            where: { id, userId }
        });
        if (deleted) {
            return res.status(204).json({ message: 'Despesa deletada com sucesso.' });
        }
        res.status(404).json({ error: 'Despesa não encontrada.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar despesa.', details: error.message });
    }
});

module.exports = router;