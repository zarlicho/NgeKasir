'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface CategoryDataPoint {
  name: string;
  value: number;
}

export function CategoryChart() {
  const [data, setData] = useState<CategoryDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(json => {
        if (json.categoryChart) setData(json.categoryChart);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h2 className="font-bold text-slate-800 text-lg mb-6">Penjualan per Kategori</h2>
      <div className="h-64 w-full flex justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center text-slate-400 text-sm animate-pulse">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center text-slate-400 text-sm">Belum ada data transaksi</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data} cx="50%" cy="45%"
                innerRadius={60} outerRadius={80}
                paddingAngle={2} dataKey="value" stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                wrapperStyle={{ zIndex: 100 }}
                formatter={(value: any) => [`${value}%`, 'Persentase']}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
