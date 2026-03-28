import { Users, BarChart3, Mail, Settings, LayoutDashboard, CreditCard } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: { en: 'Dashboard', ka: 'მართვის პანელი' } },
  { id: 'users', icon: Users, label: { en: 'Users', ka: 'მომხმარებლები' } },
  { id: 'cards', icon: CreditCard, label: { en: 'Cards', ka: 'ბარათები' } },
  { id: 'stats', icon: BarChart3, label: { en: 'Statistics', ka: 'სტატისტიკა' } },
  { id: 'templates', icon: Mail, label: { en: 'Templates', ka: 'შაბლონები' } },
  { id: 'settings', icon: Settings, label: { en: 'Settings', ka: 'პარამეტრები' } },
];

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const { language } = useLanguage();

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 pt-20 border-r border-slate-800">
      <div className="px-6 mb-8 mt-4">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Admin Console
        </h2>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 group cursor-pointer ${
                isActive 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-sm">{item.label[language] || item.label['en']}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full' shadow-[0_0_10px_white]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
          <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">System Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
