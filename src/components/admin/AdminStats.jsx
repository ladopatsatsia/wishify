import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Users, CreditCard, Layout, TrendingUp, Activity, Globe } from 'lucide-react';
import { ADMIN_URL } from '../../api/config';

export default function AdminStats() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${ADMIN_URL}/stats`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user.token]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500', trend: '+12%' },
    { title: 'Total Cards', value: stats.totalCards, icon: CreditCard, color: 'bg-violet-500', trend: '+8%' },
    { title: 'Public Cards', value: stats.publicCards, icon: Globe, color: 'bg-emerald-500', trend: '+25%' },
    { title: 'Active Templates', value: stats.categoriesCount, icon: Layout, color: 'bg-amber-500', trend: 'Steady' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${card.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                <card.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-black px-2 py-1 rounded-full ${
                card.trend.includes('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {card.trend}
              </span>
            </div>
            <h4 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{card.title}</h4>
            <p className="text-3xl font-black text-slate-800">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-violet-900/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-violet-600 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">Platform Activity</h3>
            </div>
            <div className="h-64 flex items-end gap-3 pb-4">
              {stats.dailyActivity.map((day, i) => {
                const maxCount = Math.max(...stats.dailyActivity.map(d => d.count), 1);
                const height = (day.count / (maxCount * 1.2)) * 100;
                return (
                  <div key={i} className="flex-1 bg-violet-500/30 hover:bg-violet-400 transition-all duration-300 rounded-t-lg relative group cursor-pointer" style={{ height: `${Math.max(height, 5)}%` }}>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-800 text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-100">
                      {day.count} {language === 'ka' ? 'ბარათი' : 'cards'}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 text-slate-500 text-[10px] font-black uppercase tracking-widest px-1">
              {stats.dailyActivity.map((day, i) => (
                <span key={i}>{day.date}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative group overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-pink-600" />
           <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Recent Logs</h3>
           </div>
           
           <div className="space-y-6">
              {stats.recentLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-2 h-2 mt-2 bg-violet-600 rounded-full shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{log.user}</p>
                    <p className="text-xs text-slate-500 font-medium">{log.action}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-tighter">
                      {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {stats.recentLogs.length === 0 && (
                <p className="text-slate-400 text-sm italic text-center py-4">No recent activity</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
