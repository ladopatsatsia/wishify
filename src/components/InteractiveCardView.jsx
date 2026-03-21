import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cardsData } from '../data/cardsData';
import { useLanguage } from '../context/LanguageContext';

const API_BASE_URL = 'http://localhost:5153/api/cards';

// Look up a card from local cardsData by ID (searches all categories)
function findLocalCard(cardId, categoryId) {
  if (categoryId && cardsData[categoryId]) {
    const found = cardsData[categoryId].find(c => c.id === cardId);
    if (found) return found;
  }
  for (const cat of Object.values(cardsData)) {
    const found = cat.find(c => c.id === cardId);
    if (found) return found;
  }
  return null;
}

export default function InteractiveCardView({ previewData, onBackToEdit }) {
  const { cardId, categoryId } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(previewData || null);
  const [loading, setLoading] = useState(!previewData);
  const [error, setError] = useState(null);
  const { language } = useLanguage();
  const [magicClicked, setMagicClicked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (previewData) {
      setCard(previewData);
      setLoading(false);
      return;
    }

    if (cardId) {
      const fetchCard = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/${cardId}`);
          if (!res.ok) throw new Error('Card not found');
          const data = await res.json();
          setCard(data);
        } catch (err) {
          // Fallback to local cardsData
          const localCard = findLocalCard(cardId, categoryId);
          if (localCard) {
            setCard(localCard);
          } else {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchCard();
    } else {
      setLoading(false);
    }
  }, [cardId, categoryId, previewData]);

  const handleMagicClick = () => {
    setMagicClicked(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    
    // Transition to main content
    setTimeout(() => {
      setShowContent(true);
      startFireworks();
    }, 1000);
  };

  const startFireworks = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.015;
        this.size = Math.random() * 3 + 2;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.velocity.y += 0.1;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
      }
    }

    let particles = [];

    const createFirework = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height * 0.5);
      const colors = ["#ff6b6b","#4ecdc4","#45b7d1","#f9ca24","#6c5ce7","#a29bfe","#fd79a8"];
      const color = colors[Math.floor(Math.random()*colors.length)];

      for (let i = 0; i < 30; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          p.update();
          p.draw();
        }
      });

      if (Math.random() < 0.05) createFirework();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-12 h-12 border-4 border-violet-400 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center px-6">
          <div className="text-6xl mb-6 font-bold">🏜️</div>
          <h1 className="text-4xl font-black mb-4">{language === 'ka' ? 'ბარათი არ მოიძებნა!' : 'Card Missing!'}</h1>
          <p className="text-slate-400 mb-8 max-w-md">{language === 'ka' ? 'შესაძლოა ბარათს გაუვიდა ვადა ან ლინკი არასწორია.' : 'This card might have expired or the link is incorrect.'}</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition-all cursor-pointer"
          >
            {language === 'ka' ? 'შექმენი შენი საკუთარი ბარათი ✨' : 'Create Your Own Card ✨'}
          </button>
        </div>
      </div>
    );
  }

  const { heading, message1, message2, footer, audioUrl, templateId } = card;
  const style = card.style || card.template || {};
  const { bgGradient = 'from-indigo-600 to-violet-700', emoji = '✨' } = style;

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-1000 ${showContent ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-slate-900'}`}>
      
      {/* Magic Loading Card */}
      {!showContent && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-1000 ${magicClicked ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100'}`}>
           <div 
             onClick={handleMagicClick}
             className={`magic-card group cursor-pointer p-12 sm:p-20 rounded-[2.5rem] bg-gradient-to-br ${bgGradient} shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/20 transition-all hover:scale-105 active:scale-95 animate-float`}
           >
             <h2 className="text-3xl sm:text-5xl font-black text-white text-center drop-shadow-2xl">
               {language === 'ka' ? 'დააწკაპუნეთ ჯადოსნობისთვის ' : 'Click for Magic '}{emoji}
             </h2>
           </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`relative transition-opacity duration-1000 ${showContent ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

        {/* Back to Edit Button (only in preview mode) */}
        {onBackToEdit && (
          <button 
            onClick={onBackToEdit}
            className="fixed top-8 left-8 z-[110] bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2.5 rounded-full font-bold hover:bg-white/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            {language === 'ka' ? '← უკან დაბრუნება' : '← Back to Editor'}
          </button>
        )}

        <div className="relative z-20 max-w-5xl mx-auto px-6 py-20 min-h-screen flex flex-col items-center">
          
          {/* Header */}
          <div className="text-center mb-16 animate-in fade-in zoom-in duration-1000">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-violet-200 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-glow">
              {heading}
            </h1>
          </div>

           {/* Cards Container */}
          <div className="grid sm:grid-cols-2 gap-8 w-full mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <div className="p-10 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl hover:translate-y-[-10px] transition-transform">
              <h3 className="text-2xl font-bold text-white mb-4">{language === 'ka' ? 'განსაკუთრებული დღე' : 'A Special Day'}</h3>
              <p className="text-slate-200 text-lg leading-relaxed">
                {message1}
              </p>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl hover:translate-y-[-10px] transition-transform">
              <h3 className="text-2xl font-bold text-white mb-4">{language === 'ka' ? 'სურვილები შენთვის' : 'Wishes for You'}</h3>
              <p className="text-slate-200 text-lg leading-relaxed">
                {message2}
              </p>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="w-full mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 text-center">
             <h2 className="text-3xl font-bold text-white mb-10">{language === 'ka' ? 'განსაკუთრებული მოგონებები' : 'Special Memories'}</h2>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1,2,3,4].map(id => (
                  <div key={id} className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 hover:scale-105 transition-transform">
                    <img 
                      src={`https://picsum.photos/seed/${templateId || 'default'}-${cardId}-${id}/400/400`} 
                      className="w-full h-full object-cover" 
                      alt="Memory"
                    />
                  </div>
                ))}
             </div>
          </div>

          {/* Gift Box */}
          <div className="text-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700">
             <div 
               className="gift-box relative inline-block w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.4)] animate-gift-float hover:rotate-3 hover:scale-110 transition-all border-t border-white/30"
             >
                {/* Bow & Ribbon */}
                <div className="absolute top-1/2 left-0 w-full h-6 bg-yellow-400 translate-y-[-50%] shadow-inner" />
                <div className="absolute top-0 left-1/2 w-6 h-full bg-yellow-400 translate-x-[-50%] shadow-inner" />
                <div className="absolute top-[-10px] left-1/2 translate-x-[-50%] w-16 h-10 bg-yellow-400 rounded-full shadow-lg" />
             </div>
             <p className="text-white text-xl font-bold mt-10">
               {footer}
             </p>
          </div>

        </div>
      </div>

      <audio ref={audioRef} src={audioUrl} loop />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.6)); transform: scale(1.02); }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        @keyframes gift-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        .animate-gift-float {
          animation: gift-float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
