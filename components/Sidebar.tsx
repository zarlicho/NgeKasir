'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PieChart, ShoppingBasket, Box, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore } from "@/store/useSettingsStore";
import { useEffect, useState } from "react";

const navItems = [
  { name: 'Dashboard', href: '/', icon: PieChart },
  { name: 'Kasir Utama', href: '/cashier', icon: ShoppingBasket },
  { name: 'Kelola Stok', href: '/settings', icon: Box },
];

export function Sidebar() {
  const pathname = usePathname();
  const { storeName } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="hidden md:flex w-20 lg:w-64 bg-white border-r border-slate-200 flex-col justify-between h-full transition-all duration-300 z-20 shrink-0">
      <div>
        {/* Logo */}
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-slate-100">
          <div className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <span className="ml-3 font-bold text-2xl hidden lg:block tracking-tight text-slate-800">
            {mounted ? storeName : "..."}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/cashier' && pathname.startsWith('/cashier')) || (item.href === '/settings' && pathname.startsWith('/settings'));
            // Strict matching for home to prevent it from matching everything
            const isMatch = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "w-full flex items-center p-3 rounded-xl transition-colors duration-200",
                  isMatch
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                )}
              >
                <div className="w-6 flex justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="ml-3 font-medium hidden lg:block">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-slate-100 relative">
        <Link 
          href="/profile"
          className="flex items-center justify-center lg:justify-start p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition"
        >
          <img 
            src="https://ui-avatars.com/api/?name=Admin+Ngekasir&background=e2e8f0&color=334155" 
            alt="User" 
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3 hidden lg:block">
            <p className="text-sm font-semibold text-slate-700">Admin Utama</p>
            <p className="text-xs text-slate-500">Kasir 1</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
