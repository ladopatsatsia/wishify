import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

import logo from '../assets/logo.jpg';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categoryLinks = [
    { label: language === 'ka' ? 'დაბადების დღე 🎂' : language === 'ru' ? 'День рождения 🎂' : 'Birthday 🎂', cat: 'birthday', bg: 'bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-200' },
    { label: language === 'ka' ? 'მოწვევა 💌' : language === 'ru' ? 'Приглашение 💌' : 'Invitation 💌', cat: 'invitation', bg: 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200' },
    { label: language === 'ka' ? 'მოგონება 📸' : language === 'ru' ? 'Воспоминание 📸' : 'Memory 📸', cat: 'memory', bg: 'bg-teal-100 text-teal-700 hover:bg-teal-200 border border-teal-200' },
    { label: language === 'ka' ? 'სიყვარული ❤️' : language === 'ru' ? 'Любовь ❤️' : 'Love ❤️', cat: 'love', bg: 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200' },
    { label: language === 'ka' ? 'დღესასწაული 🎄' : language === 'ru' ? 'Праздник 🎄' : 'Holiday 🎄', cat: 'holiday', bg: 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200' },
  ];
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg shadow-purple-100/50' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
              <img src={logo} alt="Wishyfy" className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-xl text-slate-800">
              Wish<span className="gradient-text">yfy</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-3">
            {categoryLinks.map(link => (
              <button
                key={link.label}
                onClick={() => navigate(`/browse/${link.cat}`)}
                className={`${link.bg} font-bold px-4 py-2 rounded-full transition-all hover:scale-105 cursor-pointer text-sm shadow-sm`}
              >
                {link.label}
              </button>
            ))}
          </div>
          {/* CTA & Auth */}
          <div className="hidden md:flex items-center gap-4">

            
            {!user ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-slate-600 hover:text-violet-600 font-bold text-sm transition-colors cursor-pointer bg-slate-100/50 hover:bg-slate-200/50 px-6 py-2 rounded-full border border-slate-200/50 transition-all"
                >
                  {t('auth.btn_login')}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {user.role === 'Admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm transition-all duration-200 cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm group-hover:scale-110 transition-transform">
                      🛡️
                    </div>
                    <span className="text-xs font-black text-amber-700 group-hover:text-amber-800 transition-colors uppercase tracking-tight">Admin Console</span>
                  </button>
                )}

                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 bg-white/60 hover:bg-white/90 px-3 py-1.5 rounded-full border border-slate-200/70 shadow-sm transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white uppercase group-hover:scale-110 transition-transform shadow-sm">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-violet-600 transition-colors">{user.firstName} {user.lastName}</span>
                  <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Logout pill button */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-red-500 bg-red-50/80 hover:bg-red-100 border border-red-100 hover:border-red-200 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group"
                >
                  <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{language === 'ka' ? 'გამოსვლა' : language === 'ru' ? 'Выход' : 'Sign out'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-purple-50 transition"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-slate-700 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-slate-700 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-slate-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-xl p-4 mb-2 space-y-2 border border-purple-100 animate-in fade-in slide-in-from-top-4 duration-300">

            {categoryLinks.map(link => (
              <button
                key={link.label}
                onClick={() => { navigate(`/browse/${link.cat}`); setMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-xl font-bold transition ${link.bg}`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              {!user ? (
                <>
                  <button
                    onClick={() => { navigate('/login'); setMenuOpen(false); }}
                    className="w-full text-center py-3 bg-violet-600 text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-violet-200"
                  >
                    {t('auth.btn_login')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 font-bold bg-slate-50 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div className="text-left">
                      <div className="text-slate-800">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-violet-500 font-medium">
                        {language === 'ka' ? 'დაშბორდი →' : language === 'ru' ? 'Дашборд →' : 'Dashboard →'}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {language === 'ka' ? 'სისტემიდან გამოსვლა' : language === 'ru' ? 'Выйти из системы' : 'Sign out'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
