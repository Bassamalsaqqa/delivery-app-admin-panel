"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Home,
  Users,
  ShoppingCart,
  PackageOpen,
  Grid,
  Bell,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const Sidebar = () => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    { href: '/dashboard', label: t('dashboard'), icon: <Home className="w-5 h-5" /> },
    { href: '/users', label: t('users'), icon: <Users className="w-5 h-5" /> },
    { href: '/orders', label: t('orders'), icon: <ShoppingCart className="w-5 h-5" /> },
    { href: '/products', label: t('products'), icon: <PackageOpen className="w-5 h-5" /> },
    { href: '/categories', label: t('categories'), icon: <Grid className="w-5 h-5" /> },
    { href: '/notifications', label: t('notifications'), icon: <Bell className="w-5 h-5" /> },
  ];

  return (
    <aside className="bg-white dark:bg-gray-800 shadow-md h-full flex flex-col p-4 w-64">
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-xl font-bold">Admin</h1>
      </div>
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${isActive ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;