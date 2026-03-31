import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.jpg';
import LegalModal from './LegalModal';

export default function Footer() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [legalModalType, setLegalModalType] = useState(null); // 'privacy' | 'terms' | null
  
  const categoriesList = [
    { label: language === 'ka' ? 'დაბადების დღე 🎂' : language === 'ru' ? 'День рождения 🎂' : 'Birthday 🎂', cat: 'birthday' },
    { label: language === 'ka' ? 'დიპლომი 🎓' : language === 'ru' ? 'Диплом 🎓' : 'Graduation 🎓', cat: 'graduation' },
    { label: language === 'ka' ? 'მოწვევა 💌' : language === 'ru' ? 'Приглашение 💌' : 'Invitation 💌', cat: 'invitation' },
    { label: language === 'ka' ? 'მოგონება 📸' : language === 'ru' ? 'Воспоминание 📸' : 'Memory 📸', cat: 'memory' },
    { label: language === 'ka' ? 'სიყვარული ❤️' : language === 'ru' ? 'Любовь ❤️' : 'Love ❤️', cat: 'love' },
    { label: language === 'ka' ? 'დღესასწაული 🎄' : language === 'ru' ? 'Праздник 🎄' : 'Holiday 🎄', cat: 'holiday' },
  ];

  const columns = [
    { title: language === 'ka' ? 'პროდუქტი' : language === 'ru' ? 'Продукт' : 'Product', links: ['browse', 'howItWorks'] },
    { title: language === 'ka' ? 'მხარდაჭერა' : language === 'ru' ? 'Поддержка' : 'Support', links: ['help', 'contact', 'privacy', 'terms'] },
  ];

  const socials = [
    { 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z"/>
        </svg>
      ), 
      label: 'Twitter' 
    },
    { 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ), 
      label: 'Instagram' 
    },
    { 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      ), 
      label: 'Facebook' 
    },
    { 
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      ), 
      label: 'LinkedIn' 
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Wishyfy Logo" className="w-10 h-10 object-contain rounded-lg shadow-sm" />
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Wishyfy
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm max-w-xs">
              {language === 'ka' ? 'აქციეთ ყველა დღესასწაული გამორჩეული ჯადოსნური ციფრული ბარათებით.' : language === 'ru' ? 'Делаем каждый праздник особенным с помощью волшебных цифровых открыток, которые оживают.' : 'Making every celebration special with magical digital greeting cards that come to life.'}
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(s => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-violet-500 hover:text-white transition-all hover:scale-110"
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col, idx) => (
            <div key={idx}>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(linkKey => (
                  <li key={linkKey}>
                    <button
                      onClick={() => {
                        if (linkKey === 'browse') navigate('/browse/birthday');
                        else if (linkKey === 'howItWorks') setLegalModalType('howItWorks');
                        else if (linkKey === 'privacy') setLegalModalType('privacy');
                        else if (linkKey === 'terms') setLegalModalType('terms');
                        else navigate('/');
                      }}
                      className="text-slate-400 hover:text-violet-400 transition-colors text-sm text-left cursor-pointer"
                    >
                      {language === 'ka' ? (
                        linkKey === 'browse' ? 'შაბლონების ნახვა' : 
                        linkKey === 'howItWorks' ? 'როგორ მუშაობს' :
                        linkKey === 'features' ? 'ფუნქციები' :
                        linkKey === 'pricing' ? 'ფასები' :
                        linkKey === 'help' ? 'დახმარება' :
                        linkKey === 'contact' ? 'კონტაქტი' :
                        linkKey === 'privacy' ? 'კონფიდენციალურობა' :
                        linkKey === 'terms' ? 'წესები' : linkKey
                      ) : language === 'ru' ? (
                        linkKey === 'browse' ? 'Посмотреть шаблоны' : 
                        linkKey === 'howItWorks' ? 'Как это работает' :
                        linkKey === 'features' ? 'Особенности' :
                        linkKey === 'pricing' ? 'Цены' :
                        linkKey === 'help' ? 'Помощь' :
                        linkKey === 'contact' ? 'Контакты' :
                        linkKey === 'privacy' ? 'Конфиденциальность' :
                        linkKey === 'terms' ? 'Условия' : linkKey
                      ) : (
                        linkKey === 'browse' ? 'Browse Cards' : 
                        linkKey === 'howItWorks' ? 'How it Works' :
                        linkKey === 'features' ? 'Features' :
                        linkKey === 'pricing' ? 'Pricing' :
                        linkKey.charAt(0).toUpperCase() + linkKey.slice(1)
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Category quick links */}
        <div className="border-t border-slate-800 pt-8 pb-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            {language === 'ka' ? 'დაათვალიერეთ' : language === 'ru' ? 'Посмотреть поводы' : 'Browse Occasions'}
          </p>
          <div className="flex flex-wrap gap-2">
            {categoriesList.map(cat => (
              <button
                key={cat.cat}
                onClick={() => navigate(`/browse/${cat.cat}`)}
                className="text-xs bg-slate-800 text-slate-400 hover:bg-violet-600 hover:text-white px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Copyright & Bottom Legal */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            {t('footer.rights')}
          </p>
          <div className="flex gap-6">
            <button 
              onClick={() => setLegalModalType('privacy')}
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors cursor-pointer"
            >
              {language === 'ka' ? 'კონფიდენციალურობა' : language === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy'}
            </button>
            <button 
              onClick={() => setLegalModalType('terms')}
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors cursor-pointer"
            >
              {language === 'ka' ? 'წესები და პირობები' : language === 'ru' ? 'Условия обслуживания' : 'Terms of Service'}
            </button>
          </div>
        </div>
      </div>

      <LegalModal 
        isOpen={!!legalModalType} 
        onClose={() => setLegalModalType(null)} 
        type={legalModalType} 
      />
    </footer>
  );
}
