import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ChangePasswordTab() {
  const { changePassword } = useAuth();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus({ loading: false, success: false, error: '' });
  };

  const toggleShow = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: false, success: false, error: '' });

    if (form.newPassword.length < 6) {
      setStatus({ loading: false, success: false, error: t('dashboard.password_short') });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ loading: false, success: false, error: t('dashboard.password_mismatch') });
      return;
    }

    setStatus({ loading: true, success: false, error: '' });
    const result = await changePassword(form.currentPassword, form.newPassword);

    if (result.success) {
      setStatus({ loading: false, success: true, error: '' });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setStatus({ loading: false, success: false, error: result.error || 'Error occurred.' });
    }
  };

  const EyeIcon = ({ show }) => (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {show ? (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </>
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </>
      )}
    </svg>
  );

  const fields = [
    { id: 'currentPassword', label: t('dashboard.current_password'), showKey: 'current', icon: '🔑' },
    { id: 'newPassword', label: t('dashboard.new_password'), showKey: 'new', icon: '🔒' },
    { id: 'confirmPassword', label: t('dashboard.confirm_password'), showKey: 'confirm', icon: '✅' },
  ];

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-100/80 shadow-xl shadow-slate-100/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 p-8 text-white">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="text-2xl font-black mb-1">{t('dashboard.change_password_title')}</h2>
          <p className="text-violet-100 text-sm leading-relaxed">{t('dashboard.change_password_desc')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {fields.map(field => (
            <div key={field.id}>
              <label className="block text-sm font-bold text-slate-600 mb-2">
                <span className="mr-2">{field.icon}</span>
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={showPasswords[field.showKey] ? 'text' : 'password'}
                  name={field.id}
                  value={form[field.id]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => toggleShow(field.showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  <EyeIcon show={showPasswords[field.showKey]} />
                </button>
              </div>
            </div>
          ))}

          {/* Error / Success messages */}
          {status.error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
              <span className="text-base mt-0.5">⚠️</span>
              <span>{status.error}</span>
            </div>
          )}
          {status.success && (
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl px-4 py-3 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
              <span className="text-base mt-0.5">🎉</span>
              <span>{t('dashboard.password_success')}</span>
            </div>
          )}

          {/* Strength hint */}
          {form.newPassword.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => {
                  const len = form.newPassword.length;
                  const filled = i < Math.min(4, Math.floor(len / 3));
                  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400'];
                  return (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${filled ? colors[Math.min(i, colors.length - 1)] : 'bg-slate-200'}`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-slate-400">
                {form.newPassword.length < 6 ? '🔴 Too short' :
                 form.newPassword.length < 9 ? '🟡 Fair' :
                 form.newPassword.length < 12 ? '🟠 Good' : '🟢 Strong'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black py-3.5 rounded-xl hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-violet-200 flex items-center justify-center gap-2 cursor-pointer text-sm mt-2"
          >
            {status.loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>...</span>
              </>
            ) : (
              <>
                <span>🔐</span>
                <span>{t('dashboard.btn_change_password')}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
