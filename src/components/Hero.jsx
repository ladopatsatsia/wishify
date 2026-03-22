import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [cards, setCards] = useState([
    {
      id: 1,
      categoryId: 'birthday',
      emoji: '🎂',
      title: language === 'ka' ? 'დაბადების დღე' : language === 'ru' ? 'День рождения' : 'Birthday Card',
      subtitle: language === 'ka' ? 'გილოცავ ამ ჯადოსნურ დღეს ✨' : language === 'ru' ? 'Желаю самого волшебного дня ✨' : 'Wishing you the most magical day ✨',
      bg: 'from-violet-400 to-pink-400'
    },
    {
      id: 2,
      categoryId: 'love',
      emoji: '💕',
      title: language === 'ka' ? 'სიყვარული' : language === 'ru' ? 'Любовь' : 'Love Card',
      subtitle: language === 'ka' ? 'გაუგზავნე შენი გული განსაკუთრებულს 💖' : language === 'ru' ? 'Отправьте свое сердце особенному человеку 💖' : 'Send your heart to someone special 💖',
      bg: 'from-pink-400 to-rose-500'
    },
    {
      id: 3,
      categoryId: 'graduation',
      emoji: '🎓',
      title: language === 'ka' ? 'დიპლომი' : language === 'ru' ? 'Диплом' : 'Graduation Card',
      subtitle: language === 'ka' ? 'აღნიშნე მათი დიდი მიღწევა 🌟' : language === 'ru' ? 'Отпразднуйте их большое достижение 🌟' : 'Celebrate their big achievement 🌟',
      bg: 'from-amber-400 to-orange-500'
    },
    {
      id: 4,
      categoryId: 'holiday',
      emoji: '🎄',
      title: language === 'ka' ? 'დღესასწაული' : language === 'ru' ? 'Праздник' : 'Holiday Card',
      subtitle: language === 'ka' ? 'გაავრცელე სადღესასწაულო განწყობა 🎁' : language === 'ru' ? 'Подарите праздничное настроение 🎁' : 'Spread the festive cheer 🎁',
      bg: 'from-green-400 to-emerald-500'
    },
    {
      id: 5,
      categoryId: 'memory',
      emoji: '📸',
      title: language === 'ka' ? 'მოგონება' : language === 'ru' ? 'Воспоминание' : 'Memory Card',
      subtitle: language === 'ka' ? 'გაიხსენეთ საუკეთესო მომენტები ერთად ✨' : language === 'ru' ? 'Вспомните лучшие моменты вместе ✨' : 'Relive your best moments together ✨',
      bg: 'from-teal-400 to-cyan-500'
    }
  ]);

  // Update cards when language changes
  useEffect(() => {
    setCards(prev => prev.map(c => {
      if (c.categoryId === 'birthday') return { ...c, title: language === 'ka' ? 'დაბადების დღე' : language === 'ru' ? 'День рождения' : 'Birthday Card', subtitle: language === 'ka' ? 'გილოცავ ამ ჯადოსნურ დღეს ✨' : language === 'ru' ? 'Желаю самого волшебного дня ✨' : 'Wishing you the most magical day ✨' };
      if (c.categoryId === 'love') return { ...c, title: language === 'ka' ? 'სიყვარული' : language === 'ru' ? 'Любовь' : 'Love Card', subtitle: language === 'ka' ? 'გაუგზავნე შენი გული განსაკუთრებულს 💖' : language === 'ru' ? 'Отправьте свое сердце особенному человеку 💖' : 'Send your heart to someone special 💖' };
      if (c.categoryId === 'graduation') return { ...c, title: language === 'ka' ? 'დიპლომი' : language === 'ru' ? 'Диплом' : 'Graduation Card', subtitle: language === 'ka' ? 'აღნიშნე მათი დიდი მიღწევა 🌟' : language === 'ru' ? 'Отпразднуйте их большое достижение 🌟' : 'Celebrate their big achievement 🌟' };
      if (c.categoryId === 'holiday') return { ...c, title: language === 'ka' ? 'დღესასწაული' : language === 'ru' ? 'Праздник' : 'Holiday Card', subtitle: language === 'ka' ? 'გაავრცელე სადღესასწაულო განწყობა 🎁' : language === 'ru' ? 'Подарите праздничное настроение 🎁' : 'Spread the festive cheer 🎁' };
      if (c.categoryId === 'memory') return { ...c, title: language === 'ka' ? 'მოგონება' : language === 'ru' ? 'Воспоминание' : 'Memory Card', subtitle: language === 'ka' ? 'გაიხსენეთ საუკეთესო მომენტები ერთად ✨' : language === 'ru' ? 'Вспомните лучшие моменты вместе ✨' : 'Relive your best moments together ✨' };
      return c;
    }));
  }, [language]);

  const handleCardClick = (clickedIndex) => {
    if (clickedIndex === 0) return;
    setCards(prev => {
      const newCards = [...prev];
      // Swap clicked with central (index 0)
      const temp = newCards[0];
      newCards[0] = newCards[clickedIndex];
      newCards[clickedIndex] = temp;
      return newCards;
    });
  };

  useEffect(() => {
    const el = heroRef.current;
    if (el) {
      setTimeout(() => el.classList.add('is-visible'), 100);
    }
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-200 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div ref={heroRef} className="fade-in-section space-y-6">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold">
              <span>🎉</span> {language === 'ka' ? 'გაახარე ყველა გაგზავნით' : language === 'ru' ? 'Дарите радость с каждой отправкой' : 'Spark Joy with Every Send'}
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight text-slate-900">
              {language === 'ka' ? 'შექმენი ჯადოსნობა ' : language === 'ru' ? 'Создавайте магию с ' : 'Create Magic with '}<span className="gradient-text">{language === 'ka' ? 'ციფრული ' : language === 'ru' ? 'цифровыми ' : 'Digital '}</span> {language === 'ka' ? 'მისალოცი ბარათებით' : language === 'ru' ? 'открытками' : 'Greeting Cards'}
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
              {language === 'ka' ? 'პერსონალიზაცია გაუკეთე ულამაზეს შაბლონებს შენი მესიჯებითა და საყვარელი მუსიკით წამებში. გააგზავნე მოგონება, რომელიც მუდამ დარჩება.' : language === 'ru' ? 'Персонализируйте красивые шаблоны с вашими сообщениями и любимой музыкой за считанные секунды. Подарите память, которая останется навсегда.' : 'Personalize beautiful templates with your own messages and favorite music in seconds. Send a lasting memory that stands out.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/browse/all')}
                className="btn-primary text-base !px-8 !py-4"
              >
                {language === 'ka' ? 'აირჩიე შაბლონი ✨' : language === 'ru' ? 'Выбрать шаблон ✨' : 'Choose a Template ✨'}
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-slate-700 font-semibold py-4 px-6 rounded-full border-2 border-slate-200 hover:border-violet-300 hover:text-violet-700 transition-colors"
              >
                {language === 'ka' ? 'ნახე როგორ მუშაობს →' : language === 'ru' ? 'Как это работает →' : 'See How it Works →'}
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              {[
                { val: '50K+', label: language === 'ka' ? 'გაგზავნილია' : language === 'ru' ? 'Отправлено' : 'Cards Sent' },
                { val: '4.9★', label: language === 'ka' ? 'შეფასება' : language === 'ru' ? 'Рейтинг' : 'User Rating' },
                { val: '120+', label: language === 'ka' ? 'უნიკალური დიზაინი' : language === 'ru' ? 'Уникальных дизайнов' : 'Unique Designs' },
              ].map(s => (
                <div key={s.val}>
                  <div className="text-2xl font-bold text-slate-900">{s.val}</div>
                  <div className="text-sm text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating card illustration */}
          <div className="relative hidden lg:block h-[520px] w-full">
            {cards.map((card, index) => {
              const isCenter = index === 0;

              // Styles based on positions 0-4
              // All use absolute, -translate-x-1/2, -translate-y-1/2 to perfectly center on their target point
              let posClasses = '';
              let delay = '0s';
              if (index === 0) {
                posClasses = 'left-1/2 top-1/2 w-72 h-[22rem] z-20 shadow-2xl rotate-0 border-white/40 rounded-[2rem]';
              } else if (index === 1) {
                posClasses = 'left-[15%] top-[20%] w-32 h-44 z-0 shadow-xl rotate-[-12deg] cursor-pointer hover:scale-105 hover:rotate-[-5deg] rounded-2xl';
                delay = '0.2s';
              } else if (index === 2) {
                posClasses = 'left-[85%] top-[20%] w-36 h-48 z-0 shadow-xl rotate-[12deg] cursor-pointer hover:scale-105 hover:rotate-[5deg] rounded-2xl';
                delay = '0.5s';
              } else if (index === 3) {
                posClasses = 'left-[20%] top-[80%] w-28 h-40 z-0 shadow-xl rotate-[8deg] cursor-pointer hover:scale-105 hover:rotate-[15deg] rounded-2xl';
                delay = '0.8s';
              } else if (index === 4) {
                posClasses = 'left-[80%] top-[80%] w-32 h-44 z-0 shadow-xl rotate-[-8deg] cursor-pointer hover:scale-105 hover:rotate-[-1deg] rounded-2xl';
                delay = '1.2s';
              }

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br ${card.bg} flex flex-col items-center justify-center p-4 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] border border-white/20 animate-float ${posClasses}`}
                  style={{ animationDelay: delay }}
                >
                  <div className={`transition-all duration-700 ease-in-out ${isCenter ? 'text-7xl mb-2' : 'text-4xl mb-1'}`}>
                    {card.emoji}
                  </div>
                  <div className={`text-white font-bold text-center leading-tight transition-all duration-700 ease-in-out ${isCenter ? 'text-xl' : 'text-sm whitespace-pre-line'}`}>
                    {card.title}
                  </div>

                  <div className={`flex flex-col items-center overflow-hidden transition-all duration-700 ease-in-out ${isCenter ? 'opacity-100 max-h-64 mt-2' : 'opacity-0 max-h-0 mt-0 pt-0'}`}>
                    {card.subtitle && (
                      <div className="text-white/90 text-base text-center leading-snug">
                        {card.subtitle}
                      </div>
                    )}
                    {card.musicLabel && (
                      <div className="bg-white/20 backdrop-blur border border-white/40 rounded-full px-5 py-2 text-white text-xs font-medium flex items-center gap-2 mt-3 shadow-sm mb-1">
                        {card.musicLabel}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/browse/${card.categoryId}`);
                      }}
                      className="mt-4 bg-white text-slate-800 font-bold px-6 py-2.5 rounded-full shadow-lg hover:scale-105 hover:text-violet-600 transition-all text-sm flex items-center gap-2 group-hover:bg-slate-50 relative z-30 cursor-pointer border border-transparent hover:border-violet-200"
                    >
                      <span>✨ {language === 'ka' ? 'შექმენი' : language === 'ru' ? 'Создать свою' : 'Create Your'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category pills removed to Navbar */}
      </div>
    </section>
  );
}

