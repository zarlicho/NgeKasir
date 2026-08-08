'use client';

import { ProductList } from "@/components/cashier/ProductList";
import { Cart } from "@/components/cashier/Cart";
import { Bell, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

export default function CashierPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items } = useCartStore();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Kasir Utama</h1>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari..." 
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none w-64 text-sm"
            />
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row p-4 md:p-6 gap-6 transition-opacity duration-300 bg-slate-50">
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <ProductList />
        </div>
        
        {/* Desktop Cart */}
        <div className="hidden lg:flex w-96 flex-col min-h-0 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <Cart />
        </div>
      </div>

      {/* Mobile Floating Cart Button */}
      <div className="lg:hidden fixed bottom-24 left-4 right-4 z-40">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="w-full bg-blue-600 text-white rounded-2xl p-4 shadow-xl shadow-blue-200 flex items-center justify-between font-bold"
        >
          <div className="flex items-center">
            <ShoppingBag className="w-6 h-6 mr-3" />
            <span>Lihat Keranjang ({totalItems})</span>
          </div>
          <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
        </button>
      </div>

      {/* Mobile Cart Drawer */}
      {isCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full h-[85vh] rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white shrink-0">
              <h2 className="font-bold text-lg text-slate-800">Keranjang Belanja</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <Cart />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
