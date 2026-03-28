import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  createEmptySchedule,
  getScheduleFromCard,
  normalizeRecipientInput,
  validateScheduleDraft,
} from './scheduleUtils';

export default function ScheduleManagementModal({ isOpen, card, onClose, onUpdate }) {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState(createEmptySchedule());

  useEffect(() => {
    if (isOpen && card) {
      setSchedule(getScheduleFromCard(card));
      setError('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, card]);

  if (!isOpen || !card) return null;

  const handleSave = async () => {
    setError('');

    const validationError = validateScheduleDraft(schedule, language);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5153/api/cards/${card.id}/schedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ schedule })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update schedule');
      }

      const updatedCard = await response.json();
      onUpdate(updatedCard);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 scrollbar-hide">
          <div className="text-center">
            <div className="text-5xl mb-3">🤖</div>
            <h2 className="text-2xl font-black text-slate-800">{language === 'ka' ? 'ავტომატური გაგზავნის მართვა' : language === 'ru' ? 'Управление авто-отправкой' : 'Manage Automatic Send'}</h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              {language === 'ka' ? 'დაგეგმეთ ან შეცვალეთ თქვენი ბარათის ავტომატური გაგზავნის პარამეტრები.' : language === 'ru' ? 'Запланируйте или измените настройки автоматической отправки вашей открытки.' : 'Schedule or change the delivery settings for your card.'}
            </p>
          </div>

          <div className="flex flex-col gap-4 p-5 border-2 border-slate-100 rounded-3xl bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">📅</span>
                <div>
                  <p className="text-sm font-black text-slate-800">
                    {language === 'ka' ? 'სტატუსი: ' : language === 'ru' ? 'Статус: ' : 'Status: '}
                    {schedule.isAutoSend
                      ? (language === 'ka' ? 'ჩართულია' : language === 'ru' ? 'Включено' : 'Enabled')
                      : (language === 'ka' ? 'გამორთულია' : language === 'ru' ? 'Выключено' : 'Disabled')}
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
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-4 border-t border-slate-200/50">
                <div className="flex bg-white/50 p-1 rounded-xl border border-slate-100 shadow-inner">
                  <button
                    onClick={() => {
                      setSchedule(current => ({ ...current, sendMethod: 'email', recipient: '' }));
                      setError('');
                    }}
                    className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${schedule.sendMethod === 'email' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    📧 Email
                  </button>
                  <button
                    onClick={() => {
                      setSchedule(current => ({ ...current, sendMethod: 'phone', recipient: '' }));
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
                    value={schedule.recipient}
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

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-bold text-center animate-shake leading-tight">
              {error}
            </div>
          )}

          <div className="bg-violet-50/50 border border-violet-100 rounded-2xl p-4 flex gap-3">
            <span className="text-xl shrink-0">💡</span>
            <p className="text-xs text-violet-700 font-medium leading-relaxed">
              {language === 'ka' ? 'ავტომატური გაგზავნა მოხდება ზუსტად შერჩეულ დროს. დარწმუნდით, რომ საკონტაქტო ინფორმაცია სწორია.' : language === 'ru' ? 'Автоматическая отправка произойдет точно в выбранное время. Убедитесь, что контактные данные верны.' : 'Automatic delivery happens exactly at the scheduled time. Ensure the contact details are correct.'}
            </p>
          </div>
        </div>

        <div className="p-8 pt-4 border-t border-slate-100 flex gap-3 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-slate-100 text-slate-500 font-bold hover:bg-slate-50 transition cursor-pointer"
          >
            {language === 'ka' ? 'დახურვა' : language === 'ru' ? 'Закрыть' : 'Close'}
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-black hover:bg-slate-800 disabled:opacity-50 transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {language === 'ka' ? 'შენახვა' : language === 'ru' ? 'Сохранить' : 'Save Changes'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modal-root'));
}
