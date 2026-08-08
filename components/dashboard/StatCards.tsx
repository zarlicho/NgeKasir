'use client';

import { DollarSign, Receipt, TrendingUp, TrendingDown, Activity, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";

interface DashboardStats {
  todayRevenue: number;
  todayCount: number;
  avgTransaction: number;
  revenueTrend: string | null;
  countTrend: string | null;
  avgTrend: string | null;
}

export function StatCards() {
  const [showBalance, setShowBalance] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.stats) setStats(data.stats);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const todayRevenueStr = stats
    ? `Rp ${stats.todayRevenue.toLocaleString('id-ID')}`
    : 'Rp 0';

  const trendLabel = (trend: string | null, up: boolean) => {
    if (!trend) return 'Belum ada data kemarin';
    const num = parseFloat(trend);
    const sign = num >= 0 ? '+' : '';
    return `${sign}${trend}% dibanding kemarin`;
  };

  const revenueTrendUp = stats?.revenueTrend ? parseFloat(stats.revenueTrend) >= 0 : true;
  const countTrendUp = stats?.countTrend ? parseFloat(stats.countTrend) >= 0 : true;
  const avgTrendUp = stats?.avgTrend ? parseFloat(stats.avgTrend) >= 0 : true;

  const otherStats = [
    {
      title: "Total Transaksi",
      value: isLoading ? '...' : `${stats?.todayCount ?? 0}`,
      icon: Receipt,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      trend: trendLabel(stats?.countTrend ?? null, countTrendUp),
      trendUp: countTrendUp,
    },
    {
      title: "Rata-rata Transaksi",
      value: isLoading ? '...' : `Rp ${Math.round(stats?.avgTransaction ?? 0).toLocaleString('id-ID')}`,
      icon: Activity,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
      trend: trendLabel(stats?.avgTrend ?? null, avgTrendUp),
      trendUp: avgTrendUp,
    },
  ];

  return (
    <div className="mb-8">
      {/* Wallet-Style Primary Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-blue-200/50 mb-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 flex justify-between items-start mb-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 opacity-80" />
            <span className="font-medium opacity-90">Total Pendapatan Hari Ini</span>
          </div>
          <button onClick={() => setShowBalance(!showBalance)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm">
            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>

        <div className="relative z-10 mb-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-mono">
            {isLoading ? (
              <span className="opacity-50 animate-pulse">Memuat...</span>
            ) : showBalance ? todayRevenueStr : 'Rp *********'}
          </h2>
          <div className={`flex items-center mt-3 text-sm opacity-80 font-medium`}>
            {revenueTrendUp ? <TrendingUp className="w-4 h-4 mr-1.5" /> : <TrendingDown className="w-4 h-4 mr-1.5" />}
            {trendLabel(stats?.revenueTrend ?? null, revenueTrendUp)}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-5 mt-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse"></span>
            <span className="text-sm font-semibold tracking-wide">Toko Buka</span>
          </div>
          <div className="px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-lg text-xs font-semibold tracking-wide">
            Kasir Utama
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {otherStats.map((stat, i) => (
          <div key={i} className="flex-1 p-5 md:p-6 flex items-center gap-5 hover:bg-slate-50/50 transition-colors first:rounded-t-3xl md:first:rounded-tr-none md:first:rounded-l-3xl last:rounded-b-3xl md:last:rounded-bl-none md:last:rounded-r-3xl">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.iconBg} ${stat.iconColor}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 mb-1 font-bold uppercase tracking-wider">{stat.title}</p>
              <h3 className="font-bold text-slate-800 text-2xl">{stat.value}</h3>
              <p className={`text-[11px] mt-1.5 flex items-center font-bold ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
