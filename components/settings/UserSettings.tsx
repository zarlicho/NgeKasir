'use client';

import { useState, useEffect } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, Save, Store, KeyRound, CheckCircle2 } from "lucide-react";

export function UserSettings() {
  const { storeName, setStoreName, fetchSettings } = useSettingsStore();
  const { changePin, logout } = useAuthStore();
  
  const [localStoreName, setLocalStoreName] = useState(storeName);
  
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    setLocalStoreName(storeName);
  }, [storeName]);

  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState("");

  const handleSaveProfile = () => {
    if (localStoreName.trim() === "") {
      setSaveStatus('error');
      setStatusMessage('Nama toko tidak boleh kosong.');
      return;
    }

    setStoreName(localStoreName);
    
    // Process PIN change if provided
    if (newPin || confirmPin) {
      if (newPin.length !== 6 || confirmPin.length !== 6) {
        setSaveStatus('error');
        setStatusMessage('PIN harus persis 6 digit.');
        return;
      }
      if (newPin !== confirmPin) {
        setSaveStatus('error');
        setStatusMessage('Konfirmasi PIN tidak cocok.');
        return;
      }
      changePin(newPin);
      setNewPin("");
      setConfirmPin("");
    }

    setSaveStatus('success');
    setStatusMessage('Pengaturan berhasil disimpan.');
    setTimeout(() => {
      setSaveStatus('idle');
    }, 3000);
  };

  return (
    <div className="bg-white rounded-3xl w-full p-8 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-bold text-slate-800 text-lg flex items-center">
            <Store className="w-5 h-5 text-blue-600 mr-2" /> Profil Toko & Keamanan
          </h2>
          <p className="text-sm text-slate-500 mt-1">Ubah identitas warung dan PIN login kasir Anda.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Toko</label>
            <input 
              type="text" 
              value={localStoreName}
              onChange={(e) => setLocalStoreName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white text-sm" 
              placeholder="Contoh: Kedai Kopi Senja"
            />
          </div>
        </div>

        <div className="flex-1 space-y-4 md:border-l border-slate-100 md:pl-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <KeyRound className="w-4 h-4 mr-1.5" /> Ubah PIN (Opsional)
            </label>
            <p className="text-xs text-slate-500 mb-3">Isi hanya jika Anda ingin mengganti PIN login bawaan.</p>
            <div className="flex space-x-3">
              <input 
                type="password" 
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))} // only numbers
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white text-sm" 
                placeholder="PIN Baru"
              />
              <input 
                type="password" 
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))} // only numbers
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white text-sm" 
                placeholder="Konfirmasi"
              />
            </div>
          </div>
        </div>
      </div>

      {saveStatus === 'success' && (
        <div className="mt-6 flex items-center text-sm text-green-700 bg-green-50 border border-green-100 p-3 rounded-xl">
          <CheckCircle2 className="w-5 h-5 mr-2" /> {statusMessage}
        </div>
      )}
      
      {saveStatus === 'error' && (
        <div className="mt-6 flex items-center text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded-xl">
          <span className="font-bold mr-2">!</span> {statusMessage}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center pt-6 border-t border-slate-100">
        <button 
          onClick={handleSaveProfile}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-200 sm:order-2 w-full sm:w-auto"
        >
          <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
        </button>
        <button 
          onClick={logout}
          className="flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold transition sm:order-1 w-full sm:w-auto"
        >
          <LogOut className="w-4 h-4 mr-2" /> Keluar (Logout)
        </button>
      </div>
    </div>
  );
}
