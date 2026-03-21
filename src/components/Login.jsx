import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 px-4 pt-20">
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-violet-200 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-purple-200/50 border border-white p-8 sm:p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-white text-3xl shadow-lg mb-4 animate-bounce-slow">
              ✨
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{language === 'ka' ? 'კეთილი იყოს თქვენი დაბრუნება' : language === 'ru' ? 'С возвращением' : 'Welcome Back'}</h1>
            <p className="text-slate-500 mt-2 font-medium">{language === 'ka' ? 'შედით თქვენს ჯადოსნურ პანელში' : language === 'ru' ? 'Войдите в свою магическую панель' : 'Log in to your magical dashboard'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-2xl border border-red-100 animate-shake">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">{language === 'ka' ? 'ელ-ფოსტა' : language === 'ru' ? 'Электронная почта' : 'Email Address'}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-violet-400 focus:outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">{language === 'ka' ? 'პაროლი' : language === 'ru' ? 'Пароль' : 'Password'}</label>
                <a href="#" className="text-xs font-bold text-violet-500 hover:text-pink-500 transition-colors">{language === 'ka' ? 'დაგავიწყდათ პაროლი?' : language === 'ru' ? 'Забыли пароль?' : 'Forgot Password?'}</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-violet-400 focus:outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-lg shadow-xl shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group`}
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {language === 'ka' ? 'შესვლა' : language === 'ru' ? 'Войти' : 'Sign In'}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-slate-500 font-medium">
            {language === 'ka' ? 'არ გაქვთ ანგარიში? ' : language === 'ru' ? 'Нет аккаунта? ' : "Don't have an account? "}
            <Link to="/signup" className="text-violet-600 font-bold hover:text-pink-500 transition-colors underline-offset-4 hover:underline">
              {language === 'ka' ? 'შექმენით ახლა' : language === 'ru' ? 'Создать' : 'Create One'}
            </Link>
          </div>
        </div>

        {/* Social logins */}
        <div className="mt-8 flex items-center gap-4 text-slate-400">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs font-bold uppercase tracking-widest">{language === 'ka' ? 'ან გააგრძელეთ' : language === 'ru' ? 'Или продолжить через' : 'Or continue with'}</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="mt-6 flex gap-3">
          <button className="flex-1 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center gap-2 font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]">
            <span className="text-xl">G</span> Google
          </button>
          <button className="flex-1 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center gap-2 font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]">
            <span className="text-xl">f</span> Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
