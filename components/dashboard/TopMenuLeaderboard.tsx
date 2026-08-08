'use client';

import { Flame } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LeaderboardItem {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

export function TopMenuLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(json => {
        if (json.leaderboard) setLeaderboard(json.leaderboard);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-bold text-slate-800 text-lg flex items-center">
            <Flame className="w-5 h-5 text-orange-500 mr-2" />
            Leaderboard Menu
          </h2>
          <p className="text-sm text-slate-500 mt-1">Menu terlaris sepanjang waktu.</p>
        </div>
      </div>

      <div className="max-h-[350px] overflow-y-auto pr-2 -mr-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[100px] text-slate-400 text-sm animate-pulse">Memuat data...</div>
        ) : leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[100px] text-slate-400 space-y-2 py-8">
            <Flame className="w-10 h-10 opacity-20" />
            <p className="text-sm">Belum ada transaksi yang tercatat.</p>
          </div>
        ) : (() => {
          const maxSales = leaderboard[0]?.sales || 1;

          return leaderboard.map((menu, index) => {
            const percentage = (menu.sales / maxSales) * 100;

            let rankStyle = "text-slate-500 font-semibold";
            let nameStyle = "font-semibold text-slate-700";
            let medalIcon = null;
            let bgFillColor = "bg-slate-100/70";

            if (index === 0) {
              rankStyle = "text-amber-500 font-extrabold";
              nameStyle = "font-bold text-slate-900";
              medalIcon = "🥇";
              bgFillColor = "bg-amber-100/60";
            } else if (index === 1) {
              rankStyle = "text-slate-400 font-bold";
              medalIcon = "🥈";
              bgFillColor = "bg-slate-100";
            } else if (index === 2) {
              rankStyle = "text-amber-700 font-bold";
              medalIcon = "🥉";
              bgFillColor = "bg-orange-50/80";
            }

            return (
              <div key={menu.id} className="relative rounded-2xl overflow-hidden border border-slate-100 mb-3 group">
                <div
                  className={`absolute top-0 left-0 h-full ${bgFillColor} transition-all duration-1000 ease-out`}
                  style={{ width: `${percentage}%` }}
                ></div>
                <div className="relative z-10 flex items-center p-3 px-4">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="w-10 sm:w-12 flex items-center shrink-0">
                      <span className={`text-sm ${rankStyle}`}>#{index + 1}</span>
                      {medalIcon && <span className="ml-1 text-base leading-none drop-shadow-sm">{medalIcon}</span>}
                    </div>
                    <div className="ml-1 flex-1 min-w-0">
                      <h4 className={`text-sm truncate ${nameStyle}`}>{menu.name}</h4>
                      <p className="text-[11px] font-bold text-emerald-600 mt-0.5">Rp {menu.revenue.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <div className={`text-sm ${index === 0 ? 'font-bold text-slate-900' : 'font-bold text-slate-700'}`}>
                      {menu.sales} <span className="text-[10px] font-medium text-slate-500">porsi</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
