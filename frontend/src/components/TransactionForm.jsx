import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TransactionForm = ({ transactionToEdit, categories, onTransactionSubmitted }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('income');

  useEffect(() => {
    if (transactionToEdit) {
      setDescription(transactionToEdit.description);
      setAmount(transactionToEdit.amount);
      setDate(transactionToEdit.date.split('T')[0]);
      setCategory(transactionToEdit.category?.id || '');
      setType(transactionToEdit.type);
    }
  }, [transactionToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transactionData = {
      description,
      amount: parseFloat(amount),
      date,
      categoryId: category,
    };
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };

      if (transactionToEdit) {
        await api.put(`/${type}s/${transactionToEdit.id}`, transactionData, config);
      } else {
        await api.post(`/${type}s`, transactionData, config);
      }
      if (onTransactionSubmitted) {
        onTransactionSubmitted();
      }
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex bg-gray-100 rounded-full p-1">
        <button
          type="button"
          onClick={() => setType('income')}
          className={`flex-1 py-2 px-4 font-semibold text-center rounded-full transition-all duration-300 ${
            type === 'income' ? 'bg-success-green text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          Receita
        </button>
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`flex-1 py-2 px-4 font-semibold text-center rounded-full transition-all duration-300 ${
            type === 'expense' ? 'bg-danger-red text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          Despesa
        </button>
      </div>

      <input
        type="text"
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gray-500 outline-none transition-colors"
        required
      />
      <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gray-500 outline-none transition-colors"
        required
      />
      <input
        type="date"
        placeholder="Data"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gray-500 outline-none transition-colors"
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gray-500 outline-none transition-colors"
        required
      >
        <option value="" disabled>Selecione uma Categoria</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button 
        type="submit"
        className="w-full bg-primary-blue text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity"
      >
        {transactionToEdit ? 'Atualizar Transação' : 'Adicionar Transação'}
      </button>
    </form>
  );
};

export default TransactionForm;