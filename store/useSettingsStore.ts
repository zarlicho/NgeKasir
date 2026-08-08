import { create } from 'zustand';

interface SettingsStore {
  storeName: string;
  taxPercentage: number;
  baseQris: string;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  setStoreName: (name: string) => Promise<void>;
  setTaxPercentage: (tax: number) => Promise<void>;
  setBaseQris: (qris: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  storeName: 'Toko Saya',
  taxPercentage: 11,
  baseQris: '',
  isLoading: false,
  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        set({
          storeName: data.name,
          baseQris: data.baseQris || '',
          taxPercentage: data.taxPercentage ?? 11,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      set({ isLoading: false });
    }
  },
  setStoreName: async (name) => {
    set({ storeName: name });
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
    } catch (error) {
      console.error("Failed to save store name");
    }
  },
  setTaxPercentage: async (taxPercentage) => {
    set({ taxPercentage });
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taxPercentage }),
      });
    } catch (error) {
      console.error("Failed to save tax percentage");
    }
  },
  setBaseQris: async (baseQris) => {
    set({ baseQris });
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseQris }),
      });
    } catch (error) {
      console.error("Failed to save QRIS");
    }
  },
}));
