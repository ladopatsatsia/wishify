import { useState, useRef, useEffect } from 'react';
import LoveCardView from './LoveCardView';
import MusicSearch from '../MusicSearch';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CARDS_URL, UPLOAD_URL } from '../../api/config';
import { useNavigate } from 'react-router-dom';
import PublishModal from '../profile/PublishModal';

const CARDS_API = CARDS_URL;

export default function LoveLetterEditor({ card, existingCard, category, onBack, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [cardToPublish, setCardToPublish] = useState(null);
  const [localId, setLocalId] = useState(existingCard?.id || existingCard?.Id);
  const fileInputRef = useRef(null);

  const isReadOnly = !!(existingCard?.urlSlug || existingCard?.UrlSlug);

  // Initialize from existingCard or template
  const initialHeading = existingCard?.heading || card.content?.heading || 'My Dearest...';
  const initialMessage1 = existingCard?.message1 || card.content?.message1 || '';
  const initialMessage2 = existingCard?.message2 || card.content?.message2 || '';
  const initialFooter = existingCard?.footer || card.content?.footer || 'Forever Yours, [Your Name]';
  const initialAudioUrl = existingCard?.audioUrl || card.content?.audioUrl || '';
  const initialAudioLabel = existingCard?.audioLabel || '';
  
  let initialImages = [];
  if (existingCard?.imagesJson) {
    try {
      initialImages = typeof existingCard.imagesJson === 'string' 
        ? JSON.parse(existingCard.imagesJson) 
        : existingCard.imagesJson;
    } catch (e) {
      console.error("Failed to parse imagesJson", e);
    }
  }

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
    if (!user) {
      alert(t('auth.login_required') || "Please log in to save your cards!");
      return;
    }
    if (isReadOnly) {
      alert(t('editor.common.read_only_warn'));
      return;
    }
    setSaving(true);
    try {
      const cardData = {
        templateId: card.id || existingCard?.templateId,
        recipientName: heading || "Someone Special",
        heading,
        message1,
        message2,
        footer,
        audioUrl: musicEnabled ? musicUrl : null,
        audioLabel: musicEnabled ? musicLabel : null,
        imagesJson: JSON.stringify([photo].filter(Boolean)),
        categoryId: category || 'love'
      };

      const url = existingCard?.id ? `${CARDS_API}/${existingCard.id}` : CARDS_API;
      const method = existingCard?.id ? 'PUT' : 'POST';

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
        const savedId = localId || result.id || result.Id;
        if (savedId && !localId) setLocalId(savedId);
        
        setShareUrl(`${window.location.origin}/view/love/${savedId}`);
        return { ...cardData, id: savedId };
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.message || t('editor.common.save_failed') || "Failed to save card");
        return null;
      }
    } catch (error) {
      console.error('Error saving love letter:', error);
      alert(t('editor.common.save_error') || "An error occurred while saving");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handlePurchase = async () => {
    const savedCard = await handleSave();
    if (savedCard) {
      setCardToPublish(savedCard);
      setPublishModalOpen(true);
    }
  };

  const startPublishProcess = (cardId, slug, scheduleData) => {
    setPublishModalOpen(false);
    navigate('/payment', { state: { cardId, slug, schedule: scheduleData } });
  };

  const previewData = {
    ...card,
    heading,
    message1,
    message2,
    footer,
    audioUrl: musicEnabled ? musicUrl : null,
    imagesJson: JSON.stringify([photo].filter(Boolean))
  };

  if (preview) {
    return (
      <div className="fixed inset-0 z-[100] bg-black">
        <LoveCardView 
          card={previewData} 
          onBackToEdit={() => setPreview(false)} 
          onSave={handleSave}
          onPurchase={handlePurchase}
          onGoToSaved={() => navigate('/dashboard#saved')}
          saving={saving}
          isSaved={saved}
          isReadOnly={isReadOnly}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#F8FAFC] flex flex-col font-sans">
      <div className="flex-1 flex flex-col bg-white overflow-hidden sm:rounded-[32px] sm:shadow-2xl max-w-7xl mx-auto w-full relative">
      {/* Header */}
        <div className="bg-white border-b border-slate-100 p-2 sm:p-6 sticky top-0 z-50 shadow-sm sm:shadow-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <div className="flex items-center gap-2">
                <button 
                  onClick={onBack} 
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl sm:rounded-2xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="overflow-hidden">
                  <h1 className="text-sm sm:text-xl font-black text-slate-800 tracking-tight leading-none truncate italic">
                    {t('editor.love.title') || 'Love Letter'} 💌
                  </h1>
                  <p className="text-[8px] sm:text-[9px] font-black text-rose-500 uppercase tracking-widest leading-none mt-1">{t('editor.love.sub_title')}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              <button 
                onClick={() => setPreview(true)}
                className="flex-1 sm:flex-none px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition active:scale-95 text-[10px] sm:text-xs cursor-pointer whitespace-nowrap bg-white"
              >
                {t('editor.common.preview')}
              </button>
              <button 
                onClick={handleSave}
                disabled={saving || isReadOnly}
                className={`flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-black hover:opacity-90 transition shadow-lg shadow-rose-500 disabled:opacity-50 active:scale-95 text-[10px] sm:text-xs cursor-pointer min-w-[70px] whitespace-nowrap ${isReadOnly ? 'from-slate-400 to-slate-500 shadow-none !cursor-not-allowed' : ''}`}
              >
                {saving ? t('editor.common.saving') : t('editor.common.save')}
              </button>
              {!isReadOnly && (
                <button 
                  onClick={handlePurchase}
                  disabled={saving}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-black hover:opacity-90 transition shadow-lg shadow-emerald-500 disabled:opacity-50 active:scale-95 text-[10px] sm:text-xs cursor-pointer min-w-[70px] whitespace-nowrap"
                >
                  💳 {t('editor.common.purchase')}
                </button>
              )}
            </div>
          </div>
        </div>

      {/* Workspace */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-8 no-scrollbar pb-20">
        <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-2xl mx-auto overflow-hidden">
          
          {saved && (
            <div className="bg-emerald-50 border-b border-emerald-100 p-6 text-center animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="text-emerald-700 font-bold text-lg mb-4 flex items-center justify-center gap-2">
                 <span>✅</span>
                 {t('editor.common.saved_success')}
               </div>
               <div className="flex gap-2 max-w-md mx-auto">
                 <input 
                   readOnly 
                   value={shareUrl} 
                   className="flex-1 bg-white border border-emerald-100 rounded-xl px-4 py-2 text-xs text-slate-600 focus:outline-none"
                 />
                 <button 
                   onClick={() => {
                     navigator.clipboard.writeText(shareUrl);
                     alert(t('editor.common.copy_success') || "Link copied!");
                   }}
                   className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition active:scale-95 shadow-md cursor-pointer"
                 >
                    {t('editor.common.copy') || 'COPY'}
                 </button>
               </div>
            </div>
          )}

          {isReadOnly && (
            <div className="bg-amber-50 border-b border-amber-200 p-4 flex items-center justify-center gap-3 text-amber-700 text-sm font-bold uppercase tracking-wider">
               <span>🔒</span>
               {t('editor.common.read_only_warn')}
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Live Mini Preview */}
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{t('editor.common.live_preview')}</div>
            <div className={`rounded-2xl bg-white border-2 border-rose-50 p-8 text-center space-y-4 shadow-inner font-serif italic`}>
              <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-xl mx-auto">💌</div>
              <div className="w-full h-px bg-rose-50" />
              <div className="font-bold text-slate-800 text-base">{heading || 'My Dearest...'}</div>
              <div className="text-slate-500 text-[10px] leading-relaxed line-clamp-3 whitespace-pre-wrap">{message1}</div>
              {photo && (
                <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-rose-50 shadow-sm">
                  <img src={photo} className="w-full h-full object-cover" alt="" />
                </div>
              )}
              <div className="text-rose-500 text-[12px] font-black">{footer}</div>
            </div>

            {/* Editor Sections */}
            <div className="space-y-4 font-sans">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 italic">🌹 {t('editor.love.who_is_for')}</label>
                <input
                  value={heading}
                  onChange={e => setHeading(e.target.value)}
                  disabled={isReadOnly}
                  className={`w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:border-rose-400 transition italic ${isReadOnly ? 'bg-slate-50 cursor-not-allowed text-slate-400' : 'hover:border-slate-300'}`}
                  placeholder="My Dearest..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 italic">💌 {t('editor.love.message')}</label>
                <textarea
                  value={message1}
                  onChange={e => setMessage1(e.target.value)}
                  rows={6}
                  disabled={isReadOnly}
                  className={`w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-rose-400 transition resize-none text-sm italic leading-relaxed ${isReadOnly ? 'bg-slate-50 cursor-not-allowed text-slate-400' : 'hover:border-slate-300'}`}
                  placeholder={t('editor.love.message_placeholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 italic">✨ {t('editor.love.final_wish')}</label>
                <input
                  value={message2}
                  onChange={e => setMessage2(e.target.value)}
                  disabled={isReadOnly}
                  className={`w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-rose-400 transition italic ${isReadOnly ? 'bg-slate-50 cursor-not-allowed text-slate-400' : 'hover:border-slate-300'}`}
                  placeholder="..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 italic">✍️ {t('editor.love.signature')}</label>
                <input
                  value={footer}
                  onChange={e => setFooter(e.target.value)}
                  disabled={isReadOnly}
                  className={`w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-rose-500 font-bold focus:outline-none focus:border-rose-400 transition italic ${isReadOnly ? 'bg-slate-50 cursor-not-allowed text-slate-400' : 'hover:border-slate-300'}`}
                  placeholder="Forever Yours,"
                />
              </div>
            </div>

            {/* Photo Section */}
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📸</span>
                    <div>
                      <div className="font-bold text-slate-800">{t('editor.love.photo')}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-1">Special Memory</div>
                    </div>
                  </div>
                  <button
                    onClick={() => !isReadOnly && fileInputRef.current?.click()}
                    disabled={isReadOnly || uploading}
                    className={`bg-rose-500 text-white rounded-xl px-4 py-2 text-xs font-black shadow-lg shadow-rose-200 hover:bg-rose-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>+ {photo ? t('editor.love.change_photo') : t('editor.love.upload_photo')}</>
                    )}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>

                {photo && (
                  <div className="relative group max-w-xs mx-auto">
                    <div className="aspect-square rounded-2xl overflow-hidden border-4 border-rose-50 shadow-md">
                      <img src={photo} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" alt="" />
                    </div>
                    {!isReadOnly && (
                      <button
                        onClick={() => setPhoto('')}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full text-sm font-bold flex items-center justify-center border-2 border-white shadow-lg cursor-pointer hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    )}
                  </div>
                )}
            </div>

            {/* Music Section */}
            <div className="bg-rose-50 rounded-2xl p-5 space-y-4 border border-rose-100 shadow-sm font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎵</span>
                  <div>
                    <div className="font-bold text-slate-800">{t('editor.common.music')}</div>
                    <div className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">{t('editor.love.active_soundtrack')}</div>
                  </div>
                </div>
                <button
                  onClick={() => !isReadOnly && setMusicEnabled(!musicEnabled)}
                  disabled={isReadOnly}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${musicEnabled ? 'bg-rose-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${musicEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {musicEnabled && (
                <div className="space-y-4">
                  {musicUrl ? (
                    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-rose-100 shadow-sm animate-in zoom-in-95 duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg ring-4 ring-rose-50">♪</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-black text-slate-800 truncate">{musicLabel || 'Active Melody'}</div>
                        <button 
                          onClick={() => !isReadOnly && setShowMusicSearch(true)} 
                          className="px-3 py-1.5 bg-rose-50 text-rose-500 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-rose-100 transition-colors cursor-pointer mt-1 active:scale-95"
                        >
                          {t('editor.common.change_song')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => !isReadOnly && setShowMusicSearch(true)}
                      disabled={isReadOnly}
                      className="w-full bg-white border-2 border-dashed border-rose-200 rounded-[2rem] p-8 text-center hover:bg-rose-50 transition group cursor-pointer shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">✨</div>
                       <span className="block text-rose-500 font-black text-lg italic">{t('editor.love.find_magic_music')}</span>
                       <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest block">{t('editor.love.search_by_song')}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Branding */}
            <div className="text-center pt-6 opacity-30 select-none">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 italic">LOVE STUDIO 💌</div>
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
      <PublishModal
        isOpen={publishModalOpen}
        card={cardToPublish}
        onClose={() => setPublishModalOpen(false)}
        onProceed={startPublishProcess}
      />
    </div>
    </div>
  );
}
