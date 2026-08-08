import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOf7DaysAgo = new Date(startOfToday);
    startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 6);

    // Today's transactions
    const todayTransactions = await prisma.transaction.findMany({
      where: { createdAt: { gte: startOfToday } },
      include: { items: { include: { product: { include: { category: true } } } } },
    });

    // Yesterday's transactions for trend comparison
    const yesterdayTransactions = await prisma.transaction.findMany({
      where: { createdAt: { gte: startOfYesterday, lt: startOfToday } },
    });

    // Last 7 days for sales chart
    const last7DaysTransactions = await prisma.transaction.findMany({
      where: { createdAt: { gte: startOf7DaysAgo } },
    });

    // All-time transactions (for busy time + leaderboard)
    const allTransactions = await prisma.transaction.findMany({
      select: { createdAt: true, totalAmount: true },
    });
    const allTransactionItems = await prisma.transactionItem.findMany({
      include: { product: { include: { category: true } } },
    });

    // --- Compute Stats ---
    const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const yesterdayRevenue = yesterdayTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const todayCount = todayTransactions.length;
    const yesterdayCount = yesterdayTransactions.length;
    const avgTransaction = todayCount > 0 ? todayRevenue / todayCount : 0;
    const avgYesterday = yesterdayCount > 0 ? yesterdayRevenue / yesterdayCount : 0;

    const revenueTrend = yesterdayRevenue > 0
      ? (((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1)
      : null;
    const countTrend = yesterdayCount > 0
      ? (((todayCount - yesterdayCount) / yesterdayCount) * 100).toFixed(1)
      : null;
    const avgTrend = avgYesterday > 0
      ? (((avgTransaction - avgYesterday) / avgYesterday) * 100).toFixed(1)
      : null;

    // --- Sales Chart (last 7 days) ---
    const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const salesByDay: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOf7DaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      salesByDay[key] = 0;
    }
    for (const t of last7DaysTransactions) {
      const key = new Date(t.createdAt).toISOString().split('T')[0];
      if (key in salesByDay) salesByDay[key] += t.totalAmount;
    }
    const salesChart = Object.entries(salesByDay).map(([dateStr, total]) => ({
      name: dayLabels[new Date(dateStr).getDay()],
      total,
    }));

    // --- Category Chart (all-time by revenue) ---
    const categoryRevenue: Record<string, number> = {};
    for (const item of allTransactionItems) {
      const cat = item.product.category.name;
      categoryRevenue[cat] = (categoryRevenue[cat] || 0) + item.priceAtTime * item.quantity;
    }
    const totalCategoryRevenue = Object.values(categoryRevenue).reduce((a, b) => a + b, 0);
    const categoryChart = Object.entries(categoryRevenue).map(([name, value]) => ({
      name,
      value: totalCategoryRevenue > 0 ? Math.round((value / totalCategoryRevenue) * 100) : 0,
    }));

    // --- Leaderboard (all-time top menus by qty sold) ---
    const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
    for (const item of allTransactionItems) {
      const pid = item.productId;
      if (!productSales[pid]) {
        productSales[pid] = { name: item.product.name, sales: 0, revenue: 0 };
      }
      productSales[pid].sales += item.quantity;
      productSales[pid].revenue += item.priceAtTime * item.quantity;
    }
    const leaderboard = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // --- Busy Time: Per Jam (06-23) ---
    const hourlyCounts: Record<string, number> = {};
    for (let h = 6; h <= 23; h++) {
      hourlyCounts[String(h).padStart(2, '0')] = 0;
    }
    for (const t of allTransactions) {
      const hour = new Date(t.createdAt).getHours();
      if (hour >= 6 && hour <= 23) {
        const key = String(hour).padStart(2, '0');
        hourlyCounts[key] = (hourlyCounts[key] || 0) + 1;
      }
    }
    const busyTimeHourly = Object.entries(hourlyCounts).map(([time, orders]) => ({ time, orders }));

    // --- Busy Time: Sesi Waktu ---
    const sessions = [
      { name: 'Pagi',  time: '06:00 - 11:00', startH: 6,  endH: 11, color: '#facc15' },
      { name: 'Siang', time: '11:00 - 15:00', startH: 11, endH: 15, color: '#fb923c' },
      { name: 'Sore',  time: '15:00 - 18:00', startH: 15, endH: 18, color: '#f472b6' },
      { name: 'Malam', time: '18:00 - 23:00', startH: 18, endH: 24, color: '#1e3a8a' },
    ];
    const sessionCounts: Record<string, number> = { Pagi: 0, Siang: 0, Sore: 0, Malam: 0 };
    for (const t of allTransactions) {
      const hour = new Date(t.createdAt).getHours();
      for (const s of sessions) {
        if (hour >= s.startH && hour < s.endH) {
          sessionCounts[s.name]++;
          break;
        }
      }
    }
    const totalSessionTrx = Object.values(sessionCounts).reduce((a, b) => a + b, 0);
    const busyTimeSessions = sessions.map(s => ({
      name: s.name,
      time: s.time,
      value: totalSessionTrx > 0 ? Math.round((sessionCounts[s.name] / totalSessionTrx) * 100) : 0,
      trx: sessionCounts[s.name],
      color: s.color,
    }));

    return NextResponse.json({
      stats: {
        todayRevenue,
        todayCount,
        avgTransaction,
        revenueTrend,
        countTrend,
        avgTrend,
      },
      salesChart,
      categoryChart,
      leaderboard,
      busyTimeHourly,
      busyTimeSessions,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
