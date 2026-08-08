'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Sector } from 'recharts';

interface HourlyPoint { time: string; orders: number; }
interface SessionPoint { name: string; time: string; value: number; trx: number; color: string; }

export function BusyTimeChart() {
  const [activeTab, setActiveTab] = useState<'per-jam' | 'sesi-waktu'>('per-jam');
  const [activePieIndex, setActivePieIndex] = useState<number | undefined>();
  const [hourlyData, setHourlyData] = useState<HourlyPoint[]>([]);
  const [sessionData, setSessionData] = useState<SessionPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(json => {
        if (json.busyTimeHourly) setHourlyData(json.busyTimeHourly);
        if (json.busyTimeSessions) setSessionData(json.busyTimeSessions);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Compute peak threshold from real data
  const sortedOrders = [...hourlyData].sort((a, b) => b.orders - a.orders);
  const peakThreshold = sortedOrders.length >= 4 ? sortedOrders[3].orders : 1;

  // Best session by value
  const bestSession = sessionData.length > 0
    ? sessionData.reduce((prev, cur) => (cur.value > prev.value ? cur : prev), sessionData[0])
    : null;

  const onPieInteraction = (_: any, index: number) => setActivePieIndex(index);
  const onPieLeave = () => setActivePieIndex(undefined);

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius} outerRadius={outerRadius + 6}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill}
        style={{ outline: 'none', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }}
      />
    );
  };

  const emptyState = (
    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm min-h-[220px] animate-pulse">
      {isLoading ? 'Memuat data...' : 'Belum ada data transaksi'}
    </div>
  );

  return (
    <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="mb-5">
        <h2 className="font-bold text-slate-800 text-lg mb-4">Analitik Waktu Sibuk</h2>
        
        {/* Toggle Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('per-jam')}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'per-jam' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Per Jam
          </button>
          <button 
            onClick={() => setActiveTab('sesi-waktu')}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'sesi-waktu' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sesi Waktu
          </button>
        </div>
      </div>
      
      <div className="flex-1 w-full flex flex-col min-h-[220px] relative [-webkit-tap-highlight-color:transparent]">
        {activeTab === 'per-jam' ? (
          isLoading || hourlyData.length === 0 ? emptyState : (
            <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart style={{ outline: 'none' }} data={hourlyData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <XAxis 
                    dataKey="time" axisLine={false} tickLine={false}
                    tick={{ fontSize: 10, fill: '#94a3b8' }} interval="preserveStartEnd"
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                    wrapperStyle={{ zIndex: 100 }}
                    formatter={(value: number) => [`${value} pesanan`, 'Total']}
                    labelFormatter={(label) => `Jam ${label}:00`}
                  />
                  <Bar style={{ outline: 'none' }} dataKey="orders" radius={[4, 4, 4, 4]}>
                    {hourlyData.map((entry, index) => (
                      <Cell style={{ outline: 'none' }} key={`cell-${index}`} fill={entry.orders >= peakThreshold ? '#ef4444' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center justify-center text-[10px] text-slate-500 font-medium w-full">
                <span className="w-3 h-3 rounded-sm bg-red-500 mr-2 opacity-90"></span> Jam sibuk
                <span className="w-3 h-3 rounded-sm bg-slate-200 mr-2 ml-4"></span> Jam normal
              </div>
            </div>
          )
        ) : (
          isLoading || sessionData.length === 0 ? emptyState : (
            <div className="flex-1 w-full flex flex-col h-full">
              <div className="relative w-full h-[200px] shrink-0">
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Paling Ramai</span>
                  <span className="text-base font-extrabold text-slate-800">
                    {activePieIndex !== undefined
                      ? `${sessionData[activePieIndex].name} (${sessionData[activePieIndex].value}%)`
                      : bestSession ? `${bestSession.name} (${bestSession.value}%)` : '-'
                    }
                  </span>
                </div>
                
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart style={{ outline: 'none' }}>
                    <Pie
                      style={{ outline: 'none' }}
                      data={sessionData} cx="50%" cy="50%"
                      innerRadius={70} outerRadius={90}
                      paddingAngle={3} dataKey="value" stroke="none"
                      activeIndex={activePieIndex} activeShape={renderActiveShape}
                      onMouseEnter={onPieInteraction} onMouseLeave={onPieLeave} onClick={onPieInteraction}
                    >
                      {sessionData.map((entry, index) => (
                        <Cell 
                          style={{ outline: 'none', transition: 'opacity 0.3s ease' }} 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          opacity={activePieIndex === undefined || activePieIndex === index ? 1 : 0.2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      wrapperStyle={{ zIndex: 100 }}
                      formatter={(value: number, name: string, props: any) => [`${value}% (${props.payload.trx} trx)`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {sessionData.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: session.color }}></div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-tight">{session.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">{session.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800 text-sm">{session.value}%</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{session.trx} Transaksi</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
