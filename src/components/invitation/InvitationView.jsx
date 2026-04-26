import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';

export default function InvitationView({ card, onBackToEdit, guestPhone, onSave, onPurchase, onGoToSaved, saving, isReadOnly, isSaved }) {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const audioRef = useRef(null);

  const heading = card?.heading ?? card?.Heading ?? card?.content?.heading ?? '';
  const message1 = card?.message1 ?? card?.Message1 ?? card?.content?.message1 ?? '';
  const message2 = card?.message2 ?? card?.Message2 ?? card?.content?.message2 ?? '';
  const footer = card?.footer ?? card?.Footer ?? card?.content?.footer ?? '';
  const audioUrl = card?.audioUrl ?? card?.AudioUrl ?? card?.content?.audioUrl ?? '';
  const imagesJson = card?.imagesJson ?? card?.ImagesJson;
  const templateId = card?.templateId ?? card?.TemplateId ?? card?.id;

  const themes = {
    DEFAULT: {
      type: 'green-luxe',
      containerBg: 'from-[#f8ecee] to-[#f4d9df]',
      envelopeBg: 'from-[#1b2b23] to-[#0f1f18]',
      waxSealBr: 'from-[#dfae5e] via-[#bc802f] to-[#7f5115]',
      waxSealInner: 'from-[#ac7428] via-[#bc802f] to-[#dfae5e]',
      paperBg: '#fff0f3',
      initialsColor: '#593911',
      textMain: 'text-rose-950',
      textSub: 'text-rose-900',
      accent: '#d4af37',
      locationsTime: 'text-blue-600',
      ornamentColor: '#d4af37'
    },
    'i2': {
      type: 'blue-wedding',
      containerBg: 'from-[#bae6fd] via-[#f0f9ff] to-[#bae6fd]',
      envelopeBg: 'from-[#0a1128] to-[#050a1b]',
      waxSealBr: 'from-[#d4af37] via-[#b8860b] to-[#8b6914]',
      waxSealInner: 'from-[#8b6914] via-[#b8860b] to-[#d4af37]',
      paperBg: '#050a1b',
      initialsColor: '#332200',
      textMain: 'text-white',
      textSub: 'text-[#fdfcf6]',
      accent: '#d4af37',
      locationsTime: 'text-[#d4af37]',
      ornamentColor: '#d4af37',
      isDark: true
    }
  };

  const activeTheme = themes[templateId] || themes.DEFAULT;

  const TEMPLATE_SAMPLES = {
    'i2': {
       images: ['/assets/invitation/wedding_sample.png', '/assets/invitation/wedding_sample.png'],
       heading: language === 'ka' ? 'ლიამი და ადელინი' : 'Liam & Adeline',
       message1: 'სიყვარულით გიწვევთ ჩვენს ქორწილში, სადაც ორი გული ერთ მელოდიად იქცევა.',
       message2: language === 'ka' ? '24 აგვისტო, 2024 | 19:00' : 'August 24, 2024 | 7:00 PM',
       locations: [
         { name: 'ჯვრისწერა', time: '14:00', desc: 'მცხეთის ჯვრის მონასტერი' },
         { name: 'სადღესასწაულო ვახშამი', time: '19:00', desc: 'რესტორანი "ბაგრატიონი"' }
       ],
       phones: ['+995 555 12 34 56', '+995 599 00 11 22'],
       seating: [
         { name: 'ლიამი', phone: '555123456', table: 'Table #1' },
         { name: 'ადელინი', phone: '599001122', table: 'Table #1' }
       ],
       eventDate: '24.08.2024'
    },
    'i1': {
       images: ['/assets/invitation/wedding_sample.png'],
       heading: language === 'ka' ? 'ელენე და გიორგი' : 'Sarah & Michael',
       message1: language === 'ka' ? 'მოხარულნი ვიქნებით, თუ ჩვენთან ერთად გააზიარებთ ამ დავიწყებად დღეს.' : 'We invite you to share in our joy as we celebrate the beginning of our new journey together.',
       message2: language === 'ka' ? 'თქვენი მობრძანება ჩვენთვის დიდი პატივია.' : 'Your presence would make our day truly special.',
       phones: ['+995 555 12 34 56'],
       seating: [
         { name: 'ელენე', phone: '555123456', table: 'Table #1' }
       ],
       eventDate: '12.09.2024'
    }
  };

  const isTemplatePreview = !imagesJson && TEMPLATE_SAMPLES[templateId];
  const sample = isTemplatePreview ? TEMPLATE_SAMPLES[templateId] : null;

  let invitationData = {
    images: sample?.images || [],
    locations: sample?.locations || [],
    phones: sample?.phones || [],
    seating: sample?.seating || [],
    eventDate: sample?.eventDate || ''
  };

  // Robust check to see if we should show samples (if heading is empty or matches ANY standard template default)
  const isDefaultHeading = !heading || heading === 'Wedding Invitation' || heading === 'Together with Families' || heading === 'Sarah & Michael' || heading === 'Royal Wedding';
  const displayHeading = (isTemplatePreview && isDefaultHeading) ? sample.heading : heading;
  
  const isDefaultMsg1 = !message1 || message1 === 'You are cordially invited to celebrate...' || message1.includes('request the honor of your presence');
  const displayMsg1 = (isTemplatePreview && isDefaultMsg1) ? sample.message1 : message1;
  
  const displayMsg2 = (isTemplatePreview && (!message2 || message2.includes('message2') || message2.includes('March 26'))) ? sample.message2 : message2;

  const extractInitials = (text) => {
    if (!text) return 'W&L';
    const stopwords = ['და', 'სიყვარულით', 'გიწვევთ', 'მოგესალმებით', 'with', 'love', 'and', '&', 'the', 'to', 'from', 'პატივისცემით', 'შემქმნელი', 'მოწვევით', 'მოსაწვევი'];
    const words = text.replace(/[,.&:]/g, ' ').split(/\s+/).filter(w => w.trim().length > 0);
    const names = words.filter(w => !stopwords.includes(w.toLowerCase()));
    
    if (names.length === 0) return 'L&A';
    
    // Take first letter of up to 2 words
    const initials = names.slice(-2).map(n => n.charAt(0));
    // Always use & between initials with no extra spaces
    return initials.join('&').toUpperCase();
  };

  if (imagesJson) {
    try {
      const parsed = typeof imagesJson === 'string' ? JSON.parse(imagesJson) : imagesJson;
      if (Array.isArray(parsed)) {
        invitationData.images = parsed;
      } else {
        invitationData = { ...invitationData, ...parsed };
      }
    } catch (e) {
      console.error("Failed to parse invitation data", e);
    }
  }

  const [foundGuest, setFoundGuest] = useState(null);

  useEffect(() => {
    if (guestPhone && invitationData.seating?.length > 0) {
      const searchVal = guestPhone.toString().toLowerCase().trim().replace(/\D/g, '');
      if (searchVal.length >= 4) {
        const guest = invitationData.seating.find(s => {
          const entryPhone = (s.phone || '').toString().toLowerCase().trim().replace(/\D/g, '');
          return entryPhone === searchVal || (entryPhone.length >= 6 && searchVal.length >= 6 && (entryPhone.endsWith(searchVal) || searchVal.endsWith(entryPhone)));
        });
        if (guest) setFoundGuest(guest);
      }
    }
  }, [guestPhone, invitationData.seating]);

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    
    setTimeout(() => {
      setShowContent(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#fdfcf6', '#f9e19d']
      });
    }, 800);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeTheme.containerBg} flex flex-col items-center p-4 sm:p-12 font-serif overflow-y-auto ${!showContent ? 'justify-center' : 'justify-start'} ${onBackToEdit && (onSave || onPurchase) ? 'pb-32' : ''}`}>
      {/* High-Fidelity Transparency Filter */}
      <svg width="0" height="0" className="absolute pointer-events-none opacity-0">
        <defs>
          <filter id="ornament-transparency">
             <feColorMatrix type="matrix" values="1 0 0 0 0
                                                   0 1 0 0 0
                                                   0 0 1 0 0
                                                   1 1 1 0 -0.4" />
          </filter>
        </defs>
      </svg>

      {/* Background Fireworks for i2 */}
      {templateId === 'i2' && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
           {[...Array(6)].map((_, i) => (
             <div 
               key={i} 
               className="absolute animate-firework-burst"
               style={{
                 left: `${[10, 85, 15, 80, 25, 75][i]}%`,
                 top: `${[20, 15, 60, 70, 40, 30][i]}%`,
                 animationDelay: `${i * 1.5}s`,
                 transform: `scale(${0.5 + Math.random()})`
               }}
             >
                <div className="relative">
                   {[...Array(12)].map((_, j) => (
                     <div 
                       key={j}
                       className="absolute w-[1px] h-12 bg-gradient-to-t from-transparent via-[#d4af37] to-white rounded-full origin-bottom"
                       style={{ 
                         transform: `rotate(${j * 30}deg) translateY(-20px)`,
                         opacity: 0.8
                       }}
                     />
                   ))}
                </div>
             </div>
           ))}
        </div>
      )}
      
      {/* Opening Screen - The "Start Gate" */}
      {!showContent && (
        <div className={`w-full flex items-center justify-center transition-all duration-1000 ${isOpen ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
          <div 
            onClick={handleOpen}
            className="cursor-pointer group relative flex items-center justify-center transform hover:scale-105 transition-transform duration-700 w-full h-full max-w-lg aspect-[4/5] sm:aspect-auto sm:h-[600px]"
          >
            {activeTheme.type === 'green-luxe' ? (
              /* Original Vertical Envelope Style */
              <div className={`w-[260px] h-[480px] sm:w-[320px] sm:h-[560px] bg-gradient-to-br ${activeTheme.envelopeBg} rounded-md shadow-[0_40px_80px_rgba(0,0,0,0.7)] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden`}>
                  
                  {/* Dried Baby's Breath / Gypsophila Graphic - Enhanced */}
                  <div className="absolute top-[14%] w-full h-72 flex justify-center opacity-95 z-10 pointer-events-none drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]" style={{ filter: 'sepia(0.2) saturate(1.2) contrast(1.1)' }}>
                     <svg viewBox="0 0 300 400" className="w-[240px] h-full overflow-visible">
                       <path d="M150,400 Q155,260 120,130 M150,400 Q140,280 180,140 M150,400 Q165,300 90,180 M150,360 Q190,260 210,180" fill="none" stroke="#68563c" strokeWidth="3" strokeLinecap="round" />
                       <path d="M135,220 Q110,180 80,120 M145,260 Q125,200 130,100 M165,220 Q190,170 195,110 M155,270 Q180,210 220,140 M120,150 Q105,120 75,90 M180,150 Q200,120 230,90" fill="none" stroke="#87755a" strokeWidth="1.5" strokeLinecap="round" />
                       <path d="M150,200 L130,150 M150,200 L170,140 M140,160 L100,120 M160,160 L190,110 M120,110 L140,70 M180,120 L160,80" fill="none" stroke="#ad9776" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                       <g opacity="0.95">
                          {[
                            [80, 120], [120, 130], [180, 140], [90, 180], [210, 180], [130, 100], [195, 110], [140, 70], [160, 80],
                            [75, 90], [230, 90], [100, 120], [190, 110], [90, 150], [200, 160], [110, 90], [170, 90]
                          ].map((pos, idx) => (
                             <g key={`cl-${idx}`} transform={`translate(${pos[0]}, ${pos[1]})`}>
                                <circle cx="0" cy="0" r="12" fill="#fffaf0" filter="blur(3px)" opacity="0.7"/>
                                {[...Array(15)].map((_, i) => {
                                  const angle = Math.random() * Math.PI * 2;
                                  const dist = Math.random() * 12;
                                  const size = Math.random() * 2.5 + 1;
                                  return <circle key={`f-${i}`} cx={Math.cos(angle)*dist} cy={Math.sin(angle)*dist} r={size} fill={Math.random() > 0.5 ? '#ffffff' : '#fcf5e3'} opacity={0.8 + Math.random()*0.2} />;
                                })}
                             </g>
                          ))}
                       </g>
                       <g opacity="0.8">
                         <path d="M120,200 Q105,185 100,195 Q105,210 120,200 Z" fill="#465449" />
                         <path d="M180,220 Q195,205 200,215 Q195,230 180,220 Z" fill="#465449" />
                         <path d="M140,260 Q120,250 125,265 Q140,275 140,260 Z" fill="#3c473f" />
                         <path d="M160,250 Q180,235 175,255 Q160,265 160,250 Z" fill="#465449" />
                       </g>
                     </svg>
                  </div>

                  {/* Strings tying the envelope */}
                  <div className="absolute top-[52%] w-full h-[2.5px] bg-gradient-to-r from-[#8a6c27] via-[#e2c47a] to-[#8a6c27] shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10 transform -translate-y-1/2" />
                  <div className="absolute top-[53.5%] w-full h-[1.5px] bg-gradient-to-r from-[#6b521b] via-[#c2a45a] to-[#6b521b] shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10 transform -translate-y-1/2" />

                  {/* wax Seal */}
                  <div className="absolute top-[52.5%] z-20 transform -translate-y-1/2">
                     <div className="w-28 h-28 rounded-[50%] relative flex items-center justify-center p-2.5 
                        shadow-[0_15px_30px_rgba(0,0,0,0.9),inset_-4px_-4px_12px_rgba(0,0,0,0.5),inset_6px_6px_12px_rgba(255,255,255,0.4)]
                        bg-gradient-to-br from-[#dfae5e] via-[#bc802f] to-[#7f5115] border border-[#a86e24]">
                        <div className="absolute inset-[-6px] rounded-[52%_48%_51%_49%] border-[8px] border-[#c6893f] mix-blend-multiply opacity-50 blur-[1px] rotate-12" />
                        <div className="absolute inset-[-4px] rounded-[48%_52%_49%_51%] border-[6px] border-[#e8bb72] mix-blend-screen opacity-40 blur-[1px] -rotate-12" />
                        <div className="w-full h-full rounded-[48%] flex items-center justify-center flex-row gap-1
                           bg-gradient-to-br from-[#ac7428] via-[#bc802f] to-[#dfae5e] 
                           shadow-[inset_6px_6px_10px_rgba(0,0,0,0.7),inset_-4px_-4px_8px_rgba(255,255,255,0.4),0_2px_3px_rgba(255,255,255,0.3)] 
                           border-[1.5px] border-[#8a571c] relative z-10 overflow-hidden">
                           <span className="text-[#593911] font-black text-3xl sm:text-4xl tracking-normal relative z-20 whitespace-nowrap flex flex-row" style={{ fontFamily: "'Great Vibes', cursive", textShadow: "1px 1px 1.5px rgba(255,255,255,0.4), -1.5px -1.5px 2px rgba(0,0,0,0.8)" }}>
                              {extractInitials(footer || heading)}
                           </span>
                        </div>
                     </div>
                  </div>
                  
                  {/* Date display below wax seal for Green Template */}
                  {invitationData.eventDate && (
                    <div className="absolute top-[68%] w-full text-center z-20">
                       <p className="text-[#dfae5e] text-xs font-black tracking-[0.5em] uppercase drop-shadow-lg opacity-80" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {invitationData.eventDate}
                       </p>
                    </div>
                  )}
              </div>
            ) : (
              /* "SAVE THE DATE" Card Style for i2 (Redesigned from Photo) */
              <div className={`w-[280px] h-[500px] sm:w-[350px] sm:h-[600px] bg-gradient-to-br ${activeTheme.envelopeBg} rounded-sm shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col items-center justify-center relative overflow-hidden`}>
                  {/* Large Floral Ornament - Left Side */}
                  <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-80 h-80 opacity-90 pointer-events-none transform -rotate-45">
                     <img 
                       src="/assets/invitation/gold_bouquet.png" 
                       className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                       style={{ filter: 'url(#ornament-transparency) brightness(1.2) contrast(1.4)' }}
                       alt="" 
                     />
                  </div>
                  
                  {/* Central Initials Circle - Repositioned and Shrunken */}
                  <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8 text-center translate-x-12 sm:translate-x-16">
                     <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                        {/* Perfectly Transparent CSS-based Royal Golden Frame */}
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center animate-float">
                           <div className="relative w-full h-full rounded-full flex items-center justify-center">
                              {/* Glowing Outer Ring */}
                              <div className="absolute inset-0 rounded-full border border-[#d4af37]/40 shadow-[0_0_15px_rgba(212,175,55,0.2)]" />
                              {/* Main Thin Gold Ring */}
                              <div className="absolute inset-3 rounded-full border-[1.5px] border-[#d4af37] shadow-[inset_0_0_10px_rgba(212,175,55,0.3)]" />
                              {/* Inner Decorative Ring */}
                              <div className="absolute inset-6 rounded-full border border-dashed border-[#d4af37]/40" />
                              
                              <div className="relative z-20 flex flex-col items-center">
                                 <span className="text-3xl sm:text-4xl font-black tracking-tighter text-[#d4af37] drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {extractInitials(footer || heading).split('&').join(' & ')}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="mt-6 flex flex-col items-center gap-1">
                        {invitationData.eventDate && (
                           <p className="text-[#d4af37] text-xs uppercase tracking-[0.4em] font-black opacity-90 animate-in fade-in duration-1000">
                              {invitationData.eventDate}
                           </p>
                        )}
                        <p className="text-[#d4af37]/50 text-[10px] uppercase tracking-[0.3em] font-bold">
                           {language === 'ka' ? 'მოგესალმებით' : 'Welcome'}
                        </p>
                     </div>
                  </div>
              </div>
            )}

            <div className="absolute bottom-10 z-30 opacity-70">
               <p className={`text-[10px] font-black tracking-[0.4em] ${templateId === 'i2' ? 'text-white' : 'text-[#d4af37]'} uppercase ${templateId === 'i2' ? 'bg-white/10' : 'bg-[#1a2520]/60'} px-4 py-1.5 backdrop-blur-md rounded-full shadow-lg border border-[#d4af37]/20`}>
                  {extractInitials(footer || heading).split('&').join(' & ')}
               </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Card View */}
      <div className={`w-full max-w-4xl transition-all duration-1000 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        
        {/* Standalone Owner Header */}
        {!onBackToEdit && onPurchase && (
          <div className="fixed top-0 left-0 w-full z-[110] flex items-center justify-between px-6 py-4 bg-white/20 backdrop-blur border-b border-white/10">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-white/70 hover:text-white font-semibold transition-colors cursor-pointer"
            >
              <span>←</span> <span className="hidden sm:inline">{language === 'ka' ? 'უკან დაბრუნება' : 'Back'}</span>
            </button>
            <button
              onClick={onPurchase}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm sm:text-base font-bold px-6 py-2.5 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
            >
              💳 <span>{language === 'ka' ? 'შეძენა' : 'Purchase'}</span>
            </button>
          </div>
        )}

        {onBackToEdit && (
          <button 
            onClick={onBackToEdit}
            className="fixed top-6 left-6 z-[110] w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all cursor-pointer shadow-2xl active:scale-90 border-2 border-white ring-4 ring-red-600/20"
            title={t('editor.common.back')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* The Card Container */}
        <div className="bg-paper shadow-[0_50px_100px_rgba(0,0,0,0.6)] rounded-sm min-h-[80vh] flex flex-col relative w-full mb-12">
            
            {/* Pink Floral Resin Overlay Frame */}
            <div className="absolute inset-0 pointer-events-none p-3 sm:p-5 overflow-hidden">
               <div className={`w-full h-full border-[8px] sm:border-[12px] border-white/40 rounded-sm sm:rounded-xl relative shadow-[inset_0_0_50px_rgba(244,114,182,0.15)] bg-gradient-to-tr from-[#ffe4e6]/20 via-transparent to-[#fdf2f8]/20 ${activeTheme.type === 'green-luxe' ? 'mix-blend-multiply' : ''} flex items-center justify-center`}>
                  
                  {/* Organic Accent Border */}
                  <div 
                    className="absolute inset-2 sm:inset-4 border border-dashed rounded-lg opacity-70" 
                    style={{ borderColor: `${activeTheme.accent}66` }} 
                  />
                  
                   {/* Theme-specific Ornaments */}
                   {activeTheme.type === 'green-luxe' ? (
                     <>
                        <div className="absolute -top-10 -left-10 w-44 h-44 opacity-90 drop-shadow-lg mix-blend-multiply">
                           <p className="absolute inset-0 text-[4rem] sm:text-[5rem] flex items-center justify-center transform -rotate-12 select-none filter blur-[0.5px]">🌸</p>
                           <p className="absolute inset-0 text-[2.5rem] sm:text-[3.5rem] flex items-center justify-center transform translate-x-8 -translate-y-4 rotate-45 select-none opacity-80">🌺</p>
                           <p className="absolute inset-0 text-[1.5rem] flex items-center justify-center transform -translate-x-6 translate-y-8 rotate-90 select-none opacity-70">🌿</p>
                        </div>

                        <div className="absolute -bottom-10 -right-10 w-44 h-44 opacity-90 drop-shadow-lg mix-blend-multiply">
                           <p className="absolute inset-0 text-[4rem] sm:text-[5rem] flex items-center justify-center transform rotate-12 select-none filter blur-[0.5px]">🌸</p>
                           <p className="absolute inset-0 text-[2.5rem] sm:text-[3.5rem] flex items-center justify-center transform -translate-x-8 translate-y-4 -rotate-45 select-none opacity-80">🌷</p>
                           <p className="absolute inset-0 text-[1.5rem] flex items-center justify-center transform translate-x-6 -translate-y-8 -rotate-90 select-none opacity-70">🌿</p>
                        </div>
                     </>
                   ) : (
                     <>
                        {/* Decorative CSS Border for i2 */}
                        <div className="absolute inset-6 sm:inset-10 border border-[#d4af37]/10 pointer-events-none">
                           <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#d4af37]/40" />
                           <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#d4af37]/40" />
                           <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#d4af37]/40" />
                           <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#d4af37]/40" />
                        </div>

                        {/* Blue Wedding Ornaments - Resized and Repositioned to avoid clipping */}
                        <div className="absolute -top-10 -left-10 w-64 h-64 opacity-90 pointer-events-none transform rotate-[168deg]">
                           <img 
                             src="/assets/invitation/gold_bouquet.png" 
                             className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]" 
                             style={{ filter: 'url(#ornament-transparency) brightness(1.2) contrast(1.4)' }}
                             alt="" 
                           />
                        </div>
                        <div className="absolute -bottom-20 -right-20 w-[350px] h-80 opacity-90 pointer-events-none transform rotate-12">
                           <img 
                             src="/assets/invitation/gold_bouquet.png" 
                             className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]" 
                             style={{ filter: 'url(#ornament-transparency) brightness(1.2) contrast(1.4)' }}
                             alt="" 
                           />
                        </div>
                        
                        {/* Smaller Side Ornament */}
                        <div className="absolute top-1/2 -right-12 w-28 h-28 -translate-y-1/2 opacity-30 transform rotate-180">
                           <img 
                             src="/assets/invitation/gold_bouquet.png" 
                             className="w-full h-full object-contain" 
                             style={{ filter: 'url(#ornament-transparency) brightness(1.2) contrast(1.4)' }}
                             alt="" 
                           />
                        </div>
                     </>
                   )}
               </div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center p-8 sm:p-20 text-center space-y-12 max-w-2xl mx-auto">
               
               {/* Header Section - Accurately themed for i2 */}
               <div className="space-y-6 pt-16">
                  {templateId === 'i2' && (
                    <p className="text-[#d4af37] text-xs uppercase tracking-[0.5em] font-black opacity-80 mb-2">
                       The Wedding of
                    </p>
                  )}
                  <h1 className={`text-5xl sm:text-8xl ${activeTheme.textMain} font-bold drop-shadow-[0_0_15px_rgba(255,228,155,0.3)]`} style={{ fontFamily: "'Great Vibes', cursive" }}>
                    {displayHeading || 'Wedding Celebration'}
                  </h1>
                  <div className="flex items-center justify-center gap-6">
                    <div className="h-[2px] w-12 sm:w-20 rounded-full" style={{ backgroundColor: activeTheme.accent }} />
                    <div className="text-4xl sm:text-6xl font-bold italic" style={{ fontFamily: "'Playfair Display', serif", color: activeTheme.accent }}>
                        &
                    </div>
                    <div className="h-[2px] w-12 sm:w-20 rounded-full" style={{ backgroundColor: activeTheme.accent }} />
                  </div>
                  <p className={`${activeTheme.textSub} text-lg sm:text-2xl italic leading-relaxed font-semibold drop-shadow-sm px-4`} style={{ fontFamily: "'Playfair Display', serif" }}>
                    {displayMsg1}
                  </p>
                  {displayMsg2 && (
                    <p className={`${activeTheme.isDark ? 'text-slate-400' : 'text-slate-600'} text-xs sm:text-sm tracking-widest uppercase opacity-80 mt-4`}>
                      {displayMsg2}
                    </p>
                  )}
               </div>

               {/* Personalized Guest Welcome */}
               {foundGuest && (
                 <div className={`w-full max-w-lg mx-auto py-8 px-6 rounded-[2rem] border animate-in zoom-in duration-700 shadow-xl ${activeTheme.isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-amber-200/50 backdrop-blur-sm'}`}>
                    <p className="text-amber-600 font-black text-xs uppercase tracking-[0.3em] mb-4">
                      ✨ {t('dashboard.hello')}{foundGuest.name ? `, ${foundGuest.name}` : ''}! ✨
                    </p>
                    <div className="grid grid-cols-2 gap-4 divide-x divide-amber-200/30">
                       <div className="text-center">
                          <p className={`text-[10px] uppercase font-black ${activeTheme.isDark ? 'text-slate-400' : 'text-slate-500'} tracking-widest mb-1`}>{t('editor.invitation.guest_table')}</p>
                          <p className={`text-4xl font-black ${activeTheme.isDark ? 'text-white' : 'text-slate-800'}`} style={{ fontFamily: "'Playfair Display', serif" }}>{foundGuest.table}</p>
                       </div>
                       <div className="text-center pl-4">
                          <p className={`text-[10px] uppercase font-black ${activeTheme.isDark ? 'text-slate-400' : 'text-slate-500'} tracking-widest mb-1`}>{t('editor.invitation.guest_seat')}</p>
                          <p className={`text-4xl font-black ${activeTheme.isDark ? 'text-white' : 'text-slate-800'}`} style={{ fontFamily: "'Playfair Display', serif" }}>{foundGuest.seat}</p>
                       </div>
                    </div>
                    <div className="mt-4 text-[10px] font-bold text-amber-600/60 uppercase tracking-widest">
                       {language === 'ka' ? 'მოუთმენლად გელით!' : "We can't wait to see you!"}
                    </div>
                 </div>
               )}
               {/* Photo Collection */}
               {invitationData.images.length > 0 && (
                <div className="w-full grid grid-cols-2 gap-4 py-8">
                   {invitationData.images.map((url, idx) => (
                     <div key={idx} className="aspect-[4/5] bg-white p-2 shadow-xl rotate-1 odd:-rotate-2 transition-transform hover:rotate-0 hover:scale-105">
                        <img src={url} className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all border border-slate-100" alt="" />
                     </div>
                   ))}
                </div>
               )}

               {/* Locations - Timeline Style */}
               <div className="w-full relative py-8">
                  {/* Central Vertical Line */}
                  <div 
                    className="absolute left-1/2 top-4 bottom-4 w-[1.5px] transform -translate-x-1/2" 
                    style={{ background: `linear-gradient(to bottom, transparent, ${activeTheme.accent}aa, transparent)` }} 
                  />
                  
                  <div className="flex flex-col gap-10">
                    {invitationData.locations.map((loc, idx) => {
                      const isLeft = idx % 2 === 0;
                      return (
                        <div key={idx} className="flex items-center justify-center w-full relative z-10">
                           
                           {/* Left Side */}
                           <div className="w-1/2 pr-6 sm:pr-10 text-right">
                              {isLeft && (
                                <div className="space-y-1">
                                  <div className={`text-[11px] font-black tracking-[0.4em] ${activeTheme.locationsTime} uppercase drop-shadow-sm`}>{loc.time}</div>
                                  <h3 className={`text-xl sm:text-2xl font-bold ${activeTheme.isDark ? 'text-white' : 'text-slate-800'}`} style={{ fontFamily: "'Playfair Display', serif" }}>{loc.name}</h3>
                                  <p className={`${activeTheme.isDark ? 'text-slate-400' : 'text-slate-500'} text-xs sm:text-sm italic`}>{loc.desc}</p>
                                </div>
                              )}
                           </div>
                           
                           {/* Center Node */}
                           <div className="shrink-0 flex items-center justify-center w-8">
                             <div 
                               className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-[3px] shadow-[0_0_10px_rgba(212,175,55,0.4)]`} 
                               style={{ backgroundColor: activeTheme.paperBg, borderColor: activeTheme.accent }}
                             />
                           </div>
                           
                           {/* Right Side */}
                           <div className="w-1/2 pl-6 sm:pl-10 text-left">
                              {!isLeft && (
                                <div className="space-y-1">
                                  <div className={`text-[11px] font-black tracking-[0.4em] ${activeTheme.locationsTime} uppercase drop-shadow-sm`}>{loc.time}</div>
                                  <h3 className={`text-xl sm:text-2xl font-bold ${activeTheme.isDark ? 'text-white' : 'text-slate-800'}`} style={{ fontFamily: "'Playfair Display', serif" }}>{loc.name}</h3>
                                  <p className={`${activeTheme.isDark ? 'text-slate-400' : 'text-slate-500'} text-xs sm:text-sm italic`}>{loc.desc}</p>
                                </div>
                              )}
                           </div>

                        </div>
                      )
                    })}
                  </div>
               </div>

               {/* Seating Search Section - Integrated into stationery */}
               {invitationData.seating.length > 0 && (
                 <div className="w-full py-12 border-t border-b my-8 shadow-inner" style={{ borderColor: `${activeTheme.accent}33` }}>
                    <div className="mb-6">
                       <h3 className={`text-xl font-bold ${activeTheme.isDark ? 'text-white' : 'text-slate-800'}`} style={{ fontFamily: "'Playfair Display', serif" }}>{t('editor.invitation.seating')}</h3>
                       <p className="text-[10px] font-black tracking-widest uppercase mt-2" style={{ color: activeTheme.accent }}>{language === 'ka' ? 'იპოვე შენი ადგილი' : 'Find Your Place'}</p>
                    </div>
                    <SeatingSearch seating={invitationData.seating} guestPhone={guestPhone} activeTheme={activeTheme} />
                 </div>
               )}

               {/* Footer / RSVP Section */}
               {invitationData.phones.length > 0 && (
                 <div className="space-y-8 pt-10 pb-20">
                    <div className="space-y-4">
                       <p className={`${activeTheme.isDark ? (templateId === 'i2' ? 'text-white font-black drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_0_2px_rgba(0,0,0,1)]' : 'text-slate-400') : 'text-slate-700'} font-bold italic`} style={{ fontFamily: "'Playfair Display', serif" }}>
                          {language === 'ka' ? 'გთხოვთ დაგვიკავშირდეთ დასადასტურებლად:' : 'Kindly RSVP to:'}
                       </p>
                       <div className="flex flex-wrap justify-center gap-6">
                          {invitationData.phones.map((phone, idx) => (
                            <a 
                              key={idx} 
                              href={`tel:${phone}`} 
                              className={`${activeTheme.isDark ? (templateId === 'i2' ? 'text-white font-black drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_0_2px_rgba(0,0,0,1)]' : 'text-[#fdfcf6]') : 'text-slate-800'} text-lg hover:opacity-70 transition font-bold border-b pb-1`}
                              style={{ borderBottomColor: `${activeTheme.accent}4d` }}
                            >
                               {phone}
                            </a>
                          ))}
                       </div>
                    </div>

                    <div className={templateId === 'i2' ? "absolute bottom-4 right-4 sm:bottom-5 sm:right-[-3.5rem] text-right space-y-1" : "pt-8"}>
                       <p className="text-3xl italic" style={{ fontFamily: "'Great Vibes', cursive", color: templateId === 'i2' ? '#3b82f6' : (activeTheme.isDark ? activeTheme.accent : '#1e293b') }}>{footer}</p>
                       {templateId !== 'i2' && <div className="w-20 h-px mx-auto mt-6" style={{ backgroundColor: `${activeTheme.accent}4d` }} />}
                       <div className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-400 opacity-50">WISHIFY LUXE</div>
                    </div>
                 </div>
               )}
            </div>

            {/* Ornamental Bottom Decoration */}
            <div 
              className="absolute bottom-0 left-0 w-full h-24 pointer-events-none" 
              style={{ background: `linear-gradient(to top, ${activeTheme.accent}1a, transparent)` }} 
            />
        </div>
      </div>

      {/* Fixed Bottom Footer for Preview Mode */}
      {onBackToEdit && (onSave || onPurchase) && (
        <div className="fixed bottom-0 left-0 right-0 z-[120] bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-500">
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
                {onSave && (
                  <button 
                    onClick={() => onSave()}
                    disabled={saving || isReadOnly}
                    className={`flex-1 max-w-[200px] py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black hover:opacity-90 transition shadow-xl shadow-amber-500/20 disabled:opacity-50 active:scale-95 text-sm cursor-pointer ${isReadOnly ? 'from-slate-400 to-slate-500 shadow-none !cursor-not-allowed' : ''}`}
                  >
                    {saving ? t('editor.common.saving') : t('editor.common.save')}
                  </button>
                )}
                {onPurchase && !isReadOnly && (
                  <button 
                    onClick={() => onPurchase()}
                    disabled={saving}
                    className="flex-1 max-w-[200px] py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black hover:opacity-90 transition shadow-xl shadow-emerald-500/20 disabled:opacity-50 active:scale-95 text-sm cursor-pointer"
                  >
                    💳 {language === 'ka' ? 'შეძენა' : 'Purchase'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <audio ref={audioRef} src={audioUrl} loop />

      <style>{styles(activeTheme)}</style>
    </div>
  );
}

function SeatingSearch({ seating, guestPhone, activeTheme }) {
  const [query, setQuery] = useState(guestPhone || '');
  const [result, setResult] = useState(null);
  const { language, t } = useLanguage();

  const normalizeSearch = (p) => (p || '').toString().toLowerCase().trim();

  const handleSearch = (eToSearch) => {
    const targetString = typeof eToSearch === 'string' ? eToSearch : query;
    const searchVal = normalizeSearch(targetString);
    if (!searchVal || searchVal.length < 2) return;

    const isDigitsOnly = /^\d+$/.test(searchVal);

    const found = seating.find(s => {
      const entryPhone = normalizeSearch(s.phone);
      const entryName = normalizeSearch(s.name);
      
      if (isDigitsOnly) {
        // For numbers, require exact match or at least 9 digits match
        return entryPhone === searchVal;
      }
      
      // For names, partial match is still okay but require at least 3 chars
      return searchVal.length >= 3 && entryName.includes(searchVal);
    });
    setResult(found || 'none');
  };

  useEffect(() => {
    if (guestPhone) {
      setQuery(guestPhone);
      handleSearch(guestPhone);
    }
  }, [guestPhone]);

  return (
    <div className="max-w-xs mx-auto space-y-8">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <input 
            value={query}
            onChange={e => {
               setQuery(e.target.value);
               setResult(null);
            }}
            placeholder={language === 'ka' ? 'ჩაწერე ტელეფონის ნომერი' : 'Enter phone number...'}
            className={`w-full bg-transparent border-b-2 border-amber-500/20 px-2 py-3 ${activeTheme.isDark ? 'text-white' : 'text-slate-800'} placeholder:text-slate-400/50 focus:outline-none focus:border-amber-500 transition-all text-center italic text-lg`}
          />
        </div>
        <button 
          onClick={handleSearch}
          className="w-full text-[10px] font-black text-white px-8 py-4 rounded-xl hover:opacity-90 transition-all uppercase tracking-[0.3em] shadow-xl shadow-amber-500/10 active:scale-95"
          style={{ backgroundColor: activeTheme.accent }}
        >
          {language === 'ka' ? 'შემოწმება' : 'Check RSVP'}
        </button>
      </div>

      {result === 'none' && (
        <div className="text-red-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in duration-300">
           {language === 'ka' ? 'ნომერი არ მოიძებნა' : 'Guest not found'}
        </div>
      )}

      {result && result !== 'none' && (
        <div className={`py-8 px-6 rounded-[2rem] border animate-in zoom-in duration-700 shadow-xl ${activeTheme.isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-amber-200/50 backdrop-blur-sm'}`}>
            <p className="text-amber-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
              ✨ {t('dashboard.hello')}{result.name ? `, ${result.name}` : ''}! ✨
            </p>
            <div className="grid grid-cols-2 gap-4 divide-x divide-amber-200/30">
               <div className="text-center">
                  <p className={`text-[9px] uppercase font-black ${activeTheme.isDark ? 'text-slate-400' : 'text-slate-500'} tracking-widest mb-1`}>{t('editor.invitation.guest_table')}</p>
                  <p className={`text-3xl font-black ${activeTheme.isDark ? 'text-white' : 'text-slate-800'}`} style={{ fontFamily: "'Playfair Display', serif" }}>{result.table}</p>
               </div>
               <div className="text-center pl-4">
                  <p className={`text-[9px] uppercase font-black ${activeTheme.isDark ? 'text-slate-400' : 'text-slate-500'} tracking-widest mb-1`}>{t('editor.invitation.guest_seat')}</p>
                  <p className={`text-3xl font-black ${activeTheme.isDark ? 'text-white' : 'text-slate-800'}`} style={{ fontFamily: "'Playfair Display', serif" }}>{result.seat}</p>
               </div>
            </div>
        </div>
      )}
    </div>
  );
}

const styles = (activeTheme) => `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes firework-burst {
    0% { transform: scale(0); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  .animate-firework-burst {
    animation: firework-burst 3s ease-out infinite;
  }
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
  .bg-paper {
    background-color: ${activeTheme.paperBg};
    background-image: ${activeTheme.type === 'green-luxe' 
      ? `radial-gradient(circle at top left, rgba(255,192,203,0.3) 0%, transparent 40%),
         radial-gradient(circle at bottom right, rgba(255,228,230,0.5) 0%, transparent 40%),
         url("https://www.transparenttextures.com/patterns/creampaper.png"), 
         url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0c27.614 0 50 22.386 50 50s-22.386 50-50 50S0 77.614 0 50 22.386 0 50 0zm0 10C27.909 10 10 27.909 10 50s17.909 40 40 40 40-17.909 40-40S72.091 10 50 10zm0 20c11.046 0 20 8.954 20 20s-8.954 20-20 20-20-8.954-20-20 8.954-20 20-20z' fill='%23d4af37' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
      : `radial-gradient(circle at 10% 10%, rgba(212,175,55,0.15) 0%, transparent 40%),
         radial-gradient(circle at 90% 90%, rgba(212,175,55,0.15) 0%, transparent 40%),
         radial-gradient(ellipse at 50% 50%, rgba(10,17,40,0.3) 0%, transparent 100%),
         url("https://www.transparenttextures.com/patterns/luxury-paper.png"),
         url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='none' stroke='%23d4af37' stroke-opacity='0.08' stroke-width='0.5'/%3E%3Cpath d='M0 0l15 15M45 45l15 15M60 0L45 15M15 45L0 60' stroke='%23d4af37' stroke-opacity='0.05' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='1.5' fill='%23d4af37' fill-opacity='0.15'/%3E%3C/svg%3E")`};
    background-position: center, center, center, center;
  }
`;
