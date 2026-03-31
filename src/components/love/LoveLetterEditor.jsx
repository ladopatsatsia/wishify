import { useState, useRef } from 'react';
import LoveCardView from './LoveCardView';
import MusicSearch from '../MusicSearch';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CARDS_URL, UPLOAD_URL } from '../../api/config';

const CARDS_API = CARDS_URL;

export default function LoveLetterEditor({ card, existingCard, category, onBack, onClose }) {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const fileInputRef = useRef(null);

  const isReadOnly = !!(existingCard?.urlSlug || existingCard?.UrlSlug);

  // Initialize from existingCard or template
  const initialHeading = existingCard?.heading || card.content?.heading || 'My Dearest...';
  const initialMessage1 = existingCard?.message1 || card.content?.message1 || '';
  const initialMessage2 = existingCard?.message2 || card.content?.message2 || '';
  const initialFooter = existingCard?.footer || card.content?.footer || 'Forever Yours, [Your Name]';
  const initialAudioUrl = existingCard?.audioUrl || card.content?.audioUrl || '';
  const initialAudioLabel = existingCard?.audioLabel || '';
  const initialImages = existingCard?.imagesJson ? JSON.parse(existingCard.imagesJson) : [];

  const [heading, setHeading] = useState(initialHeading);
  const [message1, setMessage1] = useState(initialMessage1);
  const [message2, setMessage2] = useState(initialMessage2);
  const [footer, setFooter] = useState(initialFooter);
  const [photo, setPhoto] = useState(initialImages[0] || '');
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(!!initialAudioUrl);
  const [musicUrl, setMusicUrl] = useState(initialAudioUrl);
  const [musicLabel, setMusicLabel] = useState(initialAudioLabel);
  const [showMusicSearch, setShowMusicSearch] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        },
        body: formData
      });

      if (response.ok) {
        const urls = await response.json();
        if (urls && urls.length > 0) {
          setPhoto(urls[0]);
        }
      } else {
        alert(t('editor.common.uploading_failed') || 'Upload failed');
      }
    } catch (error) {
       console.error('Image upload error:', error);
       alert(t('editor.common.upload_error') || 'Error during upload');
    } finally {
       setUploading(false);
    }
  };

  const handleSave = async () => {
    if (isReadOnly) {
      alert(t('editor.common.read_only_warn'));
      return;
    }
    setSaving(true);
    try {
      const cardData = {
        templateId: card.id,
        recipientName: heading,
        heading,
        message1,
        message2,
        footer,
        audioUrl: musicEnabled ? musicUrl : null,
        audioLabel: musicEnabled ? musicLabel : null,
        imagesJson: JSON.stringify([photo].filter(Boolean)),
        categoryId: category || 'love'
      };

      const url = existingCard ? `${CARDS_API}/${existingCard.id}` : CARDS_API;
      const method = existingCard ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify(cardData)
      });

      if (response.ok) {
        const result = await response.json();
        setSaved(true);
        const cardId = existingCard ? existingCard.id : result.id;
        setShareUrl(`${window.location.origin}/view/love/${cardId}`);
      }
    } catch (error) {
      console.error('Error saving love letter:', error);
    } finally {
      setSaving(false);
    }
  };

  if (preview) {
    return (
      <div className="fixed inset-0 z-[100] bg-black">
        <LoveCardView 
          card={{ heading, message1, message2, footer, audioUrl: musicEnabled ? musicUrl : null, imagesJson: JSON.stringify([photo].filter(Boolean)) }} 
          onBackToEdit={() => setPreview(false)} 
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#fff5f5] overflow-y-auto p-4 py-10 font-serif">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        
        {/* Editor Side */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-rose-100 flex flex-col h-full sticky top-0">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <div className="text-4xl">✍️</div>
                <div>
                   <h2 className="text-2xl font-black text-gray-900 italic leading-tight">
                      {t('editor.love.title')}
                   </h2>
                   <p className="text-rose-400 text-xs font-bold uppercase tracking-widest">
                      {t('editor.love.sub_title')}
                   </p>
                </div>
             </div>
             <button onClick={onClose} className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold hover:bg-rose-100 transition">×</button>
          </div>

          <div className="space-y-6 flex-1">
             <div>
                <label className="block text-xs font-black text-rose-300 uppercase tracking-widest mb-2 px-1">
                   {t('editor.love.who_is_for')}
                </label>
                <input 
                   value={heading} 
                   onChange={e => setHeading(e.target.value)}
                   disabled={isReadOnly}
                   className={`w-full bg-rose-50/50 border-2 border-rose-50 rounded-2xl px-6 py-4 text-gray-800 font-bold focus:outline-none focus:border-rose-200 transition italic ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
             </div>

             <div>
                <label className="block text-xs font-black text-rose-300 uppercase tracking-widest mb-2 px-1">
                   {t('editor.love.message')}
                </label>
                <textarea 
                   value={message1} 
                   onChange={e => setMessage1(e.target.value)}
                   rows={6}
                   disabled={isReadOnly}
                   className={`w-full bg-rose-50/50 border-2 border-rose-50 rounded-2xl px-6 py-4 text-gray-800 italic leading-relaxed focus:outline-none focus:border-rose-200 transition resize-none text-sm ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                   placeholder={t('editor.love.message_placeholder')}
                />
             </div>

             <div>
                <label className="block text-xs font-black text-rose-300 uppercase tracking-widest mb-2 px-1">
                   {t('editor.love.final_wish')}
                </label>
                <input 
                   value={message2} 
                   onChange={e => setMessage2(e.target.value)}
                   disabled={isReadOnly}
                   className={`w-full bg-rose-50/50 border-2 border-rose-50 rounded-2xl px-6 py-4 text-gray-800 italic focus:outline-none focus:border-rose-200 transition ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
             </div>

             <div>
                <label className="block text-xs font-black text-rose-300 uppercase tracking-widest mb-2 px-1">
                   {t('editor.love.signature')}
                </label>
                <input 
                   value={footer} 
                   onChange={e => setFooter(e.target.value)}
                   disabled={isReadOnly}
                   className={`w-full bg-rose-50/50 border-2 border-rose-50 rounded-2xl px-6 py-4 text-rose-500 font-black italic focus:outline-none focus:border-rose-200 transition ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
             </div>

             {/* Photo Upload Section */}
             <div className="space-y-3">
                <label className="block text-xs font-black text-rose-300 uppercase tracking-widest mb-2 px-1">
                   {t('editor.love.photo')}
                </label>
                <div className="flex items-center gap-4">
                   <div className="w-20 h-20 bg-rose-50 rounded-2xl overflow-hidden border-2 border-rose-100 shadow-inner flex items-center justify-center relative group">
                      {photo ? (
                        <>
                          <img src={photo} className="w-full h-full object-cover" />
                          {!isReadOnly && (
                            <button onClick={() => setPhoto('')} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold pb-2">REMOVE</button>
                          )}
                        </>
                      ) : (
                        <span className="text-2xl opacity-20">📸</span>
                      )}
                      {uploading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>}
                   </div>
                   <div className="flex-1">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*" 
                      />
                      <button 
                        onClick={() => !isReadOnly && fileInputRef.current.click()}
                        disabled={isReadOnly || uploading}
                        className="bg-white border-2 border-rose-100 text-rose-500 px-6 py-2 rounded-xl text-xs font-black hover:bg-rose-50 transition active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                         {uploading ? t('editor.common.uploading') : (photo ? t('editor.love.change_photo') : t('editor.love.upload_photo'))}
                      </button>
                      <p className="text-[10px] text-gray-400 mt-1 font-bold italic px-1">Select a beautiful memory</p>
                   </div>
                </div>
             </div>

             {/* Music Toggle Section */}
             <div className="bg-rose-50/30 p-6 rounded-[2rem] border border-rose-100 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="text-2xl">🎵</div>
                      <div>
                         <div className="text-sm font-black text-gray-800">{t('editor.common.music')}</div>
                         <div className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">{t('editor.love.active_soundtrack') || 'Enchanting Melody'}</div>
                      </div>
                   </div>
                   <button 
                      onClick={() => !isReadOnly && setMusicEnabled(!musicEnabled)}
                      disabled={isReadOnly}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${musicEnabled ? 'bg-rose-500' : 'bg-gray-200'}`}
                   >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${musicEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                   </button>
                </div>

                 {musicEnabled && (
                   <div className="animate-in fade-in zoom-in duration-300">
                      {musicUrl ? (
                        <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-rose-100 shadow-sm relative group overflow-hidden">
                           <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                           <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-white text-lg shadow-lg">♪</div>
                           <div className="flex-1 min-w-0">
                              <div className="text-sm font-black text-gray-800 truncate">{musicLabel || 'Selected Melody'}</div>
                              <div className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Active Soundtrack</div>
                           </div>
                           <button 
                             onClick={() => !isReadOnly && setShowMusicSearch(true)}
                             disabled={isReadOnly}
                             className="text-[10px] font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             {t('editor.common.change_song')}
                           </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => !isReadOnly && setShowMusicSearch(true)}
                          disabled={isReadOnly}
                          className="w-full bg-white border-2 border-dashed border-rose-200 rounded-2xl p-6 text-center hover:bg-rose-50 transition group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">✨</div>
                           <div className="text-sm font-black text-rose-500 italic">{t('editor.love.find_magic_music')}</div>
                           <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">{t('editor.love.search_by_song')}</div>
                        </button>
                      )}
                   </div>
                 )}
             </div>

             {isReadOnly && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-700 animate-in fade-in zoom-in duration-300">
                  <span className="text-xl">🔒</span>
                  <div className="text-[10px] font-bold leading-tight uppercase tracking-wider">
                    {t('editor.common.read_only_warn')}
                  </div>
                </div>
              )}
          </div>

          <div className="mt-10 space-y-4">
             {saved && (
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl text-emerald-700 font-bold animate-in fade-in zoom-in duration-300 flex flex-col gap-4 shadow-sm shadow-emerald-100">
                   <div className="flex items-center gap-2 text-lg text-nowrap">
                      <span className="text-2xl">✨</span>
                      {t('editor.common.saved_success')}
                   </div>
                   <div className="flex gap-2">
                      <input 
                        readOnly 
                        value={shareUrl} 
                        className="flex-1 bg-white border border-emerald-100 rounded-lg px-3 py-2 text-xs text-slate-600 focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(shareUrl);
                          alert(t('editor.common.copy_success') || "Link copied!");
                        }}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                      >
                         {t('editor.common.copy') || 'COPY'}
                      </button>
                   </div>
                </div>
             )}
 
             <div className="flex gap-3">
                <button 
                   onClick={onBack}
                   className="flex-1 bg-white border-2 border-rose-100 text-rose-400 font-bold py-4 rounded-2xl hover:bg-rose-50 transition cursor-pointer"
                >
                   ← {t('editor.common.back')}
                </button>
                <button 
                   onClick={() => setPreview(true)}
                   className="flex-1 bg-white border-2 border-rose-100 text-rose-500 font-bold py-4 rounded-2xl hover:bg-rose-50 transition cursor-pointer"
                >
                   {t('editor.common.preview')} 👀
                </button>
                <button 
                   onClick={handleSave}
                   disabled={saving || isReadOnly}
                   className={`flex-[1.5] bg-rose-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-rose-200 hover:bg-rose-600 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer ${isReadOnly ? 'bg-slate-400 shadow-none !cursor-not-allowed' : ''}`}
                >
                   {saving ? (
                      <div className="flex items-center gap-2">
                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         {t('editor.common.saving')}
                      </div>
                   ) : isReadOnly ? (
                      <>{t('editor.love.locked')}</>
                   ) : (
                      <>{t('editor.love.save_letter')}</>
                   )}
                </button>
             </div>
          </div>
        </div>
 
        {/* Live Mini Preview Side */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-8">
           <div className="text-center">
              <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{t('editor.common.live_preview')}</div>
              <h3 className="text-xl font-bold text-gray-300 italic">{t('editor.common.preview_sub') || 'How it will look...'}</h3>
           </div>
           
           <div className="w-full aspect-[4/5] bg-white shadow-[0_50px_100px_rgba(251,113,133,0.15)] rounded-lg p-10 flex flex-col items-center border border-rose-50 scale-90">
              <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-xl mb-10">💌</div>
              <div className="w-full h-px bg-rose-50 mb-8" />
              <div className="w-full space-y-4">
                 <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                 <div className="h-3 bg-gray-50 rounded w-full"></div>
                 <div className="h-3 bg-gray-50 rounded w-5/6"></div>
                 <div className="h-3 bg-gray-50 rounded w-3/4"></div>
              </div>
              <div className="mt-20 w-full h-40 bg-rose-50 rounded-xl relative overflow-hidden">
                 {photo && <img src={photo} className="w-full h-full object-cover" />}
              </div>
              <div className="mt-auto w-full flex justify-end">
                 <div className="h-6 bg-rose-50 rounded w-1/3"></div>
              </div>
           </div>
        </div>

      </div>

      {showMusicSearch && (
        <MusicSearch 
          onClose={() => setShowMusicSearch(false)}
          onSelect={(song) => {
            setMusicUrl(song.url);
            setMusicLabel(song.name);
            setMusicEnabled(true);
            setShowMusicSearch(false);
          }}
        />
      )}
    </div>
  );
}
