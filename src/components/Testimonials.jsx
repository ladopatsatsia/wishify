import { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

function useFadeIn(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('is-visible'); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
}

export default function Testimonials() {
  const ref = useRef(null);
  const { language } = useLanguage();
  useFadeIn(ref);

  const reviews = [
    {
      name: language === 'ka' ? 'სარა ჯენკინსი' : language === 'ru' ? 'Сара Дженкинс' : 'Sarah Jenkins',
      title: language === 'ka' ? 'დაბადების დღის სიურპრიზი' : language === 'ru' ? 'Сюрприз на день рождения' : 'Birthday Surprise',
      quote: language === 'ka' ? "ეს იყო ყველაზე განსაკუთრებული ციფრული საჩუქარი რაც კი ოდესმე მიმიღია. ძალიან მომეწონა." : language === 'ru' ? "Это был самый особенный цифровой подарок, который я когда-либо получала. Мне очень понравилось." : "The magic reveal feature absolutely blew my best friend away! She said it was the most thoughtful digital gift she's ever received.",
      avatar: '👩‍💼',
    },
    {
      name: language === 'ka' ? 'მაიკლ ჩენი' : language === 'ru' ? 'Майкл Чен' : 'Michael Chen',
      title: language === 'ka' ? 'ოჯახის შეკრება' : language === 'ru' ? 'Семейная встреча' : 'Family Reunion',
      quote: language === 'ka' ? "ძალიან მარტივი გამოსაყენებელი. გავუგზავნე ბარათი მშობლებს სხვა ქვეყანაში და პრობლემების გარეშე გახსნეს." : language === 'ru' ? "Очень легко использовать. Отправил открытку родителям в другую страну, и они открыли её без проблем." : "Clean, elegant, and so easy to use. I sent a card to my parents across the world and they were able to open it with zero tech issues.",
      avatar: '👨‍🎨',
    },
    {
      name: language === 'ka' ? 'ემა როდრიგესი' : language === 'ru' ? 'Эмма Родригес' : 'Emma Rodriguez',
      title: language === 'ka' ? 'ახალი თავი' : language === 'ru' ? 'Новая глава' : 'New Chapter',
      quote: language === 'ka' ? "ჩვენი საყვარელი სიმღერის დამატებამ ეს ბარათი ძალიან პერსონალური გახადა. Wishify ჩემი ფავორიტია." : language === 'ru' ? "Добавление нашей любимой песни сделало эту открытку очень личной. Wishify — мой фаворит." : "Adding our favorite song to the graduation card made it so personal. Wishify is my new go-to for every special occasion.",
      avatar: '👩‍🔬',
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="fade-in-section text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {language === 'ka' ? 'მომხმარებელთა ისტორიები' : language === 'ru' ? 'Истории пользователей' : 'User Stories'}
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            {language === 'ka' ? 'ენდობიან ადამიანები ' : language === 'ru' ? 'Нам доверяют люди ' : 'Trusted by People '}<span className="gradient-text">{language === 'ka' ? 'მთელ მსოფლიოში' : language === 'ru' ? 'по всему миру' : 'Worldwide'}</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-xl mx-auto">
            {language === 'ka' ? 'ნახეთ როგორ ეხმარება Wishyfy ადამიანებს სამუდამო მოგონებების შექმნაში.' : language === 'ru' ? 'Посмотрите, как Wishyfy помогает людям создавать вечные воспоминания с каждой цифровой открыткой.' : 'See how Wishyfy is helping people create lasting memories one digital card at a time.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {Array.isArray(reviews) && reviews.map((r, i) => (
            <div
              key={i}
              className="fade-in-section bg-gradient-to-br from-slate-50 to-purple-50 rounded-3xl p-6 border border-slate-100 shadow-md card-hover"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-6 italic">"{r.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-200 to-pink-200 flex items-center justify-center text-2xl">
                  {r.avatar}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{r.name}</div>
                  <div className="text-sm text-slate-400">{r.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
