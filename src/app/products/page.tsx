"use client";

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { Product, Category } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
}

export default function ProductsPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<ProductForm>({ name: '', description: '', price: '', category: '' });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ProductForm>({ name: '', description: '', price: '', category: '' });

  const fetchData = async () => {
    try {
      const productsRes = await api.get('/products');
      const prods = productsRes.data.products || productsRes.data;
      setProducts(prods);
      const categoriesRes = await api.get('/categories');
      const cats = categoriesRes.data.categories || categoriesRes.data;
      setCategories(cats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
      };
      const res = await api.post('/products', payload);
      setProducts((prev) => [...prev, res.data]);
      setShowAddForm(false);
      setNewProduct({ name: '', description: '', price: '', category: '' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  const startEdit = (product: Product) => {
    setEditingProductId(product._id);
    setEditForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      category: typeof product.category === 'string' ? product.category : product.category._id,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId) return;
    try {
      const payload = {
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
        category: editForm.category,
      };
      const res = await api.put(`/products/${editingProductId}`, payload);
      setProducts((prev) => prev.map((p) => (p._id === editingProductId ? res.data : p)));
      setEditingProductId(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update product');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">{t('products')}</h1>
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
            {t('add')} {t('product') || 'Product'}
          </button>
          {showAddForm && (
            <form onSubmit={handleAdd} className="mb-4 p-4 bg-white dark:bg-gray-800 rounded shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm">{t('name')}</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">{t('description')}</label>
                  <input
                    type="text"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">{t('price')}</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">{t('category')}</label>
                  <select
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <option value="" disabled>
                      {t('select') || 'Select'}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id} className="text-gray-800 dark:text-gray-900">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                  {t('save')}
                </button>
              </div>
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
                    {t('price')}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('category')}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {editingProductId === product._id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-full px-2 py-1 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                        />
                      ) : (
                        product.name
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {editingProductId === product._id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.price}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                          className="w-full px-2 py-1 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                        />
                      ) : (
                        `$${product.price.toFixed(2)}`
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {editingProductId === product._id ? (
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                          className="w-full px-2 py-1 border rounded bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                        >
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id} className="text-gray-800 dark:text-gray-900">
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        typeof product.category === 'string'
                          ? product.category
                          : (product.category as Category).name
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {editingProductId === product._id ? (
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 text-xs"
                          onClick={handleEditSubmit}
                        >
                          {t('save')}
                        </button>
                      ) : (
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 text-xs"
                          onClick={() => startEdit(product)}
                        >
                          {t('edit')}
                        </button>
                      )}
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                        onClick={() => deleteProduct(product._id)}
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