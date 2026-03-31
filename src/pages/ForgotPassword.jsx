import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { AUTH_URL } from '../api/config';

export default function ForgotPassword() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${AUTH_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Something went wrong');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-violet-100 border border-violet-50 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">
            {language === 'ka' ? 'ელ-ფოსტა გაიგზავნა' : 'Check Your Inbox'}
          </h2>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">
            {language === 'ka' 
              ? `გთხოვთ შეამოწმოთ ${email} პაროლის აღსადგენი ლინკისთვის.` 
              : `We've sent a password reset link to ${email}. Please follow the instructions to restore your account.`}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition shadow-lg shadow-slate-200 cursor-pointer"
          >
            {language === 'ka' ? 'დაბრუნება ავტორიზაციაზე' : 'Back to Login'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-20">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-violet-100 border border-violet-50 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-slate-400 hover:text-violet-600 font-bold mb-8 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {language === 'ka' ? 'უკან' : 'Back'}
        </button>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">
            {language === 'ka' ? 'პაროლის აღდგენა' : 'Lost Access?'}
          </h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed px-4">
            {language === 'ka' 
              ? 'შეიყვანეთ თქვენი ელ-ფოსტა და ჩვენ გამოგიგზავნით აღდგენის ბმულს.' 
              : 'Enter your email address and we\'ll send you a magic link to reset your password.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              {language === 'ka' ? 'ელ-ფოსტა' : 'Email Address'}
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm font-bold p-4 rounded-xl border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-3 group cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                {language === 'ka' ? 'ლინკის გაგზავნა' : 'Send Reset Link'}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-400 font-bold text-sm">
            {language === 'ka' ? 'გახსოვთ პაროლი?' : 'Remembered your password?'} {' '}
            <button
              onClick={() => navigate('/login')}
              className="text-violet-600 hover:text-violet-700 transition cursor-pointer"
            >
              {language === 'ka' ? 'შესვლა' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
