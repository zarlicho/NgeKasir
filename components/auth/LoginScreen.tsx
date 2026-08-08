'use client';

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Lock, Delete, Store } from "lucide-react";

export function LoginScreen() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [storeName, setStoreName] = useState("Ngekasir");
  const { login } = useAuthStore();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.name) setStoreName(data.name);
      })
      .catch(() => {});
  }, []);

  const handlePress = (num: string) => {
    if (error) setError(false);
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 6) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    if (error) setError(false);
    setPin(pin.slice(0, -1));
  };

  const verifyPin = async (currentPin: string) => {
    const success = await login(currentPin);
    if (!success) {
      setError(true);
      setTimeout(() => setPin(""), 500); // Clear pin after delay on error
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-transparent">
      <div className="w-full max-w-sm bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-slate-100 p-6 sm:p-8 flex flex-col items-center">
        
        {/* Header */}
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <Store className="w-8 h-8 text-blue-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{storeName}</h1>
        <p className="text-sm text-slate-500 mb-8 text-center">Masukkan 6 digit PIN untuk melanjutkan.</p>

        {/* PIN Indicators */}
        <div className={`flex space-x-4 mb-6 sm:mb-10 transition-transform ${error ? 'animate-shake' : ''}`}>
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                pin.length > i 
                  ? 'bg-blue-600 scale-110 shadow-md shadow-blue-200' 
                  : error ? 'bg-red-200' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium mb-4 -mt-4 animate-pulse">PIN tidak valid, coba lagi.</p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-4 w-full px-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="w-full aspect-square rounded-2xl bg-slate-50 hover:bg-slate-100 text-2xl font-bold text-slate-700 transition active:scale-95 flex items-center justify-center shadow-sm border border-slate-100"
            >
              {num}
            </button>
          ))}
          <div className="w-full aspect-square"></div> {/* Empty space bottom left */}
          <button
            onClick={() => handlePress("0")}
            className="w-full aspect-square rounded-2xl bg-slate-50 hover:bg-slate-100 text-2xl font-bold text-slate-700 transition active:scale-95 flex items-center justify-center shadow-sm border border-slate-100"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-full aspect-square rounded-2xl bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 transition active:scale-95 flex items-center justify-center border border-slate-100"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
