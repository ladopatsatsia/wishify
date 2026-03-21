import { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

function useFadeIn(ref) {
// ... existing useFadeIn logic ...
}

export default function HowItWorks() {
  const ref = useRef(null);
  const { language, t } = useLanguage();
  
  // Custom hook usage (I'll keep the ref logic)
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

  const stepStyles = [
    { icon: '🎨', color: 'from-violet-400 to-purple-500', num: '01' },
    { icon: '✏️', color: 'from-pink-400 to-rose-500', num: '02' },
    { icon: '🚀', color: 'from-amber-400 to-orange-500', num: '03' },
  ];

  const steps = [
    { title: t('howItWorks.s1'), desc: t('howItWorks.s1_d') },
    { title: t('howItWorks.s2'), desc: t('howItWorks.s2_d') },
    { title: t('howItWorks.s3'), desc: t('howItWorks.s3_d') },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="fade-in-section text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {language === 'ka' ? '3 მარტივი ნაბიჯი' : '3 Simple Steps'}
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            {language === 'ka' ? 'როგორ ' : 'How it '}<span className="gradient-text">{language === 'ka' ? 'მუშაობს' : 'Works'}</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-xl mx-auto">
            {language === 'ka' ? 'ციფრული ბარათის გაგზავნა ჯერ ასეთი სახალისო არ ყოფილა. დიზაინიდან მიწოდებამდე წუთებში.' : 'Sending a digital greeting card has never been this fun. From design to delivery in minutes.'}
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-200 via-pink-200 to-amber-200 -translate-y-1/2 mx-32 z-0" />

          <div className="grid lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => (
              <div
                key={i}
                className="fade-in-section bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-100 card-hover text-center"
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stepStyles[i].color} flex items-center justify-center text-3xl shadow-lg mx-auto mb-5`}>
                  {stepStyles[i].icon}
                </div>
                <div className="text-6xl font-black text-slate-100 absolute top-4 right-6 select-none">{stepStyles[i].num}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
