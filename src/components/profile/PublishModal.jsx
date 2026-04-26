import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  createEmptySchedule,
  normalizeRecipientInput,
  normalizeScheduleDraft,
  validateScheduleDraft,
  getGuestCountFromCard,
} from './scheduleUtils';
import { CARDS_URL } from '../../api/config';

export default function PublishModal({ isOpen, card, onClose, onProceed }) {
  const { language } = useLanguage();
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [schedule, setSchedule] = useState(createEmptySchedule());
  const [checking, setChecking] = useState(false);
  const [isTaken, setIsTaken] = useState(false);
  const [debouncedSlug, setDebouncedSlug] = useState('');

  useEffect(() => {
    if (isOpen && card) {
      let draft = normalizeScheduleDraft(card);
      if (card?.templateId?.startsWith('i')) {
        draft.sendMethod = 'phone';
        if (draft.isAutoSend) {
          draft.recipient = 'GUESTS_LIST';
        }
      }
      setSchedule(draft);
      setSlug('');
      setIsTaken(false);
      setError('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, card]);

  useEffect(() => {
    if (schedule.isAutoSend && card?.templateId?.startsWith('i')) {
      if (schedule.sendMethod !== 'phone' || schedule.recipient !== 'GUESTS_LIST') {
        setSchedule(prev => ({
          ...prev,
          sendMethod: 'phone',
          recipient: 'GUESTS_LIST'
        }));
      }
    }
  }, [schedule.isAutoSend, card?.templateId]);

  // Debounce slug input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSlug(slug);
    }, 500);
    return () => clearTimeout(timer);
  }, [slug]);

  // Check slug availability
  useEffect(() => {
    const checkSlug = async () => {
      if (!debouncedSlug || debouncedSlug.length < 3 || !card) {
        setIsTaken(false);
        return;
      }
      
      setChecking(true);
      try {
        const response = await fetch(`${CARDS_URL}/slug/${debouncedSlug}`);
        if (response.status === 200) {
          // If 200, card with this slug was found, so it's taken
          const data = await response.json();
          // If it's the SAME card, it's NOT taken (though publish usually handles this)
          if (data.id === card.id) {
            setIsTaken(false);
          } else {
            setIsTaken(true);
          }
        } else {
          setIsTaken(false);
        }
      } catch (err) {
        console.error('Slug check failed:', err);
      } finally {
        setChecking(false);
      }
    };

    checkSlug();
  }, [debouncedSlug, card?.id]);

  if (!isOpen || !card) return null;

  const handleSlugChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '');
    setSlug(value);
    setError('');
  };

  const handleProceed = () => {
    if (isTaken) {
      setError(language === 'ka' ? 'ასეთი URL უკვე არსებობს, გთხოვთ აირჩიოთ სხვა.' : 'This URL is already taken, please choose another.');
      return;
    }

    const validationError = validateScheduleDraft(schedule, language, card.templateId?.startsWith('i') ? 'invitation' : 'generic');
    if (validationError) {
      setError(validationError);
      return;
    }

    onProceed(card.id, slug.trim(), schedule);
  };

  const guestCount = getGuestCountFromCard(card);
  const hostname = window.location.host;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 scrollbar-hide">
          <div className="text-center">
            <div className="text-5xl mb-3">🚀</div>
            <h2 className="text-2xl font-black text-slate-800">{language === 'ka' ? 'აირჩიეთ თქვენი ლაივ ლინკი' : language === 'ru' ? 'Выберите вашу живую ссылку' : 'Choose Your Live Link'}</h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              {language === 'ka' ? 'თქვენი ბარათი გამოქვეყნდება მორგებულ მისამართზე.' : language === 'ru' ? 'Ваша открытка будет опубликована по специальному адресу.' : 'Your card will be published at a custom address.'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-black uppercase tracking-widest text-slate-400">
              {language === 'ka' ? 'თქვენი მორგებული URL' : language === 'ru' ? 'Ваш собственный URL' : 'Your Custom URL'}
            </label>

            <div className={`flex items-center border-2 rounded-2xl bg-slate-50 transition-all overflow-hidden ${isTaken ? 'border-red-400 ring-4 ring-red-400/10' : 'border-slate-100 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-400/10'}`}>
              <input
                type="text"
                value={slug}
                onChange={handleSlugChange}
                placeholder="HBDLado"
                className="flex-1 bg-transparent px-4 py-3.5 text-slate-800 font-bold outline-none placeholder:text-slate-300 min-w-0"
                maxLength={40}
                autoFocus
              />
              {checking && (
                <div className="mr-3">
                  <span className="flex w-4 h-4 border-2 border-slate-300 border-t-violet-500 rounded-full animate-spin" />
                </div>
              )}
              <span className="pr-4 text-slate-400 text-sm font-bold whitespace-nowrap shrink-0">
                .{hostname}
              </span>
            </div>

            {isTaken && (
              <div className="flex items-center gap-1.5 px-1">
                <span className="text-red-500 text-[10px] font-black uppercase tracking-tight">
                  ⚠️ {language === 'ka' ? 'მისამართი დაკავებულია' : 'URL already taken'}
                </span>
              </div>
            )}

            {!isTaken && slug && !checking && (
              <div className="flex items-center gap-2 px-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                <span className="text-xs text-slate-500 font-mono break-all">
                  http://{slug}.{hostname}
                </span>
              </div>
            )}
          </div>

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
                  setSchedule(current => ({ ...current, isAutoSend: !current.isAutoSend }));
                  setError('');
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${schedule.isAutoSend ? 'bg-violet-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${schedule.isAutoSend ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {schedule.isAutoSend && (
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-2 border-t border-slate-200/50">
                {card.templateId?.startsWith('i') && (
                  <div className="flex bg-white/50 p-1 rounded-xl border border-slate-100 shadow-inner">
                    <button
                      onClick={() => {
                        setSchedule(current => ({ ...current, recipient: 'GUESTS_LIST' }));
                        setError('');
                      }}
                      className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${schedule.recipient === 'GUESTS_LIST' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      📋 Guest List ({guestCount})
                    </button>
                    <button
                      onClick={() => {
                        setSchedule(current => ({ ...current, recipient: '' }));
                        setError('');
                      }}
                      className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${schedule.recipient !== 'GUESTS_LIST' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      👤 Single Guest
                    </button>
                  </div>
                )}

                {(!card.templateId?.startsWith('i') || schedule.recipient !== 'GUESTS_LIST') ? (
                  <>
                    <div className="flex bg-white/50 p-1 rounded-xl border border-slate-100 shadow-inner">
                      <button
                        onClick={() => {
                          setSchedule(current => ({ ...current, sendMethod: 'email', recipient: schedule.recipient === 'GUESTS_LIST' ? '' : schedule.recipient }));
                          setError('');
                        }}
                        className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${schedule.sendMethod === 'email' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        📧 Email
                      </button>
                      <button
                        onClick={() => {
                          setSchedule(current => ({ ...current, sendMethod: 'phone', recipient: schedule.recipient === 'GUESTS_LIST' ? '' : schedule.recipient }));
                          setError('');
                        }}
                        className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${schedule.sendMethod === 'phone' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        📱 Phone
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
                        <span>{schedule.sendMethod === 'email' ? (language === 'ka' ? 'მიმღების Email' : 'Recipient Email') : (language === 'ka' ? 'ტელეფონის ნომერი' : 'Phone Number')}</span>
                        {schedule.sendMethod === 'phone' && <span className="text-[9px] text-emerald-500 font-bold px-1.5 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">GEO +995</span>}
                      </label>
                      <input
                        type={schedule.sendMethod === 'email' ? 'email' : 'text'}
                        value={schedule.recipient === 'GUESTS_LIST' ? '' : schedule.recipient}
                        onChange={(e) => {
                          setSchedule(current => ({
                            ...current,
                            recipient: normalizeRecipientInput(current.sendMethod, e.target.value),
                          }));
                          setError('');
                        }}
                        placeholder={schedule.sendMethod === 'email' ? 'lado@example.com' : '599 XXX XXX'}
                        className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-violet-400 transition-all shadow-sm"
                      />
                    </div>
                  </>
                ) : (
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                    <span className="text-xl">📋</span>
                    <div className="flex-1">
                      <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                        {language === 'ka' ? 'გაგზავნა სტუმრების სიაზე' : 'Send to Guest List'}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                        {language === 'ka' ? `ბარათი ავტომატურად გაიგზავნება მობილურზე ${guestCount} სტუმართან.` : `Card will be automatically sent to ${guestCount} guests via SMS.`}
                      </p>
                    </div>
                  </div>
                )}


                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {language === 'ka' ? 'თარიღი' : language === 'ru' ? 'Дата' : 'Date'}
                    </label>
                    <input
                      type="date"
                      value={schedule.scheduledDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setSchedule(current => ({ ...current, scheduledDate: e.target.value }));
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
                      value={schedule.scheduledTime}
                      onChange={(e) => {
                        setSchedule(current => ({ ...current, scheduledTime: e.target.value }));
                        setError('');
                      }}
                      className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-violet-400 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {error || (isTaken && !checking) ? (
            <p className="text-red-500 text-xs font-bold text-center -mt-2">{error || (language === 'ka' ? 'ასეთი URL უკვე არსებობს' : 'This URL already exists')}</p>
          ) : null}

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <span className="text-xl shrink-0 mt-0.5">⚡</span>
            <div>
              <p className="text-sm font-black text-amber-800 mb-1">
                {language === 'ka' ? 'ყურადღებით წაიკითხეთ გაგრძელებამდე' : language === 'ru' ? 'Прочитайте это перед продолжением — Внимание!' : 'Read This Before You Proceed — Attention!'}
              </p>
              <p className="text-xs text-amber-700 leading-relaxed text-pretty">
                {language === 'ka'
                  ? <>ბარათის გამოქვეყნება <strong>სამუდამოა</strong>. თქვენი ლინკი, თქვენი დიზაინი, თქვენი შეტყობინება - <em>შეინახება სამუდამოდ</em>. ცვლილება შეუძლებელია. გამოქვეყნების ღილაკზე დაჭერისას თქვენი საჩუქარი ფიქსირდება. გონივრულად აირჩიეთ თქვენი URL. 💎</>
                  : language === 'ru'
                    ? <>Публикация открытки является <strong>окончательной</strong>. Ваша ссылка, ваш дизайн, ваше сообщение - <em>запечатаны навсегда</em>. Никаких правок. Никаких переделок. В тот момент, когда вы нажимаете «Опубликовать», ваш подарок застывает в цифровом камне. Выбирайте свой URL с умом. 💎</>
                    : <>Once this card goes live, it&apos;s <strong>permanent</strong>. Your link, your design, your message - <em>sealed forever</em>. No edits. No do-overs. The moment you hit Publish, your gift is cast in digital stone. Choose your URL wisely. 💎</>}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 pt-4 border-t border-slate-100 flex gap-3 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-slate-100 text-slate-500 font-bold hover:bg-slate-50 transition cursor-pointer"
          >
            {language === 'ka' ? 'გაუქმება' : language === 'ru' ? 'Отмена' : 'Cancel'}
          </button>
          <button
            onClick={handleProceed}
            disabled={!slug.trim() || isTaken || checking}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-violet-500/25 cursor-pointer"
          >
            {checking ? (language === 'ka' ? 'მოწმდება...' : 'Checking...') : (language === 'ka' ? 'გაგრძელება →' : language === 'ru' ? 'Продолжить →' : 'Process →')}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
