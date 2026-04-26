import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
// Trigger HMR to resolve npm install

export default function BirthdayCardPreview({ data, onClose, standalone, onPersonalize, onBack, onSave, onPurchase, saving, isSaved, onGoToSaved, isPublic, isReadOnly, showActions, onBackToEdit }) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const audioRef = useRef(null);
  const fireworksIntervalRef = useRef(null);

  const {
    title = 'Happy Birthday!',
    message = 'Wishing you a wonderful day full of happiness and joy!',
    signature = 'With Love ❤️',
    images = [],
    musicEnabled = false,
    musicFile = null,
    musicUrl = null,
    giftBoxEnabled = false,
    giftBoxUrl = '',
    style = {},
  } = data;

  const {
    bgGradient = 'from-pink-400 via-rose-400 to-violet-500',
    emoji = '🎂',
  } = style;

  const handleOpenCard = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsOpen(true);
      setIsFlipping(false);
      if (musicEnabled && audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
      }

      // Trigger continuous beautiful fireworks when card opens
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 300, colors: ['#ff0080', '#ff8c00', '#40e0d0', '#9932cc', '#ffd700'] };
      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      fireworksIntervalRef.current = setInterval(function() {
        const particleCount = 25;
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults, particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 350);
    }, 800);
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (fireworksIntervalRef.current) {
      clearInterval(fireworksIntervalRef.current);
    }
    setIsOpen(false);
    setIsFlipping(false);
    if (onClose) onClose();
    if (onBack) onBack();
  };

  const audioSrc = (musicFile instanceof Blob || musicFile instanceof File)
    ? URL.createObjectURL(musicFile)
    : musicUrl || null;

  useEffect(() => {
    return () => {
      if (musicFile) URL.revokeObjectURL(audioSrc);
      // Clean up the fireworks interval safely on unmount
      if (fireworksIntervalRef.current) {
        clearInterval(fireworksIntervalRef.current);
      }
    };
  }, [musicFile]);

  // STANDALONE PAGE MODE
  if (standalone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        {/* Top bar - Hide if it's a live published gift */}
        {!isPublic && (
          <div className="flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur border-b border-white/10 shrink-0">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 text-white/70 hover:text-white font-semibold transition-colors cursor-pointer"
            >
              <span>←</span> <span className="hidden sm:inline">{language === 'ka' ? 'უკან' : language === 'ru' ? 'Назад' : 'Back'}</span>
            </button>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {onPurchase && (
                <button
                  onClick={onPurchase}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm sm:text-base font-bold px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer ml-1 sm:ml-2"
                >
                  💳 <span>{language === 'ka' ? 'შეძენა' : 'Purchase'}</span>
                </button>
              )}
              {onPersonalize && (
                <button
                  onClick={onPersonalize}
                  className="bg-gradient-to-r from-slate-600 to-slate-800 text-white text-sm sm:text-base font-bold px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer ml-1 sm:ml-2"
                >
                  ✏️ <span className="hidden sm:inline">
                    {onPurchase 
                      ? (language === 'ka' ? 'რედაქტირება' : 'Edit') 
                      : (language === 'ka' ? 'შექმნა' : 'Create')
                    }
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        {audioSrc && <audio ref={audioRef} src={audioSrc} loop />}

        {/* Card area */}
        <div className={`flex-1 overflow-y-auto p-6 flex ${!isOpen ? 'items-center justify-center' : 'items-start justify-center pt-8 sm:pt-12 pb-24'}`}>
          {!isOpen ? (
            /* CLOSED CARD */
            <div style={{ perspective: '1200px' }}>
              <div
                className={`relative w-80 sm:w-96 h-[28rem] sm:h-[32rem] rounded-3xl shadow-2xl overflow-hidden transition-transform duration-700 ${
                  isFlipping ? 'card-flip-open' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${bgGradient} flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-white/20`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-12 -mb-12 blur-2xl" />

                  <div className="text-8xl mb-6 animate-bounce-slow drop-shadow-2xl">{emoji}</div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white text-center drop-shadow-lg leading-tight mb-4">
                    {title}
                  </h2>
                  <p className="text-white/80 text-sm text-center mb-8 max-w-xs">
                    {language === 'ka' ? 'დააწკაპუნეთ ბარათის გასახსნელად...' : language === 'ru' ? 'Нажмите, чтобы увидеть, что внутри...' : "Tap to reveal what's inside..."}
                  </p>

                  <button
                    onClick={handleOpenCard}
                    className="bg-white text-slate-800 font-bold px-8 py-3.5 rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all text-base flex items-center gap-2 animate-pulse-slow cursor-pointer"
                  >
                    <span>✨</span> {language === 'ka' ? 'გახსენი ბარათი' : language === 'ru' ? 'Открыть открытку' : 'Open Card'}
                  </button>

                  {musicEnabled && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur border border-white/30 rounded-full px-4 py-1.5 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white text-xs font-semibold">{language === 'ka' ? 'მუსიკა მზადაა' : language === 'ru' ? 'Музыка готова' : 'Music Ready'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* OPEN CARD */
            <div className="w-full max-w-3xl mx-auto animate-card-reveal">
              <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className={`bg-gradient-to-r ${bgGradient} p-10 text-center relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="text-6xl mb-4 drop-shadow-xl">{emoji}</div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">{title}</h1>
                </div>

                {/* Body */}
                <div className="p-8 sm:p-12 space-y-8">
                  <div className="text-center">
                    <p className="text-lg sm:text-xl text-slate-700 leading-relaxed whitespace-pre-line">
                      {message}
                    </p>
                  </div>

                  {/* Image Gallery */}
                  {images.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider text-center">
                        {language === 'ka' ? '📸 განსაკუთრებული წამები' : language === 'ru' ? '📸 Особые моменты' : '📸 Special Moments'}
                      </h3>
                      <div className="flex flex-wrap justify-center gap-3">
                        {images.map((img, i) => {
                          const imgSrc = typeof img === 'string' ? img : URL.createObjectURL(img);
                          return (
                            <div
                              key={i}
                              onClick={() => setSelectedImage(imgSrc)}
                              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md border-[3px] border-slate-100 hover:scale-[1.05] hover:shadow-lg transition-all cursor-pointer"
                            >
                              <img
                                src={imgSrc}
                                alt={`Memory ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Signature */}
                  <div className="text-center pt-4 border-t border-slate-100">
                    <p className="text-xl font-bold text-slate-600 italic">{signature}</p>
                  </div>

                  {/* Gift Box */}
                  {giftBoxEnabled && giftBoxUrl && (
                    <div className="text-center pt-6">
                      <p className="text-sm text-slate-400 font-semibold mb-4">{language === 'ka' ? '🎁 განსაკუთრებული საჩუქარი შენთვის!' : language === 'ru' ? '🎁 Особенный подарок для тебя!' : '🎁 A special gift for you!'}</p>
                      <a href={giftBoxUrl} target="_blank" rel="noopener noreferrer" className="inline-block animate-gift-float">
                        <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:scale-110 transition-all cursor-pointer border-t border-white/30">
                          <div className="absolute top-1/2 left-0 w-full h-4 bg-yellow-400 -translate-y-1/2" />
                          <div className="absolute top-0 left-1/2 w-4 h-full bg-yellow-400 -translate-x-1/2" />
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-8 bg-yellow-400 rounded-full shadow-md" />
                        </div>
                        <p className="text-violet-400 font-bold mt-3 text-sm">{language === 'ka' ? 'დააწკაპუნეთ საჩუქრის გასახსნელად! 🎁' : language === 'ru' ? 'Нажми, чтобы открыть подарок! 🎁' : 'Click to open your gift! 🎁'}</p>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {musicEnabled && audioSrc && (
                <div className="text-center mt-6">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold">{language === 'ka' ? '🎵 მუსიკა უკრავს...' : language === 'ru' ? '🎵 Музыка играет...' : '🎵 Music is playing...'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <style>{`
          @keyframes card-flip {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(-180deg); opacity: 0; }
          }
          .card-flip-open { animation: card-flip 0.8s ease-in-out forwards; }
          @keyframes card-reveal {
            0% { opacity: 0; transform: scale(0.8) translateY(40px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-card-reveal { animation: card-reveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
          .animate-bounce-slow { animation: bounce-slow 2.5s ease-in-out infinite; }
          @keyframes pulse-slow {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
            50% { box-shadow: 0 0 0 12px rgba(255,255,255,0); }
          }
          .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
          @keyframes gift-float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }
          .animate-gift-float { animation: gift-float 3s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  // MODAL MODE (used when called from editor preview)
  return (
    <div className={`fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex ${!isOpen ? 'items-center' : 'items-start py-12 sm:py-16'} justify-center p-4 overflow-y-auto`}>
      {/* Red X Back Button (Top Left) - Invitation Style */}
      {onBackToEdit && (
        <button 
          onClick={handleClose}
          className="fixed top-6 left-6 z-[230] w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all cursor-pointer shadow-2xl active:scale-90 border-2 border-white ring-4 ring-red-600/20"
          title={language === 'ka' ? 'უკან' : 'Back'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Fixed Bottom Footer for Preview Mode - Invitation Style */}
      {onBackToEdit && (
        <div className="fixed bottom-0 left-0 right-0 z-[220] bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-500">
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-4">
            {isSaved ? (
              <button 
                onClick={onGoToSaved}
                className="bg-emerald-500 text-white font-black px-12 py-3.5 rounded-2xl flex items-center gap-2 shadow-xl shadow-emerald-500/20 animate-in zoom-in duration-300 text-sm cursor-pointer hover:opacity-90 transition-all"
              >
                📂 {language === 'ka' ? 'შენახულ ბარათებში გადასვლა' : 'Go to Saved Cards'}
              </button>
            ) : (
              <>
                <button 
                  onClick={onSave}
                  disabled={saving || isReadOnly}
                  className={`flex-1 max-w-[200px] py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black hover:opacity-90 transition shadow-xl shadow-amber-500/20 disabled:opacity-50 active:scale-95 text-sm cursor-pointer ${isReadOnly ? 'from-slate-400 to-slate-500 shadow-none !cursor-not-allowed' : ''}`}
                >
                  {saving ? (language === 'ka' ? 'ინახება...' : 'Saving...') : (language === 'ka' ? 'შენახვა' : 'Save')}
                </button>
                {!isReadOnly && onPurchase && (
                  <button 
                    onClick={onPurchase}
                    disabled={saving}
                    className="flex-1 max-w-[200px] py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black hover:opacity-90 transition shadow-xl shadow-emerald-500/20 disabled:opacity-50 active:scale-95 text-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    💳 {language === 'ka' ? 'შეძენა' : 'Purchase'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {audioSrc && <audio ref={audioRef} src={audioSrc} loop />}

      {!isOpen ? (
        /* CLOSED CARD */
        <div style={{ perspective: '1200px' }}>
          <div
            className={`relative w-80 sm:w-96 h-[28rem] sm:h-[32rem] rounded-3xl shadow-2xl overflow-hidden transition-transform duration-700 ${
              isFlipping ? 'card-flip-open' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${bgGradient} flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-white/20`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-12 -mb-12 blur-2xl" />

              <div className="text-8xl mb-6 animate-bounce-slow drop-shadow-2xl">{emoji}</div>
              <h2 className="text-3xl sm:text-4xl font-black text-white text-center drop-shadow-lg leading-tight mb-4">
                {title}
              </h2>
              <p className="text-white/80 text-sm text-center mb-8 max-w-xs">
                {language === 'ka' ? 'დააწკაპუნეთ ბარათის გასახსნელად...' : language === 'ru' ? 'Нажмите, чтобы увидеть, что внутри...' : "Tap to reveal what's inside..."}
              </p>

              <button
                onClick={handleOpenCard}
                className="bg-white text-slate-800 font-bold px-8 py-3.5 rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all text-base flex items-center gap-2 animate-pulse-slow cursor-pointer"
              >
                <span>✨</span> {language === 'ka' ? 'გახსენი ბარათი' : language === 'ru' ? 'Открыть открытку' : 'Open Card'}
              </button>

              {musicEnabled && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur border border-white/30 rounded-full px-4 py-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white text-xs font-semibold">{language === 'ka' ? 'მუსიკა მზადაა' : language === 'ru' ? 'Музыка готова' : 'Music Ready'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* OPEN CARD */
        <div className="w-full max-w-3xl mx-auto animate-card-reveal py-8">
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
            {/* Header */}
            <div className={`bg-gradient-to-r ${bgGradient} p-10 text-center relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="text-6xl mb-4 drop-shadow-xl">{emoji}</div>
              <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">{title}</h1>
            </div>

            {/* Body */}
            <div className="p-8 sm:p-12 space-y-8">
              <div className="text-center">
                <p className="text-lg sm:text-xl text-slate-700 leading-relaxed whitespace-pre-line">
                  {message}
                </p>
              </div>

              {images.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider text-center">
                    {language === 'ka' ? '📸 განსაკუთრებული წამები' : language === 'ru' ? '📸 Особые моменты' : '📸 Special Moments'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-slate-100 hover:scale-[1.02] transition-transform"
                      >
                        <img
                          src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                          alt={`Memory ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center pt-4 border-t border-slate-100">
                <p className="text-xl font-bold text-slate-600 italic">{signature}</p>
              </div>

              {giftBoxEnabled && giftBoxUrl && (
                <div className="text-center pt-6">
                  <p className="text-sm text-slate-400 font-semibold mb-4">{language === 'ka' ? '🎁 განსაკუთრებული საჩუქარი შენთვის!' : language === 'ru' ? '🎁 Особенный подарок для тебя!' : '🎁 A special gift for you!'}</p>
                  <a href={giftBoxUrl} target="_blank" rel="noopener noreferrer" className="inline-block animate-gift-float">
                    <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:scale-110 transition-all cursor-pointer border-t border-white/30">
                      <div className="absolute top-1/2 left-0 w-full h-4 bg-yellow-400 -translate-y-1/2" />
                      <div className="absolute top-0 left-1/2 w-4 h-full bg-yellow-400 -translate-x-1/2" />
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-8 bg-yellow-400 rounded-full shadow-md" />
                    </div>
                    <p className="text-violet-600 font-bold mt-3 text-sm">{language === 'ka' ? 'დააწკაპუნეთ საჩუქრის გასახსნელად! 🎁' : language === 'ru' ? 'Нажми, чтобы открыть подарок! 🎁' : 'Click to open your gift! 🎁'}</p>
                  </a>
                </div>
              )}
            </div>
          </div>

          {musicEnabled && audioSrc && (
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold">{language === 'ka' ? '🎵 მუსიკა უკრავს...' : language === 'ru' ? '🎵 Музыка играет...' : '🎵 Music is playing...'}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes card-flip {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-180deg); opacity: 0; }
        }
        .card-flip-open { animation: card-flip 0.8s ease-in-out forwards; }
        @keyframes card-reveal {
          0% { opacity: 0; transform: scale(0.8) translateY(40px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-card-reveal { animation: card-reveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2.5s ease-in-out infinite; }
        @keyframes pulse-slow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(255,255,255,0); }
        }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        @keyframes gift-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
          .animate-gift-float { animation: gift-float 3s ease-in-out infinite; }
        `}</style>
      
        {/* Photo Gallery Lightbox (shared between both modes) */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 text-white text-4xl hover:scale-110 transition-transform cursor-pointer">
              ×
            </button>
            <img 
              src={selectedImage} 
              alt="Gallery Enlarge" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
  );
}
