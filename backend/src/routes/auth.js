const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'A senha é obrigatória.' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Usuário com este e-mail já existe.' });
        }
        
        const user = await User.create({ username, email, password });
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário.', details: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!password) {
            return res.status(400).json({ error: 'A senha é obrigatória.' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }
        
        if (!user.password) {
            return res.status(500).json({ error: 'A senha do usuário no banco de dados é inválida. Por favor, registre-se novamente.' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({ token, message: 'Login bem-sucedido!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login.', details: error.message });
    }
});
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user, {
      attributes: ['id', 'username', 'email'] 
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.', details: error.message });
  }
});

module.exports = router;