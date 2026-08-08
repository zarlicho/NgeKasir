'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PieChart, ShoppingBasket, Box, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/', icon: PieChart },
  { name: 'Kasir', href: '/cashier', icon: ShoppingBasket },
  { name: 'Stok', href: '/settings', icon: Box },
  { name: 'Profil', href: '/profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-[999]">
      <nav className="bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-300/40 px-2 py-2 flex justify-between items-center rounded-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/cashier' && pathname.startsWith('/cashier')) || (item.href === '/settings' && pathname.startsWith('/settings'));
          const isMatch = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-[72px] py-2 rounded-full transition-all duration-300",
                isMatch ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {isMatch && (
                <div className="absolute inset-0 bg-blue-50 rounded-full -z-10" />
              )}
              <item.icon className={cn("w-5 h-5 transition-transform duration-300", isMatch ? "scale-110 mb-1" : "mb-1")} />
              <span className={cn("text-[10px] transition-all duration-300", isMatch ? "font-bold" : "font-medium")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
