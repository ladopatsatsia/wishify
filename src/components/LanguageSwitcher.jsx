import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ka', label: 'ქართული', flag: '🇬🇪' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100]" ref={dropdownRef}>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 w-40 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="px-4 py-1.5 border-b border-slate-50 mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {language === 'ka' ? 'აირჩიეთ ენა' : language === 'ru' ? 'Выберите язык' : 'Select Language'}
            </span>
          </div>
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center gap-3 hover:bg-violet-50 transition-colors cursor-pointer ${
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

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 bg-white hover:bg-slate-50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 transition-all active:scale-95 cursor-pointer"
        aria-label="Change Language"
      >
        <span className="text-2xl transition-transform group-hover:scale-110">{currentLang.flag}</span>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
          <span className="text-[10px] font-bold text-white uppercase">{language}</span>
        </div>
      </button>
    </div>
  );
}
