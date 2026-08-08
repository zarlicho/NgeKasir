import { StatCards } from "@/components/dashboard/StatCards";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { BusyTimeChart } from "@/components/dashboard/BusyTimeChart";
import { TopMenuLeaderboard } from "@/components/dashboard/TopMenuLeaderboard";
import { Bell, Search } from "lucide-react";

export default function Dashboard() {
  return (
    <>
      <header className="h-24 bg-white flex items-center justify-between px-6 md:px-8 z-10 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Halo, Admin</h1>
          <p className="text-sm text-slate-500 mt-0.5">Hari ini, {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="flex items-center space-x-3 md:space-x-4">
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg cursor-pointer shadow-md shadow-blue-200">
            A
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 pb-32">
        <StatCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <SalesChart />
          <div className="lg:col-span-1">
            <BusyTimeChart />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Future placeholder for Recent Transactions Table */}
          </div>
          <div className="lg:col-span-1">
            <TopMenuLeaderboard />
          </div>
        </div>
      </div>
    </>
  );
}
