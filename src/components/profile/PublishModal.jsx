import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function PublishModal({ isOpen, card, onClose, onProceed }) {
  const { language } = useLanguage();
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !card) return null;

  const handleSlugChange = (e) => {
    // Only allow URL-safe characters
    const value = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '');
    setSlug(value);
    setError('');
  };

  const handleProceed = () => {
    if (!slug.trim()) {
      setError(language === 'ka' ? 'გთხოვთ შეიყვანოთ მორგებული URL გაგრძელებამდე.' : language === 'ru' ? 'Пожалуйста, введите собственный URL перед продолжением.' : 'Please enter a custom URL before proceeding.');
      return;
    }
    onProceed(card.id, slug.trim());
  };

  const hostname = window.location.host; // e.g. localhost:5173

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 flex flex-col gap-6 animate-scale-in">

        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-3">🚀</div>
          <h2 className="text-2xl font-black text-slate-800">{language === 'ka' ? 'აირჩიეთ თქვენი ლაივ ლინკი' : language === 'ru' ? 'Выберите вашу живую ссылку' : 'Choose Your Live Link'}</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            {language === 'ka' ? 'თქვენი ბარათი გამოქვეყნდება მორგებულ მისამართზე.' : language === 'ru' ? 'Ваша открытка будет опубликована по специальному адресу.' : 'Your card will be published at a custom address.'}
          </p>
        </div>

        {/* URL Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-black uppercase tracking-widest text-slate-400">
            {language === 'ka' ? 'თქვენი მორგებული URL' : language === 'ru' ? 'Ваш собственный URL' : 'Your Custom URL'}
          </label>

          {/* Input + suffix */}
          <div className="flex items-center border-2 border-slate-100 rounded-2xl bg-slate-50 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-400/10 transition-all overflow-hidden">
            <input
              type="text"
              value={slug}
              onChange={handleSlugChange}
              placeholder="HBDLado"
              className="flex-1 bg-transparent px-4 py-3.5 text-slate-800 font-bold outline-none placeholder:text-slate-300 min-w-0"
              maxLength={40}
              autoFocus
            />
            <span className="pr-4 text-slate-400 text-sm font-bold whitespace-nowrap shrink-0">
              .{hostname}
            </span>
          </div>

          {/* Live preview */}
          {slug && (
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0" />
              <span className="text-xs text-slate-500 font-mono break-all">
                http://{slug}.{hostname}
              </span>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-xs font-bold">{error}</p>
          )}
        </div>

        {/* ⚠️ Creative One-Time Warning */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <span className="text-xl shrink-0 mt-0.5">⚡</span>
          <div>
            <p className="text-sm font-black text-amber-800 mb-1">
              {language === 'ka' ? 'ყურადღებით წაიკითხეთ გაგრძელებამდე' : language === 'ru' ? 'Прочитайте это перед продолжением — Внимание!' : 'Read This Before You Proceed — Attention!'}
            </p>
            <p className="text-xs text-amber-700 leading-relaxed">
              {language === 'ka' ? (
                  <>ბარათის გამოქვეყნება <strong>სამუდამოა</strong>. თქვენი ლინკი, დიზაინი, შეტყობინება — <em>შეინახება სამუდამოდ</em>. ჩასწორება შეუძლებელია. გამოქვეყნების ღილაკზე დაჭერისას თქვენი საჩუქარი ფიქსირდება. გონივრულად აირჩიეთ თქვენი URL. 💎</>
                ) : language === 'ru' ? (
                  <>Публикация открытки является <strong>окончательной</strong>. Ваша ссылка, ваш дизайн, ваше сообщение — <em>запечатаны навсегда</em>. Никаких правок. Никаких переделок. В тот момент, когда вы нажимаете «Опубликовать», ваш подарок застывает в цифровом камне. Выбирайте свой URL с умом. 💎</>
                ) : (
                  <>Once this card goes live, it's <strong>permanent</strong>. Your link, your design, your message — <em>sealed forever</em>. No edits. No do-overs. The moment you hit Publish, your gift is cast in digital stone. Choose your URL wisely. 💎</>
                )}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-slate-100 text-slate-500 font-bold hover:bg-slate-50 transition cursor-pointer"
          >
            {language === 'ka' ? 'გაუქმება' : language === 'ru' ? 'Отмена' : 'Cancel'}
          </button>
          <button
            onClick={handleProceed}
            disabled={!slug.trim()}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-violet-500/25 cursor-pointer"
          >
            {language === 'ka' ? 'გაგრძელება →' : language === 'ru' ? 'Продолжить →' : 'Process →'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}
