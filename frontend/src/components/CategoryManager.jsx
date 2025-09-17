import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CategoryManager = ({ onCategoryUpdated }) => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [message, setMessage] = useState('');

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/categories', { headers: { 'x-auth-token': token } });
            setCategories(response.data);
        } catch (error) {
            setMessage('Erro ao carregar categorias.');
            console.error('Erro ao carregar categorias:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post('/categories', { name: newCategoryName }, { headers: { 'x-auth-token': token } });
            setNewCategoryName('');
            setMessage('Categoria criada com sucesso!');
            fetchCategories();
            if (onCategoryUpdated) onCategoryUpdated();
        } catch (error) {
            setMessage(error.response.data.error || 'Erro ao criar categoria.');
        }
    };

    const handleEdit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/categories/${id}`, { name: editCategoryName }, { headers: { 'x-auth-token': token } });
            setEditCategoryId(null);
            setEditCategoryName('');
            setMessage('Categoria atualizada com sucesso!');
            fetchCategories();
            if (onCategoryUpdated) onCategoryUpdated();
        } catch (error) {
            setMessage(error.response.data.error || 'Erro ao atualizar categoria.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
            try {
                const token = localStorage.getItem('token');
                await api.delete(`/categories/${id}`, { headers: { 'x-auth-token': token } });
                setMessage('Categoria deletada com sucesso!');
                fetchCategories();
                if (onCategoryUpdated) onCategoryUpdated();
            } catch (error) {
                setMessage(error.response.data.error || 'Erro ao deletar categoria.');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Gerenciar Categorias</h3>
            
            <form onSubmit={handleCreate} className="flex mb-4 gap-2">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nova Categoria"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                    Adicionar
                </button>
            </form>

            {message && (
                <p className={`text-sm mb-4 ${message.includes('Erro') ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                </p>
            )}

            <div className="space-y-3">
                {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        {editCategoryId === category.id ? (
                            <input
                                type="text"
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                                className="flex-1 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <span className="font-medium text-gray-700">{category.name}</span>
                        )}
                        <div className="flex gap-2">
                            {editCategoryId === category.id ? (
                                <>
                                    <button onClick={() => handleEdit(category.id)} className="text-sm text-blue-500 hover:text-blue-700 font-semibold">
                                        Salvar
                                    </button>
                                    <button onClick={() => setEditCategoryId(null)} className="text-sm text-gray-500 hover:text-gray-700">
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => {
                                        setEditCategoryId(category.id);
                                        setEditCategoryName(category.name);
                                    }} className="text-sm text-primary-blue  font-semibold">
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(category.id)} className="text-sm text-red-500 hover:text-red-600 font-semibold">
                                        Deletar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryManager;