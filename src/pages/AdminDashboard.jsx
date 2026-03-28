import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminUsers from '../components/admin/AdminUsers';
import AdminStats from '../components/admin/AdminStats';
import AdminCards from '../components/admin/AdminCards';
import AdminTemplates from '../components/admin/AdminTemplates';
import { LayoutDashboard, Users, BarChart3, Mail, Settings, Bell, Search, User as UserIcon } from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'Admin') {
      navigate('/');
    }
  }, [user, navigate, authLoading]);

  if (authLoading || !user || user.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminStats />;
      case 'users':
        return <AdminUsers />;
      case 'stats':
        return <AdminStats />;
      case 'templates':
        return <AdminTemplates />;
      case 'cards': // Added just in case sidebar ID changes slightly or for future
        return <AdminCards />;
      case 'dashboard_cards': // For the 'Cards' link in sidebar if we rename it
        return <AdminCards />;
      default:
        // Support the 'templates' and 'cards' ids from Sidebar
        if (activeTab === 'templates') return <AdminTemplates />;
        if (activeTab === 'cards' || activeTab === 'dashboard') return <AdminStats />;
        if (activeTab === 'users') return <AdminUsers />;

        return (
          <div className="bg-white/80 backdrop-blur rounded-[2.5rem] p-16 text-center border border-slate-100/50 shadow-sm animate-in fade-in zoom-in duration-500">
             <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl">
               🏗️
             </div>
             <h3 className="text-2xl font-black text-slate-800 mb-2">Coming Soon</h3>
             <p className="text-slate-500 font-medium">This module is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-200/60">
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                {activeTab === 'dashboard' ? (language === 'ka' ? 'მართვის პანელი' : 'Control Center') : 
                 activeTab === 'users' ? (language === 'ka' ? 'მომხმარებლები' : 'User Management') :
                 activeTab === 'templates' ? (language === 'ka' ? 'შაბლონები' : 'Template Design') :
                 activeTab === 'cards' ? (language === 'ka' ? 'ბარათები' : 'Card Analytics') :
                 activeTab === 'stats' ? (language === 'ka' ? 'სტატისტიკა' : 'System Analytics') : 'Module'}
              </h1>
              <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
               <div className="relative">
                 <input 
                   type="text" 
                   placeholder="Search console..." 
                   className="bg-slate-50 border-none rounded-xl py-2 px-10 text-sm font-medium focus:ring-2 focus:ring-violet-500 outline-none w-64"
                 />
                 <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
               </div>
               <button className="p-2.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all relative">
                 <Bell className="w-5 h-5" />
                 <div className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-white" />
               </button>
               <div className="h-8 w-px bg-slate-100 mx-1" />
               <div className="flex items-center gap-3 pl-1 pr-2">
                  <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs">
                    {user.firstName[0]}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-black text-slate-800 leading-none">{user.firstName}</p>
                    <p className="text-[9px] font-black text-violet-600 uppercase mt-0.5 tracking-tighter">Root Admin</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="min-h-[calc(100vh-200px)]">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
