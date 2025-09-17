import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Line } from 'react-chartjs-2';
import CategoryManager from '../components/CategoryManager';
import TransactionForm from '../components/TransactionForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPage = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [balance, setBalance] = useState(0);
  const [forecastData, setForecastData] = useState([]);
  const [message, setMessage] = useState('');
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }
      const config = { headers: { 'x-auth-token': token } };

      const incomeResponse = await api.get('/incomes', config);
      setIncomes(incomeResponse.data);

      const expenseResponse = await api.get('/expenses', config);
      setExpenses(expenseResponse.data);

      const categoryResponse = await api.get('/categories', config);
      setCategories(categoryResponse.data);

      const balanceResponse = await api.get('/reports/balance', config);
      setBalance(balanceResponse.data.balance);

      const forecastResponse = await api.get('/reports/forecast', config);
      setForecastData(forecastResponse.data);

      setTransactionToEdit(null);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      if (error.response && error.response.status === 401) {
        logout();
        navigate('/login');
      } else {
        setMessage('Erro ao carregar dados.');
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (type, id) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/${type}s/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setMessage('Transação deletada com sucesso!');
      fetchTransactions();
    } catch (error) {
      setMessage('Erro ao deletar transação.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const chartData = {
    labels: forecastData.map(data => data.month),
    datasets: [
      {
        label: 'Previsão de Saldo',
        data: forecastData.map(data => data.balance.toFixed(2)),
        borderColor: '#00ADB5',
        backgroundColor: 'rgba(0, 173, 181, 0.5)',
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#393E46'
        }
      },
      title: {
        display: true,
        text: 'Previsão de Saldo para os Próximos 6 Meses',
        color: '#2E4057',
        font: { size: 18 }
      },
      tooltip: {
        backgroundColor: 'rgba(46, 64, 87, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(238, 238, 238, 0.5)' },
        ticks: { color: '#393E46' }
      },
      y: {
        grid: { color: 'rgba(238, 238, 238, 0.5)' },
        ticks: { color: '#393E46' }
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-primary-blue">Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Sair
          </button>
        </div>
        <p className="text-gray-500 -mt-4">Visão geral das suas finanças.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-bold text-dark-grey mb-2">Saldo Atual:</h3>
            <span className={`text-5xl font-extrabold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {balance.toFixed(2)}
            </span>
          </div>
          <div className="lg:col-span-2">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-2xl font-bold mb-4">Adicionar Transação</h3>
          <TransactionForm categories={categories} onTransactionSubmitted={fetchTransactions} transactionToEdit={transactionToEdit} />
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Histórico de Transações</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incomes.map((inc) => (
                  <tr key={inc.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{inc.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-500 font-semibold">R$ {inc.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{inc.category?.name || 'Sem Categoria'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">Receita</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(inc.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => setTransactionToEdit({ ...inc, type: 'income' })} className="text-blue-600 hover:text-blue-900 mr-2">
                        Editar
                      </button>
                      <button onClick={() => handleDelete('income', inc.id)} className="text-red-600 hover:text-red-900">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{exp.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-500 font-semibold">R$ {exp.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{exp.category?.name || 'Sem Categoria'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">Despesa</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => setTransactionToEdit({ ...exp, type: 'expense' })} className="text-primary-blue  mr-2 font-semibold text-sm">
                        Editar
                      </button>
                      <button onClick={() => handleDelete('expense', exp.id)} className="text-red-600  font-semibold text-sm">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <CategoryManager onCategoryUpdated={fetchTransactions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;