'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useEffect, useState } from 'react';

interface SalesDataPoint {
  name: string;
  total: number;
}

export function SalesChart() {
  const [data, setData] = useState<SalesDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(json => {
        if (json.salesChart) setData(json.salesChart);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-slate-800 text-lg">Grafik Pendapatan (7 Hari)</h2>
        <span className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-1">
          Minggu Ini
        </span>
      </div>
      <div className="h-72 w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm animate-pulse">Memuat data...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false}
                tickFormatter={(value) => `Rp${value / 1000}k`}
              />
              <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                wrapperStyle={{ zIndex: 100 }}
                formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
              />
              <Area
                type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3}
                fillOpacity={1} fill="url(#colorTotal)"
                activeDot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
