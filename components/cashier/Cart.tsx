'use client';

import { useCartStore } from "@/store/useCartStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Minus, Plus, Trash2, Receipt, Wallet } from "lucide-react";
import { CheckoutModal } from "./CheckoutModal";
import { useState } from "react";

export function Cart() {
  const { items, updateQuantity, clearCart, getTotal } = useCartStore();
  const { taxPercentage } = useSettingsStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const subtotal = getTotal();
  const taxAmount = subtotal * (taxPercentage / 100);
  const totalAmount = subtotal + taxAmount;

  return (
    <>
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-800 text-white rounded-t-3xl">
        <h2 className="font-semibold text-lg flex items-center">
          <Receipt className="w-5 h-5 mr-2" /> Pesanan Saat Ini
        </h2>
        <button 
          onClick={clearCart}
          disabled={items.length === 0}
          className="text-slate-300 hover:text-white text-sm bg-slate-700 px-3 py-1 rounded-lg transition flex items-center disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Batal
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 pt-10">
            <Receipt className="w-12 h-12 opacity-20" />
            <p>Keranjang masih kosong</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="font-medium text-sm text-slate-800 truncate">{item.name}</h4>
                <p className="text-blue-600 font-semibold text-sm mt-1">
                  Rp {item.price.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-500 transition"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-medium text-sm text-slate-800">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-500 transition"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-5 bg-slate-50 border-t border-slate-200 rounded-b-3xl">
        <div className="flex justify-between text-slate-500 mb-2 text-sm">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between text-slate-500 mb-4 text-sm">
          <span>Pajak ({taxPercentage}%)</span>
          <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between items-end mb-6">
          <span className="text-slate-600 font-medium">Total</span>
          <span className="text-3xl font-bold text-slate-800">
            Rp {totalAmount.toLocaleString('id-ID')}
          </span>
        </div>

        <button 
          onClick={() => setIsCheckoutOpen(true)}
          disabled={items.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
        >
          <Wallet className="w-5 h-5 mr-2" /> Checkout Sekarang
        </button>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        totalAmount={totalAmount} 
      />
    </>
  );
}
