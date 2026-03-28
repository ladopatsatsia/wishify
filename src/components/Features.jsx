import { useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

function useFadeIn(ref) {
// ... existing useFadeIn logic ...
}

export default function Features() {
  const ref = useRef(null);
  const { language, t } = useLanguage();
  useFadeIn(ref);

  const features = [
    {
      icon: '🎵',
      title: t('features.f1_title') || 'Custom Soundtracks',
      desc: t('features.f1_desc') || 'Choose from a curated library of magic tunes or upload your own to set the perfect mood.',
      color: 'bg-violet-100 text-violet-600',
    },
    {
      icon: '✏️',
      title: t('features.f2_title') || 'Real-time Editing',
      desc: t('features.f2_desc') || 'See your changes instantly with our live preview. What you see is what they get.',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: '📱',
      title: t('features.f3_title') || 'Mobile First',
      desc: t('features.f3_desc') || 'Every card is optimized for mobile phones, looking beautiful on any screen size.',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: '⚡',
      title: t('features.f4_title') || 'Instant Delivery',
      desc: t('features.f4_desc') || 'Send cards via link, email, or WhatsApp. No waiting, just instant joy.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: '🎨',
      title: t('features.f5_title') || 'Curated Designs',
      desc: t('features.f5_desc') || 'Expertly crafted templates for every life milestone and celebration.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: '💌',
      title: t('features.f6_title') || 'Endless Sharing',
      desc: t('features.f6_desc') || 'One card, infinite memories. Share with everyone you love in seconds.',
      color: 'bg-red-100 text-red-600',
    },
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="fade-in-section text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {language === 'ka' ? 'რატომ Wishyfy?' : language === 'ru' ? 'Почему Wishyfy?' : 'Why Wishyfy?'}
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            {language === 'ka' ? 'საკმარისია საყვარელი ადამიანის ' : language === 'ru' ? 'Все, что вам нужно, чтобы ' : 'Everything You Need to '}<span className="gradient-text">{language === 'ka' ? 'გასაოცებლად' : language === 'ru' ? 'удивить их' : 'Wow Them'}</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-xl mx-auto">
            {language === 'ka' ? 'სხვადასხვა დიზაინის მზა ბარათები.' : language === 'ru' ? 'Наш мощный редактор дает вам полный творческий контроль. Навыки дизайна не требуются.' : 'Our powerful editor gives you full creative control. No design skills required.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="fade-in-section bg-white rounded-3xl p-6 border border-slate-100 shadow-md card-hover"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center text-2xl mb-4`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
