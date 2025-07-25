"use client";

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { Category } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

export default function CategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      const cats = res.data.categories || res.data;
      setCategories(cats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/categories', { name });
      setCategories((prev) => [...prev, res.data]);
      setName('');
      setShowAddForm(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add category');
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat._id);
    setEditName(cat.name);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      const res = await api.put(`/categories/${editingId}`, { name: editName });
      setCategories((prev) => prev.map((c) => (c._id === editingId ? res.data : c)));
      setEditingId(null);
      setEditName('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update category');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">{t('categories')}</h1>
      {loading ? (
        <p>{t('loading')}</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <button
            className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {t('add')} {t('category') || 'Category'}
          </button>
          {showAddForm && (
            <form onSubmit={addCategory} className="mb-4 p-4 bg-white dark:bg-gray-800 rounded shadow">
              <div className="mb-2">
                <label className="block mb-1 text-sm">{t('name')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                {t('save')}
              </button>
            </form>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('name')}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {editingId === cat._id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                        />
                      ) : (
                        cat.name
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {editingId === cat._id ? (
                        <button
                          onClick={submitEdit}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 text-xs"
                        >
                          {t('save')}
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(cat)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 text-xs"
                        >
                          {t('edit')}
                        </button>
                      )}
                      <button
                        onClick={() => deleteCategory(cat._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        {t('delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
}