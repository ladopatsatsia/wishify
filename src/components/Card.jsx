import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthRequiredModal from './AuthRequiredModal';
import { useLanguage } from '../context/LanguageContext';

export default function Card({ card, categoryId, hasPublishedCards }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { language } = useLanguage();

  if (!card) return null;

  // Pricing Logic: 10 GEL for first card, 20 GEL standard
  const isFirstCard = !user || !hasPublishedCards;
  const price = isFirstCard ? 10 : 20;

  // Extract style properties — handle both local shape (nested in style{}) and API shape (flat)
  const {
    bgGradient: styleBgGradient = '',
    emoji: styleEmoji = '',
    themeColor = 'violet',
    fontFamily = 'font-sans',
    layoutType = 'centered',
  } = card.style || {};

  const bgGradient = styleBgGradient || card.bgGradient || 'from-slate-100 to-slate-200';
  const emoji = styleEmoji || card.defaultEmoji || '✨';

  // Redesign: High-Fidelity Template Preview Engine
  const renderTemplateVisual = () => {
    if (card.id === 'i2') {
       return (
         <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
            {/* SVG Filter for Ornament Transparency */}
            <svg width="0" height="0" className="absolute">
              <filter id="thumb-transparency">
                <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 1 1 1 0 -0.4" />
              </filter>
            </svg>
            
            <div className="absolute inset-0 bg-[#050a1b]" />
            
            {/* Mini Ornaments */}
            <div className="absolute -top-4 -left-4 w-32 h-32 opacity-80" style={{ filter: 'url(#thumb-transparency) brightness(1.2) contrast(1.2)' }}>
               <img src="/assets/invitation/gold_bouquet.png" className="w-full h-full object-contain -rotate-12" alt="" />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-32 opacity-80" style={{ filter: 'url(#thumb-transparency) brightness(1.2) contrast(1.2)' }}>
               <img src="/assets/invitation/gold_bouquet.png" className="w-full h-full object-contain" alt="" />
            </div>

            {/* Typography Mockup */}
            <div className="relative z-10 text-center space-y-1">
               <div className="text-[6px] text-amber-500/60 uppercase tracking-[0.3em] font-black">Together with Families</div>
               <div className="text-3xl text-white drop-shadow-md" style={{ fontFamily: "'Great Vibes', cursive" }}>Liam & Adeline</div>
               <div className="w-8 h-[1px] bg-amber-500/30 mx-auto" />
               <div className="text-[5px] text-slate-400 uppercase tracking-widest font-black">Wedding Celebration</div>
            </div>
         </div>
       );
    }

    if (card.id === 'i1') {
       return (
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500">
            <div className="w-24 h-24 rounded-full border-2 border-white/30 flex items-center justify-center relative bg-white/10 backdrop-blur-sm">
               <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl flex items-center justify-center text-white text-2xl font-black italic">
                  W
               </div>
            </div>
            <div className="mt-4 text-center">
               <div className="text-[8px] text-white/80 uppercase tracking-[0.4em] font-black">Royal Invitation</div>
            </div>
         </div>
       );
    }

    // Default Emoji Style for other categories
    return (
      <div className="flex flex-col items-center">
        <div className="text-7xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 drop-shadow-xl animate-float">
          {emoji}
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={() => {
        if (!user) {
          setIsAuthModalOpen(true);
          return;
        }
        const cat = (categoryId && categoryId !== 'all') ? categoryId : (card.categoryId || 'birthday');
        const route = card.customRoute
          ? `${card.customRoute}${card.customRoute.includes('?') ? '&' : '?'}mode=edit`
          : `/edit/${cat}/${card.id}`;
        console.log("Card Navigation:", { route, cardId: card.id, categoryId: cat });
        navigate(route);
      }}
      className={`group relative h-96 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-purple-200/40 border border-white cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 bg-gradient-to-br ${bgGradient} ${fontFamily}`}
    >
      {/* Hanging Price Tag */}
      <div className="absolute top-0 right-10 z-30 pointer-events-none">
        <div className="relative group-hover:scale-110 transition-transform duration-500">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-300 drop-shadow-sm" />
          <div className="mt-2 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white shadow-lg flex flex-col items-center min-w-[70px]">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900 tracking-tighter">{price}</span>
              <span className="text-sm font-bold text-violet-600">₾</span>
            </div>
            {isFirstCard && (
              <div className="absolute -bottom-2 whitespace-nowrap bg-gradient-to-r from-pink-500 to-violet-500 text-[8px] font-black text-white px-2 py-0.5 rounded-full shadow-sm">
                {language === 'ka' ? 'პირველი ბარათი' : 'FIRST CARD'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Visual Area */}
      <div className="absolute inset-0">
          {renderTemplateVisual()}
      </div>

      {/* Card Info Overlay - Glassmorphism */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pt-20 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
        <div className="text-center">
            <h3 className="text-lg font-black mb-1 leading-tight text-slate-800">
              {card.title}
            </h3>
            <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-4">
              {categoryId || card.categoryId}
            </p>

            {/* Action Buttons - Appear on Hover */}
            <div className="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(card.customRoute || `/view/${categoryId}/${card.id}`, '_blank');
                }}
                className="h-10 rounded-xl bg-white text-slate-800 font-black text-[10px] uppercase tracking-wider shadow-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 border border-slate-200"
              >
                👀 {language === 'ka' ? 'ნახვა' : 'Preview'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!user) {
                    setIsAuthModalOpen(true);
                    return;
                  }
                  const cat = (categoryId && categoryId !== 'all') ? categoryId : (card.categoryId || 'birthday');
                  const route = card.customRoute
                    ? `${card.customRoute}${card.customRoute.includes('?') ? '&' : '?'}mode=edit`
                    : `/edit/${cat}/${card.id}`;
                  navigate(route);
                }}
                className="h-10 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                ✏️ {language === 'ka' ? 'შექმნა' : 'Personalize'}
              </button>
            </div>
        </div>
      </div>

      <div className="absolute top-4 left-4 z-30">
        {card.hasMusic !== false && (
          <div className="bg-white/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/40 shadow-sm">
            <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-pulse" />
              {language === 'ka' ? 'მუსიკა' : 'Music'}
            </span>
          </div>
        )}
      </div>

      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
