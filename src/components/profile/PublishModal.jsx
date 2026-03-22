import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function PublishModal({ isOpen, card, onClose, onProceed }) {
  const { language } = useLanguage();
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [isAutoSend, setIsAutoSend] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [sendMethod, setSendMethod] = useState('email'); // 'email' or 'phone'

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSlug('');
      setError('');
      setIsAutoSend(false);
      setRecipient('');
      setScheduledDate('');
      setScheduledTime('');
      setSendMethod('email');
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, card?.id]);

  if (!isOpen || !card) return null;

  const handleSlugChange = (e) => {
    // Only allow URL-safe characters
    const value = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '');
    setSlug(value);
    setError('');
  };

  const handleProceed = () => {
    console.log("Publish Proceed Clicked:", { slug, isAutoSend, recipient, sendMethod, scheduledDate, scheduledTime });
    if (!slug.trim()) {
      setError(language === 'ka' ? 'გთხოვთ შეიყვანოთ მორგებული URL გაგრძელებამდე.' : language === 'ru' ? 'Пожалуйста, введите собственный URL перед продолжением.' : 'Please enter a custom URL before proceeding.');
      return;
    }
    
    if (isAutoSend) {
      if (!recipient.trim()) {
        setError(language === 'ka' ? 'გთხოვთ შეიყვანოთ მიმღების კონტაქტი.' : language === 'ru' ? 'Пожалуйста, введите контакт получателя.' : 'Please enter recipient contact.');
        return;
      }

      if (sendMethod === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipient)) {
          setError(language === 'ka' ? 'გთხოვთ შეიყვანოთ სწორი ელ-ფოსტა.' : language === 'ru' ? 'Пожалуйста, введите корректный Email.' : 'Please enter a valid email address.');
          return;
        }
      } else {
        // Phone validation (already prefixed at this point if it was 9 digits)
        const phoneRegex = /^\+995\d{9}$/;
        if (!phoneRegex.test(recipient)) {
          setError(language === 'ka' ? 'გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი (+995XXXXXXXXX).' : language === 'ru' ? 'Пожалуйста, введите корректный номер телефона (+995XXXXXXXXX).' : 'Please enter a valid phone number (+995XXXXXXXXX).');
          return;
        }
      }

      if (!scheduledDate || !scheduledTime) {
        setError(language === 'ka' ? 'გთხოვთ აირჩიოთ თარიღი და დრო.' : language === 'ru' ? 'Пожалуйста, выберите дату и время.' : 'Please select date and time.');
        return;
      }
    }

    onProceed(card.id, slug.trim(), {
      isAutoSend,
      recipient,
      sendMethod,
      scheduledDate,
      scheduledTime
    });
  };

  const hostname = window.location.host; // e.g. localhost:5173

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in overflow-hidden">
        
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 scrollbar-hide">
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

            {slug && (
              <div className="flex items-center gap-2 px-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                <span className="text-xs text-slate-500 font-mono break-all">
                  http://{slug}.{hostname}
                </span>
              </div>
            )}
          </div>

          {/* Automatic Send Card */}
          <div className="flex flex-col gap-4 p-4 border-2 border-slate-100 rounded-3xl bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🤖</span>
                <div>
                  <p className="text-sm font-black text-slate-800">
                    {language === 'ka' ? 'ავტომატური გაგზავნა' : language === 'ru' ? 'Автоматическая отправка' : 'Automatic Send'}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'ka' ? 'დაგეგმეთ ბარათის გაგზავნა' : language === 'ru' ? 'Запланируйте отправку открытки' : 'Schedule your card delivery'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setIsAutoSend(!isAutoSend);
                  setError('');
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${isAutoSend ? 'bg-violet-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAutoSend ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {isAutoSend && (
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-2 border-t border-slate-200/50">
                
                <div className="flex bg-white/50 p-1 rounded-xl border border-slate-100 shadow-inner">
                  <button
                    onClick={() => { setSendMethod('email'); setError(''); setRecipient(''); }}
                    className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${sendMethod === 'email' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    📧 Email
                  </button>
                  <button
                    onClick={() => { setSendMethod('phone'); setError(''); setRecipient(''); }}
                    className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${sendMethod === 'phone' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    📱 Phone
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
                    <span>{sendMethod === 'email' ? (language === 'ka' ? 'მიმღების Email' : 'Recipient Email') : (language === 'ka' ? 'ტელეფონის ნომერი' : 'Phone Number')}</span>
                    {sendMethod === 'phone' && <span className="text-[9px] text-emerald-500 font-bold px-1.5 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">GEO +995</span>}
                  </label>
                  <input
                    type={sendMethod === 'email' ? 'email' : 'text'}
                    value={recipient}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (sendMethod === 'phone') {
                        val = val.replace(/[^\d+]/g, '');
                        if (val.length === 9 && /^[5]\d{8}$/.test(val)) {
                          val = '+995' + val;
                        }
                      }
                      setRecipient(val);
                      setError('');
                    }}
                    placeholder={sendMethod === 'email' ? "lado@example.com" : "599 XXX XXX"}
                    className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-violet-400 transition-all shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {language === 'ka' ? 'თარიღი' : language === 'ru' ? 'Дата' : 'Date'}
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setScheduledDate(e.target.value);
                        setError('');
                      }}
                      className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-violet-400 transition-all shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {language === 'ka' ? 'დრო' : language === 'ru' ? 'Время' : 'Time'}
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => {
                        setScheduledTime(e.target.value);
                        setError('');
                      }}
                      className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-violet-400 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold text-center -mt-2">{error}</p>
          )}

          {/* Warning Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <span className="text-xl shrink-0 mt-0.5">⚡</span>
            <div>
              <p className="text-sm font-black text-amber-800 mb-1">
                {language === 'ka' ? 'ყურადღებით წაიკითხეთ გაგრძელებამდე' : language === 'ru' ? 'Прочитайте это перед продолжением — Внимание!' : 'Read This Before You Proceed — Attention!'}
              </p>
              <p className="text-xs text-amber-700 leading-relaxed text-pretty">
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
        </div>

        {/* Sticky Actions bar at bottom */}
        <div className="p-8 pt-4 border-t border-slate-100 flex gap-3 bg-white">
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
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
