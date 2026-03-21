import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function ReelBirthdayCardPreview({ 
  data, 
  onClose, 
  onSave, 
  saving, 
  isSaved, 
  onGoToSaved,
  standalone = false,
  isPublic = false,
  onPersonalize,
  onBack
}) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showTooltip, setShowTooltip] = useState('');
  const [cardOpened, setCardOpened] = useState(false);
  const audioRef = useRef(null);
  
  const { title, message, signature, images = [], musicEnabled, musicUrl, giftBoxEnabled, giftBoxUrl, style } = data;
  const { bgGradient = 'from-violet-900 via-purple-900 to-slate-900', emoji = '🎂' } = style || {};

  // Handle Autoplay and music
  useEffect(() => {
    if (musicEnabled && musicUrl && audioRef.current) {
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch(e => console.log('Audio play prevented', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted, musicEnabled, musicUrl]);

  // Initial confetti when card opens
  useEffect(() => {
    if (cardOpened) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [cardOpened]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    // Add pop animation or small confetti if desired
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowTooltip(language === 'ka' ? 'ლინკი დაკოპირდა!' : language === 'ru' ? 'Ссылка скопирована!' : 'Link Copied!');
      setTimeout(() => setShowTooltip(''), 2000);
    }
  };

  const handleComment = (e) => {
    e.stopPropagation();
    setShowTooltip(language === 'ka' ? 'კომენტარები გამორთულია' : language === 'ru' ? 'Комментарии отключены' : 'Comments Disabled');
    setTimeout(() => setShowTooltip(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white h-[100dvh] w-full overflow-hidden flex justify-center items-center">
      {/* Audio Element */}
      {musicEnabled && musicUrl && (
        <audio
          ref={audioRef}
          src={musicUrl}
          loop
          muted={isMuted}
          playsInline
        />
      )}

      {/* --- STANDALONE TOP BAR --- */}
      {standalone && !isPublic && (
        <div className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur border-b border-white/10 z-[200]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onBack) onBack();
              else navigate('/');
            }}
            className="flex items-center gap-2 text-white/70 hover:text-white font-semibold transition-colors cursor-pointer"
          >
            <span>←</span> <span className="hidden sm:inline">{language === 'ka' ? 'უკან' : language === 'ru' ? 'Назад' : 'Back'}</span>
          </button>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {onPersonalize && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPersonalize();
                }}
                className="bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm sm:text-base font-bold px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer ml-1 sm:ml-2"
              >
                ✏️ <span className="hidden sm:inline">{language === 'ka' ? 'შექმნა' : language === 'ru' ? 'Персонаალიზირება' : 'Personalize'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- EDITOR MODAL TOP BAR --- */}
      {!standalone && (
        <div className="fixed top-0 left-0 w-full z-[210] flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur border-b border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            {isSaved ? (
              <div className="flex items-center gap-2">
                <span className="bg-green-500/20 text-green-300 font-bold px-3 py-2 rounded-xl flex items-center border border-green-500/30 text-sm sm:text-base">
                  ✅ <span className="hidden sm:inline ml-1">{language === 'ka' ? 'წარმატებით შეინახა!' : language === 'ru' ? 'Успешно сохранено!' : 'Saved Successfully!'}</span>
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onGoToSaved(); }}
                  className="bg-white hover:bg-slate-100 text-violet-600 text-sm sm:text-base font-bold px-4 py-2 rounded-xl border border-white/20 shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  📂 <span className="hidden sm:inline">{language === 'ka' ? 'გადასვლა შენახულ ბარათებზე' : language === 'ru' ? 'Перейти к сохраненным открыткам' : 'Go to Saved Cards'}</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSave();
                }}
                disabled={saving}
                className="bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base font-bold px-4 py-2 rounded-xl border border-white/20 backdrop-blur transition-all flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {saving ? (
                  <>⏳ <span className="hidden sm:inline">{language === 'ka' ? 'ინახება...' : language === 'ru' ? 'Сохранение...' : 'Saving...'}</span></>
                ) : (
                  <>💾 <span className="hidden sm:inline">{language === 'ka' ? 'შენახვა' : language === 'ru' ? 'Сохранить' : 'Save'}</span></>
                )}
              </button>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClose && onClose(); onBack && onBack(); }}
            className="w-10 h-10 bg-white/20 backdrop-blur border border-white/30 rounded-full text-white font-bold text-xl hover:bg-white/40 transition-all flex items-center justify-center cursor-pointer shadow-lg"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Reel Container (9:16 aspect ratio roughly limit for desktop, full for mobile) */}
      <div className={`relative w-full h-full max-w-md mx-auto bg-gradient-to-br ${bgGradient} overflow-hidden shadow-2xl`}>

        {/* Video / Content Area */}
        <div className="absolute inset-0 overflow-y-auto px-6 pt-24 pb-40 flex flex-col items-center" style={{ scrollbarWidth: 'none' }}>
          {!cardOpened ? (
            <div 
              className="cursor-pointer group flex flex-col items-center justify-center h-full animate-bounce my-auto"
              onClick={(e) => {
                e.stopPropagation();
                setCardOpened(true);
                setIsMuted(false); // Unmute on interaction
              }}
            >
              <div className="w-40 h-32 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-2xl shadow-pink-500/50 flex flex-col items-center justify-center border-4 border border-white/20 relative overflow-hidden transition-transform group-hover:scale-105">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="text-6xl mb-2 filter drop-shadow-md">{emoji}</div>
              </div>
              <div className="mt-6 bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full text-sm font-bold shadow-lg border border-white/30 truncate max-w-[250px]">
                {language === 'ka' ? '👆 შეეხეთ გასახსნელად' : language === 'ru' ? '👆 Нажмите чтобы открыть' : '👆 Tap to Open'}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center space-y-8 animate-out fade-out slide-out-to-top duration-500 my-auto">
               <div className="text-6xl animate-bounce filter drop-shadow-lg">{emoji}</div>
               
               <h1 className="text-4xl font-black text-center leading-tight drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">
                 {title}
               </h1>
               
               {/* Gallery of images */}
               {images.length > 0 && (
                 <div className="w-full my-2">
                   <div className="grid grid-cols-2 gap-3">
                     {images.map((img, i) => (
                       <div key={i} className={`aspect-square rounded-2xl overflow-hidden shadow-xl border-2 border-white/20 ${images.length === 1 ? 'col-span-2 aspect-[4/3]' : ''}`}>
                         <img 
                           src={typeof img === 'string' ? img : URL.createObjectURL(img)} 
                           className="w-full h-full object-cover" 
                           alt={`Card Media ${i + 1}`} 
                         />
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               <p className="text-xl text-center font-medium leading-relaxed drop-shadow-md text-white/90 max-w-sm whitespace-pre-wrap px-2">
                 {message}
               </p>
               
               <p className="text-2xl font-caveat italic text-center drop-shadow mt-4 opacity-90">
                 {signature}
               </p>

               {/* Gift Box floating element */}
               {giftBoxEnabled && giftBoxUrl && (
                 <a 
                   href={giftBoxUrl} 
                   target="_blank" 
                   rel="noreferrer"
                   onClick={(e) => e.stopPropagation()}
                   className="mt-12 mb-8 relative group block"
                 >
                   <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-40 group-hover:opacity-60 transition rounded-full"></div>
                   <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full w-24 h-24 flex items-center justify-center text-5xl shadow-xl border-4 border-white/20 transform transition group-hover:scale-110 group-hover:-rotate-12 cursor-pointer relative z-10 mx-auto">
                     🎁
                   </div>
                   <div className="text-center mt-4 text-yellow-300 font-bold animate-pulse text-sm drop-shadow-md">
                     {language === 'ka' ? 'გახსენი საჩუქარი' : language === 'ru' ? 'Открыть подарок' : 'Open Gift'}
                   </div>
                 </a>
               )}
            </div>
          )}
        </div>

        {/* Right Action Menu */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center z-40">
           <button 
             onClick={handleLike}
             className="flex flex-col items-center gap-1 group cursor-pointer"
           >
             <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isLiked ? 'bg-rose-500' : 'bg-black/40 backdrop-blur-sm'} group-hover:scale-110`}>
               <span className={`text-2xl ${isLiked ? 'scale-125' : ''} transition-transform`}>❤️</span>
             </div>
             <span className="text-[11px] font-bold shadow-black drop-shadow-md">{isLiked ? '1' : '0'}</span>
           </button>

           <button 
             onClick={handleComment}
             className="flex flex-col items-center gap-1 group cursor-pointer"
           >
             <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-110">
               <span className="text-2xl">💬</span>
             </div>
             <span className="text-[11px] font-bold shadow-black drop-shadow-md">0</span>
           </button>

           <button 
             onClick={handleShare}
             className="flex flex-col items-center gap-1 group cursor-pointer"
           >
             <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-110">
               <span className="text-2xl">↗️</span>
             </div>
             <span className="text-[11px] font-bold shadow-black drop-shadow-md">{language === 'ka' ? 'გაზიარება' : language === 'ru' ? 'Поделиться' : 'Share'}</span>
           </button>

           {musicEnabled && (
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 setIsMuted(!isMuted);
               }}
               className="flex flex-col items-center gap-1 mt-4 group cursor-pointer"
             >
               <div className={`w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 border-2 ${isPlaying && !isMuted ? 'border-pink-500 animate-[spin_4s_linear_infinite]' : 'border-transparent'}`}>
                 <div className="w-full h-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center">
                   <span className="text-xl">🎵</span>
                 </div>
               </div>
               {!isPlaying || isMuted ? (
                 <span className="absolute -right-1 bottom-6 text-xl bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white border border-white">×</span>
               ) : null}
             </button>
           )}
        </div>

        {/* Bottom Overlay Info (Title & Sound Track) */}
        <div className="absolute left-4 bottom-4 right-20 z-40">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center font-bold text-xs border border-white box-border">
               {signature ? signature.charAt(0) : '🎉'}
             </div>
             <span className="font-bold text-[15px] shadow-black drop-shadow-md truncate">@{signature || 'Wishify'}</span>
           </div>
           
           <p className="text-sm shadow-black drop-shadow-md line-clamp-2 leading-tight opacity-90 mb-3">
             {title}. #happybirthday #celebration
           </p>

           <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full py-1 px-3 w-max max-w-full overflow-hidden">
             <span className="text-xs animate-[pulse_2s_infinite]">🎵</span>
             <span className="text-xs truncate font-medium">
               {musicEnabled ? (language === 'ka' ? 'ორიგინალური აუდიო' : language === 'ru' ? 'Оригинальное аудио' : 'Original Audio') : (language === 'ka' ? 'აუდიო გამორთულია' : language === 'ru' ? 'Аудио отключено' : 'No Audio')}
             </span>
           </div>
        </div>

        {/* Tooltip toast */}
        {showTooltip && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-3 rounded-2xl backdrop-blur-md z-50 animate-bounce shadow-xl font-bold">
            {showTooltip}
          </div>
        )}

        {/* Play/Pause Overlay Icon (visible briefly when toggled) */}
        {!isPlaying && cardOpened && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
             <div className="w-24 h-24 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-4xl shadow-2xl pl-2">
               ▶
             </div>
          </div>
        )}

        {/* Custom scrollbar hiding CSS specifically for Reel view */}
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
}
