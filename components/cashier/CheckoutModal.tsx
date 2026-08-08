'use client';

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCartStore } from "@/store/useCartStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useProductStore } from "@/store/useProductStore";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle, X, AlertCircle, Loader2 } from "lucide-react";
import { convertQRIS } from "@/lib/qris-lib";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

export function CheckoutModal({ isOpen, onClose, totalAmount }: CheckoutModalProps) {
  const { items, clearCart, getTotal } = useCartStore();
  const { baseQris, taxPercentage } = useSettingsStore();
  const { fetchProducts } = useProductStore();
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'cash'>('qris');
  const [cashReceived, setCashReceived] = useState<string>("");
  const [dynamicQRIS, setDynamicQRIS] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const invNumber = Math.floor(100000 + Math.random() * 900000);
  const date = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

  const subtotal = getTotal();
  const taxAmount = subtotal * (taxPercentage / 100);

  useEffect(() => {
    if (isOpen && totalAmount > 0 && paymentMethod === 'qris') {
      if (!baseQris) {
        setIsGenerating(false);
        return;
      }

      setIsGenerating(true);
      const timer = setTimeout(() => {
        try {
          const generated = convertQRIS(baseQris, { amount: Math.round(totalAmount) });
          setDynamicQRIS(generated);
        } catch (error) {
          console.error("Failed to generate Dynamic QRIS", error);
        } finally {
          setIsGenerating(false);
        }
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setDynamicQRIS("");
      setIsSuccess(false);
    }
  }, [isOpen, totalAmount, baseQris, paymentMethod]);

  const handleSuccess = async () => {
    setIsProcessing(true);
    try {
      // Save transaction to database
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalAmount,
          paymentMethod: paymentMethod === 'cash' ? 'Tunai' : 'QRIS',
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            priceAtTime: item.price,
          })),
        }),
      });

      if (!res.ok) throw new Error('Transaction failed');

      setIsSuccess(true);
      // Refresh product list so stock updates are reflected
      fetchProducts();

      setTimeout(() => {
        clearCart();
        onClose();
        setIsSuccess(false);
        setCashReceived("");
        setPaymentMethod("qris");
      }, 2000);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Gagal menyimpan transaksi. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  const numCashReceived = parseInt(cashReceived || "0");
  const changeAmount = numCashReceived - totalAmount;
  const isCashValid = paymentMethod === 'cash' && numCashReceived >= totalAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="!top-auto !bottom-0 !translate-y-0 !translate-x-0 !left-0 w-full !max-w-full md:!top-1/2 md:!left-1/2 md:!-translate-x-1/2 md:!-translate-y-1/2 md:!max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-2xl rounded-none md:rounded-3xl" 
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Selesaikan pembayaran</DialogDescription>
        </VisuallyHidden>

        <div className="bg-white rounded-t-3xl md:rounded-3xl w-full flex flex-col md:flex-row relative max-h-[90vh] md:max-h-[85vh] overflow-y-auto md:overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left: Invoice Details */}
          <div className="w-full md:w-1/2 p-6 md:p-8 bg-slate-50 md:border-r border-slate-100 md:overflow-y-auto shrink-0 md:shrink">
            <div className="text-center mb-6 pb-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Ngekasir Pusat</h2>
              <p className="text-slate-500 text-sm">Jl. Raya Pajajaran No. 12, Bogor</p>
              <div className="mt-4 inline-block bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-400 font-mono">Invoice #INV-{invNumber}</p>
                <p className="text-xs text-slate-400 font-mono">{date}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{item.name}</p>
                    <p className="text-slate-500 text-xs">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="font-medium text-slate-800">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2">
              <div className="flex justify-between text-slate-500 text-sm">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-sm">
                <span>Pajak ({taxPercentage}%)</span>
                <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200 border-dashed">
                <span className="text-slate-800 font-bold">Total Pembayaran</span>
                <span className="text-2xl font-bold text-blue-600">Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Right: Payment & QRIS Converter */}
          <div className="w-full md:w-1/2 p-6 pb-[100px] md:p-8 flex flex-col bg-white md:overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Metode Pembayaran</h3>
            <p className="text-slate-500 text-sm mb-6">Pilih metode untuk menyelesaikan transaksi.</p>

            <div className="flex p-1 bg-slate-100 rounded-xl mb-6 shrink-0">
              <button 
                onClick={() => setPaymentMethod('qris')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${paymentMethod === 'qris' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                QRIS
              </button>
              <button 
                onClick={() => setPaymentMethod('cash')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${paymentMethod === 'cash' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Tunai
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/50 p-6 relative min-h-[300px]">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center space-y-4 absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl z-10 animate-in fade-in zoom-in duration-300">
                  <CheckCircle className="w-20 h-20 text-green-500" />
                  <p className="text-lg font-bold text-slate-800">Pembayaran Berhasil!</p>
                </div>
              ) : paymentMethod === 'qris' ? (
                // QRIS PAYMENT UI
                <>
                  {!baseQris ? (
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                      <AlertCircle className="w-12 h-12 text-orange-500" />
                      <p className="text-sm font-medium text-slate-700">
                        QRIS Statis belum diatur.
                      </p>
                      <p className="text-xs text-slate-500">
                        Silakan atur QRIS Statis di menu Pengaturan (Kelola Stok) terlebih dahulu.
                      </p>
                    </div>
                  ) : isGenerating ? (
                    <div className="flex flex-col items-center justify-center space-y-4 absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl z-10">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-sm font-medium text-slate-600 text-center">
                        Membuat QRIS Dinamis...<br />
                        <span className="text-xs text-slate-400 font-normal">Menginjeksi nominal Rp {totalAmount.toLocaleString('id-ID')} ke kode statis.</span>
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 z-0">
                        {dynamicQRIS && <QRCodeSVG value={dynamicQRIS} size={180} level="H" fgColor="#1e293b" />}
                      </div>

                      <p className="mt-4 text-center text-sm font-medium text-slate-700 z-0">Scan dengan aplikasi e-Wallet atau M-Banking</p>
                      <p className="text-xs text-slate-500 text-center mt-1 z-0">Nominal sudah otomatis terisi di aplikasi pembeli.</p>
                    </>
                  )}
                </>
              ) : (
                // CASH PAYMENT UI
                <div className="w-full flex flex-col justify-center h-full space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 text-center">Uang Diterima (Rp)</label>
                    <input 
                      type="number" 
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      placeholder="Masukkan nominal"
                      className="w-full px-4 py-3 text-center text-2xl font-bold rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
                      autoFocus
                    />
                  </div>
                  
                  {numCashReceived > 0 && (
                    <div className={`p-4 rounded-xl border ${changeAmount >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <p className="text-sm text-center mb-1 font-medium text-slate-600">
                        {changeAmount >= 0 ? 'Kembalian' : 'Kurang'}
                      </p>
                      <p className={`text-2xl text-center font-bold ${changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Rp {Math.abs(changeAmount).toLocaleString('id-ID')}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSuccess}
                disabled={
                  isProcessing ||
                  (paymentMethod === 'qris' && (!baseQris || isGenerating)) ||
                  (paymentMethod === 'cash' && !isCashValid)
                }
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-green-200 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Menyimpan...</>
                ) : (
                  <><CheckCircle className="w-5 h-5 mr-2" /> Bayar</>
                )}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
