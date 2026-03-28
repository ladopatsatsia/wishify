import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Trash2, UserPlus, Mail, Shield, User as UserIcon } from 'lucide-react';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { language } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://localhost:44328/api/admin/users', {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    
    try {
      const response = await fetch(`https://localhost:44328/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error(err);
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
          {language === 'ka' ? 'აქტიური იუზერები' : 'Active Users'}
        </h3>
        <button className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200/50 cursor-pointer">
          <UserPlus className="w-4 h-4" />
          {language === 'ka' ? 'დაამატე იუზერი' : 'Add New User'}
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">{language === 'ka' ? 'პროფილი' : 'Profile'}</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">{language === 'ka' ? 'სტატუსი' : 'Status'}</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">{language === 'ka' ? 'როლი' : 'Role'}</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">{language === 'ka' ? 'თარიღი' : 'Created At'}</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-right">{language === 'ka' ? 'ქმედება' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-black">
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      u.role === 'Admin' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => handleDelete(u.id)}
                        title="Delete User"
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:shadow-sm rounded-lg transition-all cursor-pointer"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
