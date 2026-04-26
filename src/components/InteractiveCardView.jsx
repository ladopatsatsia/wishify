import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cardsData } from '../data/cardsData';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { CARDS_URL } from '../api/config';
import MemoryCardView from './memory/MemoryCardView';
import LoveCardView from './love/LoveCardView';
import InvitationView from './invitation/InvitationView';
import PublishModal from './profile/PublishModal';

const CARDS_API = CARDS_URL;

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

export default function InteractiveCardView({ 
  previewData, 
  onBackToEdit, 
  subdomainSlug,
  onSave,
  onPurchase,
  onGoToSaved,
  saving,
  isSaved,
  guestPhone: propGuestPhone
}) {
  const { cardId, categoryId, guestPhone: urlGuestPhone } = useParams();
  const guestPhone = propGuestPhone || urlGuestPhone;
  const navigate = useNavigate();
  const [card, setCard] = useState(previewData || null);
  const [loading, setLoading] = useState(!previewData);
  const [error, setError] = useState(null);
  const { language, t } = useLanguage();
  const [magicClicked, setMagicClicked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const { user, loading: authLoading } = useAuth();
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  const handleInnerPurchase = () => {
    if (onPurchase) {
      onPurchase();
      return;
    }
    if (!card) return;
    setPublishModalOpen(true);
  };

  const startPublishProcess = (cardId, slug, scheduleData) => {
    setPublishModalOpen(false);
    navigate('/payment', { state: { cardId, slug, schedule: scheduleData } });
  };

  // Force actual reload when source changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [card?.audioUrl, card?.content?.audioUrl]);

  useEffect(() => {
    if (previewData) {
      setCard(previewData);
      setLoading(false);
      return;
    }

    if (cardId) {
      const fetchCard = async () => {
        try {
          const res = await fetch(`${CARDS_API}/${cardId}`, {
            headers: {
              ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
            }
          });
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
    } else if (subdomainSlug) {
      const fetchBySlug = async () => {
        try {
          const res = await fetch(`${CARDS_API}/slug/${subdomainSlug}`);
          if (!res.ok) throw new Error('Card not found or private');
          const data = await res.json();
          setCard(data);
        } catch (err) {
          console.error("Failed to fetch by slug", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBySlug();
    } else {
      setLoading(false);
    }
  }, [cardId, categoryId, previewData, subdomainSlug]);

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


  // ... (existing effects and magic click logic)

  const [loadingMessage, setLoadingMessage] = useState(language === 'ka' ? 'ჯადოსნობა მზადდება...' : 'Preparing the Magic...');

  useEffect(() => {
    if (!loading) return;
    const messages = language === 'ka' 
      ? ['სურვილები იტვირთება...', 'სურათები მუშავდება...', 'თითქმის მზადაა...']
      : ['Fetching wishes...', 'Processing photos...', 'Almost there...'];
    
    let i = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[i % messages.length]);
      i++;
    }, 2500);
    return () => clearInterval(interval);
  }, [loading, language]);

  if (loading || authLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-10 text-center">
        <div className="relative w-20 h-20 mb-8">
           <div className="absolute inset-0 w-full h-full border-4 border-violet-500/20 rounded-full" />
           <div className="absolute inset-0 w-full h-full border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="space-y-2">
          <div className="text-xl font-bold animate-pulse text-white">{loadingMessage}</div>
          <div className="text-xs font-black tracking-[0.3em] uppercase text-violet-400">
             {authLoading ? (language === 'ka' ? 'იდენტობის მოწმება...' : 'Verifying Identity...') : (language === 'ka' ? 'გთხოვთ დაელოდოთ' : 'Please wait')}
          </div>
        </div>
      </div>
    );
  }

  // Normalize card data for visibility check
  const isTemplate = !!card?.content; // Local templates have a nested 'content' object
  const isPublic = isTemplate || (card?.isPublic ?? card?.IsPublic ?? false);
  
  // Case-insensitive ID comparison for GUIDs (handle both creatorId and CreatorId)
  const cardCreatorId = (card?.creatorId || card?.CreatorId)?.toString()?.toLowerCase();
  const currentUserId = user?.id?.toString()?.toLowerCase();
  const isOwner = currentUserId && cardCreatorId === currentUserId;

  // Debugging ownership (will show in subagent log)
  if (!isPublic && !isOwner) {
    console.log("🔒 Access Blocked:", {
      cardId,
      cardCreatorId,
      currentUserId,
      isOwner,
      isPublic,
      user
    });
  }

  if (error || !card || (!isPublic && !previewData && !isOwner)) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center px-6">
          <div className="text-6xl mb-6 font-bold">🔒</div>
          <h1 className="text-4xl font-black mb-4">{language === 'ka' ? 'ბარათი ჯერ არ არის გამოქვეყნებული' : 'Card Not Published Yet'}</h1>
          <p className="text-slate-400 mb-8 max-w-md">{language === 'ka' ? 'გთხოვთ გამოაქვეყნოთ ბარათი პირადი კაბინეტიდან, რათა ლინკი გააქტიურდეს.' : 'Please publish the card from your cabinet to activate this link.'}</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition-all cursor-pointer"
          >
            {language === 'ka' ? 'მთავარ გვერდზე დაბრუნება ✨' : 'Go to Homepage ✨'}
          </button>
        </div>
      </div>
    );
  }

  const heading = card.heading ?? card.Heading;
  const message1 = card.message1 ?? card.Message1;
  const message2 = card.message2 ?? card.Message2;
  const footer = card.footer ?? card.Footer;
  const templateId = card.templateId ?? card.TemplateId;
  const imagesJson = card.imagesJson ?? card.ImagesJson;
  const audioUrl = card.audioUrl ?? card.AudioUrl ?? card.content?.audioUrl;

  // Helper to safely check if it's a memory card
  const isMemoryCard = () => {
    if (categoryId === 'memory') return true;
    if (!imagesJson) return false;
    try {
      // If it's already an object, use it; otherwise parse it
      const data = typeof imagesJson === 'string' ? JSON.parse(imagesJson) : imagesJson;
      return data && (data.type === 'memory' || data.galleries);
    } catch (e) {
      console.error("Memory card check failed:", e);
      return false;
    }
  };

  if (isMemoryCard()) {
    return (
      <>
        <MemoryCardView 
          card={card} 
          onBackToEdit={onBackToEdit} 
          onSave={onSave}
          onPurchase={onPurchase || (isOwner ? handleInnerPurchase : undefined)} 
          onGoToSaved={onGoToSaved}
          saving={saving}
          isSaved={isSaved}
        />
        <PublishModal
          isOpen={publishModalOpen}
          card={card}
          onClose={() => setPublishModalOpen(false)}
          onProceed={startPublishProcess}
          className="z-[200]" 
        />
      </>
    );
  }

  const isLoveCard = () => {
    if (categoryId === 'love') return true;
    if (card.templateId?.startsWith('l')) return true;
    return false;
  };

  if (isLoveCard()) {
    return (
      <>
        <LoveCardView 
          card={card} 
          onBackToEdit={onBackToEdit} 
          onSave={onSave}
          onPurchase={onPurchase || (isOwner ? handleInnerPurchase : undefined)} 
          onGoToSaved={onGoToSaved}
          saving={saving}
          isSaved={isSaved}
        />
        <PublishModal
          isOpen={publishModalOpen}
          card={card}
          onClose={() => setPublishModalOpen(false)}
          onProceed={startPublishProcess}
          className="z-[200]" 
        />
      </>
    );
  }

  const isInvitation = () => {
     if (categoryId === 'invitation') return true;
     if (card.templateId?.startsWith('i')) return true;
     return false;
  };

  if (isInvitation()) {
    return (
      <>
        <InvitationView 
          card={card} 
          onBackToEdit={onBackToEdit} 
          guestPhone={guestPhone} 
          onSave={onSave}
          onPurchase={onPurchase || (isOwner ? handleInnerPurchase : undefined)} 
          onGoToSaved={onGoToSaved}
          saving={saving}
          isSaved={isSaved}
        />
        <PublishModal
          isOpen={publishModalOpen}
          card={card}
          onClose={() => setPublishModalOpen(false)}
          onProceed={startPublishProcess}
          className="z-[200]" 
        />
      </>
    );
  }

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
               {language === 'ka' ? 'დააწკაპუნეთ ჯადოსნობისთვის ' : language === 'ru' ? 'Нажми для магии ' : 'Click for Magic '}{emoji}
             </h2>
           </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`relative transition-opacity duration-1000 ${showContent ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

        {/* --- PREVIEW ACTIONS --- */}
        {/* Red X Back Button (Top Left) - Invitation Style */}
        {onBackToEdit && (
          <button 
            onClick={onBackToEdit}
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
                    disabled={saving}
                    className="flex-1 max-w-[200px] py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black hover:opacity-90 transition shadow-xl shadow-amber-500/20 disabled:opacity-50 active:scale-95 text-sm cursor-pointer"
                  >
                    {saving ? (language === 'ka' ? 'ინახება...' : 'Saving...') : (language === 'ka' ? 'შენახვა' : 'Save')}
                  </button>
                  <button 
                    onClick={handleInnerPurchase}
                    disabled={saving}
                    className="flex-1 max-w-[200px] py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black hover:opacity-90 transition shadow-xl shadow-amber-500/20 disabled:opacity-50 active:scale-95 text-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    💳 {language === 'ka' ? 'შეძენა' : 'Purchase'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Owner Purchase Header (for saved cards viewed from profile) */}
        {isOwner && !isPublic && !onBackToEdit && (
          <div className="fixed top-0 left-0 w-full z-[110] flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur border-b border-white/10">
            <button
              onClick={() => navigate('/dashboard#saved')}
              className="flex items-center gap-2 text-white/70 hover:text-white font-semibold transition-colors cursor-pointer"
            >
              <span>←</span> <span className="hidden sm:inline">{language === 'ka' ? 'შენახულებში დაბრუნება' : 'Back to Saved'}</span>
            </button>
            <button
              onClick={handleInnerPurchase}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm sm:text-base font-bold px-6 py-2.5 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
            >
              💳 <span>{language === 'ka' ? 'შეძენა' : 'Purchase'}</span>
            </button>
          </div>
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
              <h3 className="text-2xl font-bold text-white mb-4">{language === 'ka' ? 'განსაკუთრებული დღე' : language === 'ru' ? 'Особенный день' : 'A Special Day'}</h3>
              <p className="text-slate-200 text-lg leading-relaxed">
                {message1}
              </p>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl hover:translate-y-[-10px] transition-transform">
              <h3 className="text-2xl font-bold text-white mb-4">{language === 'ka' ? 'სურვილები შენთვის' : language === 'ru' ? 'Пожелания для тебя' : 'Wishes for You'}</h3>
              <p className="text-slate-200 text-lg leading-relaxed">
                {message2}
              </p>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="w-full mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 text-center">
             <h2 className="text-3xl font-bold text-white mb-10">{language === 'ka' ? 'განსაკუთრებული მოგონებები' : language === 'ru' ? 'Особые воспоминания' : 'Special Memories'}</h2>
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

      <PublishModal
        isOpen={publishModalOpen}
        card={card}
        onClose={() => setPublishModalOpen(false)}
        onProceed={startPublishProcess}
        className="z-[200]" 
      />

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
