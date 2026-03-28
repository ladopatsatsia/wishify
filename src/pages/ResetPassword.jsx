import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setError(language === 'ka' ? 'ბმული არავალიდურია.' : 'Invalid or expired reset link.');
    }
  }, [token, email, language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(language === 'ka' ? 'პაროლები არ ემთხვევა.' : 'Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://localhost:44328/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword: password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Reset failed');
      }

      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-violet-100 border border-violet-50 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">
            {language === 'ka' ? 'პაროლი შეიცვალა' : 'Success!'}
          </h2>
          <p className="text-slate-500 font-medium mb-8">
            {language === 'ka' 
              ? 'თქვენი პაროლი წარმატებით განახლდა. ახლა შეგიძლიათ შეხვიდეთ ახალი პაროლით.' 
              : 'Your password has been successfully reset. Redirecting you to login...'}
          </p>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-full h-full bg-violet-600 animate-progress origin-left" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-20">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-violet-100 border border-violet-50 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">
            {language === 'ka' ? 'ახალი პაროლი' : 'Secure Account'}
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            {language === 'ka' 
              ? 'შეიტანეთ თქვენი ახალი პაროლი და დააჭირეთ დადასტურებას.' 
              : 'Enter your new secure password below to regain access to your Wishify account.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              {language === 'ka' ? 'ახალი პაროლი' : 'New Password'}
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              {language === 'ka' ? 'გაიმეორეთ პაროლი' : 'Confirm Password'}
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm font-bold p-4 rounded-xl border border-red-100 flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !!error && error.includes('Invalid')}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              language === 'ka' ? 'პაროლის განახლება' : 'Update Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
