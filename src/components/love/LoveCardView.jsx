import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function LoveCardView({ card, onBackToEdit }) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showHearts, setShowHearts] = useState(true);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  const { heading, message1, message2, footer, audioUrl, imagesJson } = card;
  const photo = imagesJson ? (typeof imagesJson === 'string' ? JSON.parse(imagesJson)[0] : imagesJson[0]) : null;

  // Floating Hearts Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Heart {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 15 + 10;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.swing = Math.random() * 2;
        this.swingSpeed = Math.random() * 0.05;
        this.angle = 0;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ff4d6d';
        ctx.translate(this.x + Math.sin(this.angle) * this.swing, this.y);
        
        ctx.beginPath();
        const d = this.size;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
        ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
        ctx.fill();
        ctx.restore();
      }
      update() {
        this.y -= this.speed;
        this.angle += this.swingSpeed;
        if (this.y < -50) this.reset();
      }
    }

    const hearts = Array.from({ length: 30 }, () => new Heart());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hearts.forEach(h => {
        h.update();
        h.draw();
      });
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
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current && audioUrl) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 flex items-center justify-center p-6 relative overflow-hidden font-serif">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      
      {/* Back to Edit Button */}
      {onBackToEdit && (
        <button 
          onClick={onBackToEdit}
          className="fixed top-8 left-8 z-[110] bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2.5 rounded-full font-bold hover:bg-white/40 transition-all flex items-center gap-2 cursor-pointer"
        >
          {language === 'ka' ? '← რედაქტირება' : '← Back to Editor'}
        </button>
      )}

      {/* Interactive Envelope Container */}
      <div className={`relative transition-all duration-1000 transform ${isOpen ? 'scale-110 translate-y-20 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        <div 
          onClick={handleOpen}
          className="envelope group relative w-80 h-56 bg-[#f8f9fa] shadow-[0_20px_50px_rgba(0,0,0,0.3)] cursor-pointer transition-transform hover:rotate-1 hover:scale-105"
        >
          {/* Envelope Flap */}
          <div className="absolute top-0 left-0 w-full h-0 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent border-t-[100px] border-t-[#dee2e6] z-20 group-hover:border-t-[#ced4da] transition-colors" />
          
          {/* Inner Shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-transparent opacity-20" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 p-6">
            <div className="text-4xl animate-bounce">💌</div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
               {language === 'ka' ? 'გახსენი სიყვარულით' : 'OPEN WITH LOVE'}
            </div>
            <div className="text-gray-900 font-extrabold italic text-lg leading-tight">
               {heading}
            </div>
          </div>
        </div>
      </div>

      {/* The Letter that slides out */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-1000 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[200px] pointer-events-none'}`}>
        <div className="max-w-2xl w-full bg-[#fdfaf6] p-10 sm:p-16 rounded-sm shadow-[0_30px_100px_rgba(0,0,0,0.4)] relative border-b-[20px] border-rose-100">
           {/* Decorative corner */}
           <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full opacity-50" />
           
           <div className="relative z-10 space-y-8 min-h-[400px] flex flex-col">
              <div className="text-rose-400 text-sm font-bold tracking-widest uppercase">
                 {new Date().toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              
              <h2 className="text-3xl sm:text-4xl text-gray-900 font-black italic tracking-tight">
                 {heading}
              </h2>

              <div className="text-gray-700 text-lg sm:text-xl leading-relaxed whitespace-pre-line italic">
                 {message1}
              </div>

              {photo && (
                <div className="relative group w-full max-w-sm mx-auto aspect-[4/3] bg-white p-3 shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                   <img src={photo} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" alt="Special Memory" />
                   <div className="absolute inset-0 border-8 border-white/30" />
                </div>
              )}

              <div className="text-gray-700 text-lg leading-relaxed italic">
                 {message2}
              </div>

              <div className="mt-auto pt-10 text-right">
                 <div className="text-rose-500 text-2xl font-black mb-1 italic tracking-tight">
                    {footer}
                 </div>
                 <div className="text-[10px] text-gray-400 uppercase tracking-widest font-black">
                   SENT FROM WISHIFY WITH ❤️
                 </div>
              </div>
           </div>

           {/* Heart Seal */}
           <div className="absolute bottom-10 left-10 text-4xl opacity-20">❤️</div>
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl} loop />

      <style>{`
        .envelope {
          transform-style: preserve-3d;
        }
        body {
          background-color: #f43f5e;
        }
      `}</style>
    </div>
  );
}
