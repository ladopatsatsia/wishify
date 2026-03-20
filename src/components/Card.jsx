import { useNavigate } from 'react-router-dom';

export default function Card({ card, categoryId }) {
  const navigate = useNavigate();

  // Extract style properties with defaults
  const {
    bgGradient = 'from-slate-100 to-slate-200',
    emoji = '✨',
    title = 'Untitled Card',
    themeColor = 'violet',
    fontFamily = 'font-sans',
    layoutType = 'centered',
  } = card.style || {};

  return (
    <div
      onClick={() => navigate(card.customRoute || `/edit/${categoryId}/${card.id}`)}
      className={`group relative h-96 rounded-[2.5rem] overflow-hidden shadow-xl shadow-purple-100/30 border border-white cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 bg-gradient-to-br ${bgGradient} ${fontFamily}`}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 blur-xl" />

      {/* Card Body */}
      <div className="flex flex-col h-full p-8 text-center relative z-10">
        <div className="text-7xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 drop-shadow-xl animate-float">
          {emoji}
        </div>
        
        <h3 className="text-2xl font-black mb-3 leading-tight text-slate-800">
          {card.title || title}
        </h3>
        
        <p className="text-slate-600 text-sm font-medium leading-relaxed line-clamp-2 px-2">
          {card.content?.message1 || 'Tap to customize this magical message and send it to someone special!'}
        </p>

        {/* Action Buttons - Appear on Hover */}
        <div className="mt-auto grid grid-cols-1 gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(card.customRoute || `/view/${categoryId}/${card.id}`, '_blank');
            }}
            className="w-full h-11 rounded-xl bg-white/90 backdrop-blur text-slate-800 font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-white transition-colors flex items-center justify-center gap-2 border border-slate-200"
          >
            👀 Preview
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(card.customRoute || `/edit/${categoryId}/${card.id}`);
            }}
            className="w-full h-11 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            ✏️ Personalize
          </button>
        </div>
      </div>

      <div className="absolute top-4 left-4">
        {card.hasMusic !== false && (
          <div className="bg-white/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/40">
            <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-pulse" />
              Includes Music
            </span>
          </div>
        )}
      </div>

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
