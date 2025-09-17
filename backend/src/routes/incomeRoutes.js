const express = require('express');
const router = express.Router();
const { Income, Category } = require('../models'); 
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { description, amount, date, categoryId } = req.body;
        const userId = req.user;
        const newIncome = await Income.create({ description, amount, date, userId, categoryId });
        res.status(201).json(newIncome);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar receita.', details: error.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user;
        const incomes = await Income.findAll({ 
            where: { userId },
            include: [{ model: Category, as: 'category' }] 
        });
        res.json(incomes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar receitas.', details: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;
        const [updated] = await Income.update(req.body, {
            where: { id, userId }
        });
        if (updated) {
            const updatedIncome = await Income.findOne({ 
                where: { id },
                include: [{ model: Category, as: 'category' }] 
            });
            return res.json(updatedIncome);
        }
        res.status(404).json({ error: 'Receita não encontrada.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar receita.', details: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;
        const deleted = await Income.destroy({
            where: { id, userId }
        });
        if (deleted) {
            return res.status(204).json({ message: 'Receita deletada com sucesso.' });
        }
        res.status(404).json({ error: 'Receita não encontrada.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar receita.', details: error.message });
    }
});


module.exports = router;