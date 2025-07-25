"use client";

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import { Notification } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import dayjs from 'dayjs';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/profile/notifications');
      setNotifications(res.data.notifications || res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.patch(`/profile/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">{t('notifications')}</h1>
      {loading ? (
        <p>{t('loading')}</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : notifications.length === 0 ? (
        <p>{t('noNotifications')}</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 border rounded bg-white dark:bg-gray-800 ${n.isRead ? 'opacity-60' : ''}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{dayjs(n.createdAt).format('YYYY-MM-DD HH:mm')}</p>
                </div>
                {!n.isRead && (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    onClick={() => markRead(n._id)}
                  >
                    {t('markAsRead')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}