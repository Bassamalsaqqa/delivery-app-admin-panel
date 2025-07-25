"use client";

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import dayjs from 'dayjs';

export default function OrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: 'cancelled' } : o)));
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const statusOptions = [
    'pending',
    'preparing',
    'delivering',
    'completed',
    'cancelled',
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">{t('orders')}</h1>
      {loading ? (
        <p>{t('loading')}</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('user') || 'User'}
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('totalRevenue') || 'Total'}
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-2 whitespace-nowrap text-xs">{order._id.slice(-6)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {typeof order.user === 'string' ? order.user : order.user.name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">${order.totalPrice?.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm capitalize">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s} className="text-gray-800 dark:text-gray-900">
                          {t(s as any) || s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {dayjs(order.createdAt).format('YYYY-MM-DD')}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {order.status === 'pending' && (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                        onClick={() => cancelOrder(order._id)}
                      >
                        {t('cancel')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}