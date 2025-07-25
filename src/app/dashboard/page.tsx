"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Order, User as IUser, Product as IProduct } from '@/types';
import AdminLayout from '@/components/AdminLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Stats {
  users: number;
  orders: number;
  revenue: number;
  monthlySales: number[];
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users
        const usersRes = await api.get('/admin/users');
        const users: IUser[] = usersRes.data;
        // Fetch orders
        const ordersRes = await api.get('/admin/orders');
        const orders: Order[] = ordersRes.data;
        // Fetch products (for revenue? Not needed) but maybe to show product count later
        const productsRes = await api.get('/products');
        const products: IProduct[] = productsRes.data.products || productsRes.data;

        // Compute stats
        const totalUsers = users.length;
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((acc: number, order: Order) => {
          // Consider only delivered orders for revenue
          if (order.status === 'Delivered' || order.status === 'delivered') {
            return acc + (order.totalPrice || 0);
          }
          return acc;
        }, 0);
        // Monthly sales by month index (0-11)
        const monthlySales = Array(12).fill(0);
        orders.forEach((order) => {
          const date = new Date(order.createdAt);
          const month = date.getMonth();
          monthlySales[month] += order.totalPrice || 0;
        });
        setStats({ users: totalUsers, orders: totalOrders, revenue: totalRevenue, monthlySales });
      } catch (err: any) {
        setError(err.message || 'Error fetching stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <p>{t('loading')}</p>
      </AdminLayout>
    );
  }
  if (error || !stats) {
    return (
      <AdminLayout>
        <p className="text-red-500">{error}</p>
      </AdminLayout>
    );
  }

  const chartData = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: t('totalRevenue'),
        data: stats.monthlySales,
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t('salesChartTitle'),
      },
    },
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('totalUsers')}</p>
          <p className="text-3xl font-bold">{stats.users}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('totalOrders')}</p>
          <p className="text-3xl font-bold">{stats.orders}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('totalRevenue')}</p>
          <p className="text-3xl font-bold">${stats.revenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </AdminLayout>
  );
}