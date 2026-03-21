import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function useFadeIn(ref) {
// ... existing useFadeIn logic ...
}

export default function BottomCTA() {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  // Custom hook usage
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
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-8 left-16 text-6xl">🎉</div>
        <div className="absolute top-1/3 right-24 text-5xl">💌</div>
        <div className="absolute bottom-10 left-1/3 text-5xl">🎂</div>
        <div className="absolute top-16 right-80 text-4xl">🎓</div>
        <div className="absolute bottom-16 right-16 text-6xl">✨</div>
        <div className="absolute bottom-24 left-10 text-4xl">❤️</div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div ref={ref} className="fade-in-section space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/30">
            {language === 'ka' ? 'მზად ხართ აღსანიშნავად?' : language === 'ru' ? 'Готовы праздновать?' : 'Ready to Celebrate?'}
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
            {language === 'ka' ? 'შექმენი შენი პირველი ' : language === 'ru' ? 'Создайте свою первую ' : 'Create Your First '}<span className="text-yellow-300">{language === 'ka' ? 'ჯადოსნური ბარათი' : language === 'ru' ? 'магическую открытку' : 'Magic Card'}</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            {language === 'ka' ? 'შემოუერთდით ათასობით მომხმარებელს და დაიწყეთ მოგონებების გაგზავნა. საკრედიტო ბარათი არ არის საჭირო.' : language === 'ru' ? 'Присоединяйтесь к тысячам счастливых пользователей и начните отправлять воспоминания, которые останутся навсегда. Кредитная карта не требуется.' : 'Join thousands of happy users and start sending memories that last forever. No credit card required.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/browse/birthday')}
              className="bg-white text-violet-700 font-bold text-lg px-10 py-4 rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all cursor-pointer"
            >
              {language === 'ka' ? 'დაიწყე ახლავე ✨' : language === 'ru' ? 'Начать прямо сейчас ✨' : 'Get Started Now ✨'}
            </button>
            <a
              href="#features"
              className="border-2 border-white/50 text-white font-semibold text-lg px-8 py-4 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              {language === 'ka' ? 'ფუნქციების ნახვა →' : language === 'ru' ? 'Посмотреть функции →' : 'Browse Features →'}
            </a>
          </div>
          <p className="text-white/50 text-sm">{language === 'ka' ? 'შექმნას 2 წუთზე ნაკლები სჭირდება.' : language === 'ru' ? 'Создание и отправка занимают менее 2 минут.' : 'Takes less than 2 minutes to create and send.'}</p>
        </div>
      </div>
    </section>
  );
}
