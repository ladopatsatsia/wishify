import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ka', label: 'ქართული', flag: '🇬🇪' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categoryLinks = [
    { label: language === 'ka' ? 'დაბადების დღე 🎂' : language === 'ru' ? 'День рождения 🎂' : 'Birthday 🎂', cat: 'birthday', bg: 'bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-200' },
    { label: language === 'ka' ? 'დიპლომი 🎓' : language === 'ru' ? 'Диплом 🎓' : 'Graduation 🎓', cat: 'graduation', bg: 'bg-violet-100 text-violet-700 hover:bg-violet-200 border border-violet-200' },
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white text-lg">🎉</span>
            </div>
            <span className="font-extrabold text-xl text-slate-800">
              Wish<span className="gradient-text">ify</span>
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
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                   setLangDropdownOpen(!langDropdownOpen);
                   setProfileDropdownOpen(false);
                }}
                className="flex items-center gap-2 bg-white/50 hover:bg-white/80 px-3 py-1.5 rounded-full border border-slate-200/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                title="Change Language"
              >
                <span className="text-xl">{currentLang.flag}</span>
                <span className="text-xs font-bold text-slate-600 hidden sm:inline">{currentLang.label}</span>
                <svg className={`w-3 h-3 text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 z-[60]">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-semibold flex items-center gap-3 hover:bg-violet-50 transition-colors cursor-pointer ${
                        language === lang.code ? 'text-violet-600 bg-violet-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.label}</span>
                      {language === lang.code && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500"></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {!user ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-slate-600 hover:text-violet-600 font-bold text-sm transition-colors cursor-pointer"
                >
                  {t('auth.btn_login')}
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="btn-primary !py-2 !px-6 !text-sm cursor-pointer"
                >
                  {t('nav.getStarted')}
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => {
                     setProfileDropdownOpen(!profileDropdownOpen);
                     setLangDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 bg-slate-100/50 hover:bg-slate-200/50 px-3 py-1.5 rounded-full border border-slate-200/50 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{user.firstName} {user.lastName}</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/profile/saved');
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      💾 {t('dashboard.saved_title')}
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/profile/published');
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      🌐 {t('dashboard.published_title')}
                    </button>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      🚪 {language === 'ka' ? 'გამოსვლა' : language === 'ru' ? 'Выход' : 'Logout'}
                    </button>
                  </div>
                )}
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
            <div className="flex flex-wrap gap-2 mb-4 bg-slate-50 p-2 rounded-xl">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all border ${
                    language === lang.code 
                      ? 'bg-white text-violet-600 border-violet-200 shadow-sm' 
                      : 'bg-transparent text-slate-500 border-transparent'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
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
                    className="w-full text-center py-2 text-slate-600 font-bold cursor-pointer"
                  >
                    {t('auth.btn_login')}
                  </button>
                  <button
                    onClick={() => { navigate('/signup'); setMenuOpen(false); }}
                    className="btn-primary w-full !text-sm !py-2.5 cursor-pointer"
                  >
                    {t('nav.getStarted')}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 text-slate-700 font-bold bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    {user.firstName} {user.lastName}
                  </div>
                  <button
                    onClick={() => { navigate('/profile/saved'); setMenuOpen(false); }}
                    className="w-full text-center py-2 text-violet-600 font-bold cursor-pointer"
                  >
                    {t('dashboard.saved_title')}
                  </button>
                  <button
                    onClick={() => { navigate('/profile/published'); setMenuOpen(false); }}
                    className="w-full text-center py-2 text-emerald-600 font-bold cursor-pointer"
                  >
                    {t('dashboard.published_title')}
                  </button>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full text-center py-2 text-red-500 font-bold cursor-pointer"
                  >
                    {language === 'ka' ? 'გამოსვლა' : language === 'ru' ? 'Выход' : 'Logout'}
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
