import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Layout, Plus, Edit, Trash, BarChart, ChevronRight } from 'lucide-react';
import { ADMIN_URL } from '../../api/config';

export default function AdminTemplates() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${ADMIN_URL}/templates`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [user.token]);

  const handleDelete = async (id) => {
    if (!window.confirm(language === 'ka' ? 'დარწმუნებული ხართ, რომ გსურთ ამ შაბლონის წაშლა?' : 'Are you sure you want to delete this template?')) return;
    try {
      const res = await fetch(`${ADMIN_URL}/templates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        fetchTemplates();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to delete template');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the template');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-slate-800">
          {language === 'ka' ? 'შაბლონების მართვა' : 'Template Management'}
        </h3>
        <button className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200/50 cursor-pointer">
          <Plus className="w-4 h-4" />
          {language === 'ka' ? 'ახალი შაბლონი' : 'Create Template'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((t) => (
          <div key={t.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-200/20 transition-all duration-500 group">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200 scale-110 group-hover:scale-125 transition-transform duration-500">
                  <Layout className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800">{t.title}</h4>
                  <p className="text-xs font-black text-violet-600 uppercase tracking-widest">{t.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-slate-50 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition cursor-pointer"><Edit className="w-4 h-4" /></button>
                <button 
                  onClick={() => handleDelete(t.id)}
                  className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100/50 relative overflow-hidden group/sub">
                <div className="absolute top-0 right-0 w-12 h-12 bg-violet-600/5 rounded-full -mr-6 -mt-6 group-hover/sub:scale-150 transition-transform duration-700" />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Total Usage</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-800">{t.usageCount}</span>
                  <span className="text-xs text-slate-400 font-bold">cards</span>
                </div>
              </div>
              <div className="bg-emerald-50/50 rounded-3xl p-5 border border-emerald-100/50 relative overflow-hidden">
                <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-black text-emerald-700 uppercase">Published</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer">
              View Analytics
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
