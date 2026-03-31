import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function MemoryCardView({ card, onBackToEdit }) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [activeGallery, setActiveGallery] = useState(0);

  useEffect(() => {
    if (card?.imagesJson) {
      try {
        const parsed = typeof card.imagesJson === 'string' 
          ? JSON.parse(card.imagesJson) 
          : card.imagesJson;
          
        if (parsed && (parsed.type === 'memory' || parsed.galleries)) {
          console.log("Memory data loaded:", parsed);
          setData(parsed);
        }
      } catch (e) {
        console.error("Failed to parse memory data", e);
      }
    }
  }, [card]);

  if (!data) return (
    <div className="h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-10 text-center">
      <div className="space-y-6">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="animate-pulse text-slate-400 font-black tracking-widest uppercase text-xs">
          {language === 'ka' ? 'მოგონებები მზადდება...' : 'PREPARING YOUR MEMORIES...'}
        </div>
      </div>
    </div>
  );

  const galleries = data.galleries || [];
  const currentGallery = galleries[activeGallery];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans selection:bg-teal-100 pb-20 overflow-x-hidden">
      
      {/* Back to Edit Button (Preview Mode) */}
      {onBackToEdit && (
        <button 
          onClick={onBackToEdit}
          className="fixed top-8 left-8 z-[110] bg-white/80 backdrop-blur-md border border-slate-200 text-slate-800 px-6 py-2.5 rounded-full font-bold hover:bg-white transition-all shadow-xl flex items-center gap-2 cursor-pointer"
        >
          {language === 'ka' ? '← რედაქტირება' : '← Back to Editor'}
        </button>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-teal-50" />
        
        <div className="relative space-y-8 max-w-4xl animate-in fade-in zoom-in duration-1000">
          <div className="text-teal-500 font-black tracking-[0.3em] text-xs md:text-sm uppercase mb-4">
             {language === 'ka' ? 'ჩვენი მოგონებების კოლექცია' : 'Our Collection of Memories'}
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-slate-900 leading-[0.9]">
            {data.headerText}
          </h1>
          <div className="h-20 w-px bg-slate-200 mx-auto mt-12 animate-bounce" />
          <div className="text-slate-400 font-medium italic text-lg">
            {language === 'ka' ? 'ჩამოწკაპუნეთ ამბის სანახავად' : 'Scroll to explore our story'}
          </div>
        </div>
      </section>

      {/* Gallery Sections */}
      <div className="max-w-7xl mx-auto px-6 space-y-32 mt-20">
        {galleries.map((gallery, idx) => (
          <section key={gallery.id || idx} className="space-y-12 reveal-section">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-8 gap-4">
               <div>
                 <span className="text-teal-500 font-black text-sm uppercase tracking-widest mb-2 block">
                    {language === 'ka' ? `სექცია 0${idx + 1}` : `SECTION 0${idx + 1}`}
                 </span>
                 <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                   {gallery.name}
                 </h2>
               </div>
               <div className="text-slate-400 font-bold text-sm">
                 {gallery.images.length} {language === 'ka' ? 'ფოტო' : 'PHOTOS'}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gallery.images.map((img, imgIdx) => (
                img && (
                  <div 
                    key={imgIdx} 
                    className={`group relative overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-sm transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 
                      ${imgIdx % 5 === 0 ? 'lg:col-span-2 lg:row-span-2 aspect-square lg:aspect-auto' : 'aspect-square'}
                    `}
                  >
                    <img 
                      src={img} 
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                      alt={`${gallery.name} ${imgIdx}`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-6 left-6 text-white font-bold text-sm translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                       MEMORY 0{imgIdx + 1}
                    </div>
                  </div>
                )
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer Design */}
      <footer className="mt-40 border-t border-slate-100 pt-20 pb-10 px-6 text-center">
         <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-7xl">💖</div>
            <h3 className="text-3xl font-black text-slate-800">
               {language === 'ka' ? 'მოგონებები სამუდამოდ რჩება' : 'Memories Last Forever'}
            </h3>
            <p className="text-slate-400 font-medium">
              Sent with Love from Wishify
            </p>
         </div>
         <div className="mt-20 text-[10px] font-black tracking-widest text-slate-200 uppercase">
           WISHIFY GALLERY EXPERIENCE © 2026
         </div>
      </footer>

      <style>{`
        .reveal-section {
          animation: reveal linear both;
          animation-timeline: view();
          animation-range: entry 10% cover 30%;
        }

        @keyframes reveal {
          from { opacity: 0; transform: translateY(100px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        body {
          scrollbar-width: thin;
          scrollbar-color: #0d9488 #FDFCFB;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #FDFCFB;
        }

        ::-webkit-scrollbar-thumb {
          background: #0d9488;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
