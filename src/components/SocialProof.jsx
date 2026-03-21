import { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function SocialProof() {
  const ref = useRef(null);
  const { language } = useLanguage();
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('is-visible'); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-violet-50 to-pink-50 border-y border-slate-100 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-200 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div ref={ref} className="fade-in-section">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
            {language === 'ka' ? 'გააზიარეთ ' : language === 'ru' ? 'Делитесь ' : 'Share '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500">{language === 'ka' ? 'დაუვიწყარი' : language === 'ru' ? 'незабываемыми' : 'Unforgettable'}</span> {language === 'ka' ? 'მოგონებები' : language === 'ru' ? 'воспоминаниями' : 'Memories'}
          </h2>
        </div>
      </div>
    </section>
  );
}
