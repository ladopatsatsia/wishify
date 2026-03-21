import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { language } = useLanguage();

  const { cardId, slug } = location.state || {};

  const [step, setStep] = useState('checkout'); // 'checkout' | 'processing' | 'success'
  const [error, setError] = useState('');

  useEffect(() => {
    if (!cardId || !slug) navigate('/profile/saved');
  }, [cardId, slug, navigate]);

  const handlePay = async () => {
    setStep('processing');
    setError('');

    // Simulate payment delay
    await new Promise(r => setTimeout(r, 1800));

    try {
      // Publish the card and save the slug
      const response = await fetch(`http://localhost:5153/api/cards/${cardId}/publish`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}` 
        },
        body: JSON.stringify({ urlSlug: slug })
      });

      if (!response.ok) throw new Error('Failed to publish');

      setStep('success');

      // Auto-redirect after 2.5s
      setTimeout(() => navigate('/profile/published'), 2500);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setStep('checkout');
    }
  };

  const hostname = window.location.host;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center p-4">

      {step === 'success' ? (
        /* ─── Success ─── */
        <div className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-sm w-full text-center animate-bounce-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-black text-slate-800 mb-3">{language === 'ka' ? 'ბარათი გამოქვეყნდა!' : 'Card is Live!'}</h2>
          <p className="text-slate-500 font-medium mb-2">{language === 'ka' ? 'თქვენი საჩუქარი უკვე ხელმისაწვდომია აქ:' : 'Your gift is now live at:'}</p>
          <div className="bg-violet-50 rounded-xl px-4 py-3 font-mono text-violet-700 font-bold text-sm break-all mb-6">
            http://{slug}.{hostname}
          </div>
          <p className="text-slate-400 text-sm animate-pulse">{language === 'ka' ? 'გადამისამართება გამოქვეყნებულ ბარათებზე…' : 'Redirecting to your published cards…'}</p>
        </div>
      ) : (
        /* ─── Checkout ─── */
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl p-8 max-w-md w-full flex flex-col gap-6">

          {/* Header */}
          <div className="text-center">
            <div className="text-4xl mb-2">💎</div>
            <h1 className="text-2xl font-black text-white">{language === 'ka' ? 'გამოაქვეყნეთ თქვენი საჩუქრის ბარათი' : 'Publish Your Gift Card'}</h1>
            <p className="text-white/50 text-sm mt-1">{language === 'ka' ? 'ერთჯერადი პრემიუმ გამოქვეყნების საფასური' : 'One-time premium publishing fee'}</p>
          </div>

          {/* Summary */}
          <div className="bg-white/5 rounded-2xl p-5 flex flex-col gap-3 border border-white/10">
            <div className="flex justify-between text-white/70 text-sm">
              <span>{language === 'ka' ? 'ბარათის ID' : 'Card ID'}</span>
              <span className="font-mono text-xs text-white/40">{cardId?.slice(0,8)}…</span>
            </div>
            <div className="flex justify-between text-white/70 text-sm">
              <span>{language === 'ka' ? 'თქვენი ლაივ ლინკი' : 'Your Live URL'}</span>
              <span className="font-mono text-violet-300 text-xs break-all text-right max-w-[60%]">
                {slug}.{hostname}
              </span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between font-black text-white text-lg">
              <span>{language === 'ka' ? 'ჯამი' : 'Total'}</span>
              <span className="text-emerald-400">$4.99</span>
            </div>
          </div>

          {/* Card details (decorative) */}
          <div className="bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl p-5 shadow-xl shadow-violet-900/40">
            <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-6">{language === 'ka' ? 'გადახდის ბარათი' : 'Payment Card'}</div>
            <div className="text-white font-mono text-lg tracking-widest mb-6">•••• •••• •••• 4242</div>
            <div className="flex justify-between text-white/70 text-xs font-bold">
              <span>{language === 'ka' ? 'მფლობელი' : 'CARDHOLDER'}</span>
              <span>{language === 'ka' ? 'ვადა' : 'EXPIRES'}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-sm">
              <span>{user?.name || 'Your Name'}</span>
              <span>12/27</span>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm font-bold text-center">{error}</p>
          )}

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={step === 'processing'}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-black text-lg shadow-xl shadow-violet-900/40 hover:opacity-90 disabled:opacity-60 transition cursor-pointer flex items-center justify-center gap-2"
          >
            {step === 'processing' ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {language === 'ka' ? 'ქვეყნდება…' : 'Publishing…'}
              </>
            ) : (
              language === 'ka' ? '🔒 გადახდა და გამოქვეყნება — $4.99' : '🔒 Pay & Publish — $4.99'
            )}
          </button>

          <button
            onClick={() => navigate(-1)}
            disabled={step === 'processing'}
            className="text-white/30 text-sm font-bold hover:text-white/60 transition text-center cursor-pointer"
          >
            {language === 'ka' ? '← უკან დაბრუნება' : '← Go back'}
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
