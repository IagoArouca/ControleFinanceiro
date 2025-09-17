const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { syncModels } = require('./src/models/index');
const authRoutes = require('./src/routes/auth');
const incomeRoutes = require('./src/routes/incomeRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes'); 
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/categories', categoryRoutes); 

app.get('/', (req, res) => {
    res.send('Servidor rodando!');
});

syncModels().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}).catch(error => {
    console.error('Não foi possível sincronizar os modelos:', error);
})
