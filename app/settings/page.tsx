import { ProductTable } from "@/components/settings/ProductTable";
import { ProductFormModal } from "@/components/settings/ProductFormModal";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { Bell, Search } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Kelola Stok & Menu</h1>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari menu..." 
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none w-64 text-sm"
            />
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
        
        <GeneralSettings />

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full min-h-[500px]">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-bold text-slate-800 text-lg">Daftar Inventaris</h2>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Cari menu..." 
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                />
              </div>
              <ProductFormModal mode="add" />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <ProductTable />
          </div>
        </div>
      </div>
    </>
  );
}
