const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await Category.create({ name });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar categoria.', details: error.message });
    }
});
router.get('/', auth, async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categorias.', details: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const [updated] = await Category.update({ name }, {
            where: { id }
        });
        if (updated) {
            const updatedCategory = await Category.findOne({ where: { id } });
            return res.json(updatedCategory);
        }
        res.status(404).json({ error: 'Categoria não encontrada.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar categoria.', details: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Category.destroy({
            where: { id }
        });
        if (deleted) {
            return res.status(204).json({ message: 'Categoria deletada com sucesso.' });
        }
        res.status(404).json({ error: 'Categoria não encontrada.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar categoria.', details: error.message });
    }
});

module.exports = router;