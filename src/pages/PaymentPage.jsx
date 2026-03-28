import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { normalizeScheduleDraft } from '../components/profile/scheduleUtils';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { language } = useLanguage();

  const {
    cardId,
    slug,
    schedule: incomingSchedule,
    isAutoSend,
    recipient,
    sendMethod,
    scheduledDate,
    scheduledTime
  } = location.state || {};

  const schedule = normalizeScheduleDraft(
    incomingSchedule || {
      isAutoSend,
      recipient,
      sendMethod,
      scheduledDate,
      scheduledTime
    }
  );

  const [step, setStep] = useState('checkout');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!cardId || !slug) navigate('/profile/saved');
  }, [cardId, slug, navigate]);

  const handlePay = async () => {
    setStep('processing');
    setError('');

    await new Promise(r => setTimeout(r, 1800));

    try {
      const response = await fetch(`https://localhost:44328/api/cards/${cardId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          urlSlug: slug,
          schedule
        })
      });

      if (!response.ok) throw new Error('Failed to publish');

      setStep('success');
      setTimeout(() => navigate('/profile/published'), 2500);
    } catch (err) {
      setError(language === 'ka' ? 'რაღაც შეფერხდა. გთხოვთ სცადოთ თავიდან.' : language === 'ru' ? 'Что-то пошло не так. Пожалуйста, попробуйте еще раз.' : 'Something went wrong. Please try again.');
      setStep('checkout');
    }
  };

  const hostname = window.location.host;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center p-4">
      {step === 'success' ? (
        <div className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-sm w-full text-center animate-bounce-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-black text-slate-800 mb-3">{language === 'ka' ? 'ბარათი გამოქვეყნდა!' : language === 'ru' ? 'Открытка опубликована!' : 'Card is Live!'}</h2>
          <p className="text-slate-500 font-medium mb-2">{language === 'ka' ? 'თქვენი საჩუქარი უკვე ხელმისაწვდომია აქ:' : language === 'ru' ? 'Ваш подарок теперь доступен по адресу:' : 'Your gift is now live at:'}</p>
          <div className="bg-violet-50 rounded-xl px-4 py-3 font-mono text-violet-700 font-bold text-sm break-all mb-6">
            http://{slug}.{hostname}
          </div>
          <p className="text-slate-400 text-sm animate-pulse">{language === 'ka' ? 'გადამისამართება გამოქვეყნებულ ბარათებზე…' : language === 'ru' ? 'Перенаправление к вашим опубликованным открыткам…' : 'Redirecting to your published cards…'}</p>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl p-8 max-w-md w-full flex flex-col gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">💎</div>
            <h1 className="text-2xl font-black text-white">{language === 'ka' ? 'გამოაქვეყნეთ თქვენი საჩუქრის ბარათი' : language === 'ru' ? 'Опубликуйте вашу подарочную открытку' : 'Publish Your Gift Card'}</h1>
            <p className="text-white/50 text-sm mt-1">{language === 'ka' ? 'ერთჯერადი პრემიუმ გამოქვეყნების საფასური' : language === 'ru' ? 'Единоразовый взнос за премиум-публикацию' : 'One-time premium publishing fee'}</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-5 flex flex-col gap-3 border border-white/10">
            <div className="flex justify-between text-white/70 text-sm">
              <span>{language === 'ka' ? 'ბარათის ID' : language === 'ru' ? 'ID открытки' : 'Card ID'}</span>
              <span className="font-mono text-xs text-white/40">{cardId?.slice(0, 8)}…</span>
            </div>
            <div className="flex justify-between text-white/70 text-sm">
              <span>{language === 'ka' ? 'თქვენი ლაივ ლინკი' : language === 'ru' ? 'Ваш живой URL' : 'Your Live URL'}</span>
              <span className="font-mono text-violet-300 text-xs break-all text-right max-w-[60%]">
                {slug}.{hostname}
              </span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between font-black text-white text-lg">
              <span>{language === 'ka' ? 'ჯამი' : language === 'ru' ? 'Итого' : 'Total'}</span>
              <span className="text-emerald-400">$4.99</span>
            </div>
            {schedule.isAutoSend && (
              <>
                <div className="border-t border-white/10 pt-3 flex justify-between text-white/70 text-sm gap-4">
                  <span>{language === 'ka' ? 'გაგზავნის მეთოდი' : language === 'ru' ? 'Способ отправки' : 'Delivery Method'}</span>
                  <span className="font-bold text-white capitalize">{schedule.sendMethod}</span>
                </div>
                <div className="flex justify-between text-white/70 text-sm gap-4">
                  <span>{language === 'ka' ? 'მიმღები' : language === 'ru' ? 'Получатель' : 'Recipient'}</span>
                  <span className="font-bold text-white text-right break-all">{schedule.recipient}</span>
                </div>
                <div className="flex justify-between text-white/70 text-sm gap-4">
                  <span>{language === 'ka' ? 'გეგმით დრო' : language === 'ru' ? 'Время отправки' : 'Scheduled For'}</span>
                  <span className="font-bold text-white text-right">{schedule.scheduledDate} {schedule.scheduledTime}</span>
                </div>
              </>
            )}
          </div>

          <div className="bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl p-5 shadow-xl shadow-violet-900/40">
            <div className="text-white/60 text-sm font-bold uppercase tracking-widest mb-6">{language === 'ka' ? 'გადახდის ბარათი' : language === 'ru' ? 'Платежная карта' : 'Payment Card'}</div>
            <div className="text-white font-mono text-lg tracking-widest mb-6">•••• •••• •••• 4242</div>
            <div className="flex justify-between text-white/70 text-xs font-bold">
              <span>{language === 'ka' ? 'მფლობელი' : language === 'ru' ? 'ВЛАДЕЛЕЦ' : 'CARDHOLDER'}</span>
              <span>{language === 'ka' ? 'ვადა' : language === 'ru' ? 'СРОК' : 'EXPIRES'}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-sm">
              <span>{user?.name || 'Your Name'}</span>
              <span>12/27</span>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm font-bold text-center">{error}</p>
          )}

          <button
            onClick={handlePay}
            disabled={step === 'processing'}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-black text-lg shadow-xl shadow-violet-900/40 hover:opacity-90 disabled:opacity-60 transition cursor-pointer flex items-center justify-center gap-2"
          >
            {step === 'processing' ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {language === 'ka' ? 'ქვეყნდება…' : language === 'ru' ? 'Публикация…' : 'Publishing…'}
              </>
            ) : (
              language === 'ka' ? '🔒 გადახდა და გამოქვეყნება — $4.99' : language === 'ru' ? '🔒 Оплатить и опубликовать — $4.99' : '🔒 Pay & Publish — $4.99'
            )}
          </button>

          <button
            onClick={() => navigate(-1)}
            disabled={step === 'processing'}
            className="text-white/30 text-sm font-bold hover:text-white/60 transition text-center cursor-pointer"
          >
            {language === 'ka' ? '← უკან დაბრუნება' : language === 'ru' ? '← Вернуться назад' : '← Go back'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes bounce-in {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.4s ease-out; }
      `}</style>
    </div>
  );
}
