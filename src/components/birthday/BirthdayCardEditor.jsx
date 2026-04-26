import { useState, useRef, useEffect } from 'react';
import BirthdayCardPreview from './BirthdayCardPreview';
import ReelBirthdayCardPreview from './ReelBirthdayCardPreview';
import MusicSearch from '../MusicSearch';
import PublishModal from '../profile/PublishModal';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { CARDS_URL, UPLOAD_URL } from '../../api/config';

export default function BirthdayCardEditor({ defaultData, onBack, isReelTemplate }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  
  const [title, setTitle] = useState(defaultData.title || 'Happy Birthday!');
  const [message, setMessage] = useState(defaultData.message || 'Wishing you a wonderful day!');
  const [signature, setSignature] = useState(defaultData.signature || 'With Love ❤️');
  const [images, setImages] = useState(defaultData.images || []);
  const [musicEnabled, setMusicEnabled] = useState(defaultData.musicEnabled || false);
  const [musicUrl, setMusicUrl] = useState(defaultData.audioUrl || defaultData.musicUrl || '');
  const [musicLabel, setMusicLabel] = useState(defaultData.audioLabel || '');
  const [showMusicSearch, setShowMusicSearch] = useState(false);
  const [giftBoxEnabled, setGiftBoxEnabled] = useState(defaultData.giftBoxEnabled || false);
  const [giftBoxUrl, setGiftBoxUrl] = useState(defaultData.giftBoxUrl || '');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const imageInputRef = useRef(null);

  const isReadOnly = !!(defaultData.urlSlug || defaultData.UrlSlug);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [cardToPublish, setCardToPublish] = useState(null);
  const [localId, setLocalId] = useState(defaultData.id || defaultData.Id);
  
  const { user } = useAuth();
  const { cardId } = useParams();

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    if (files.length + images.length > 4) {
      alert(t('editor.common.upload_limit'));
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        },
        body: formData
      });

      if (response.ok) {
        const uploadedUrls = await response.json();
        setImages(prev => [...prev, ...uploadedUrls].slice(0, 4));
      } else {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        alert(t('editor.common.uploading_failed') || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert(t('editor.common.upload_error') || 'Error during upload');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = ''; // Reset input
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const { bgGradient = 'from-pink-400 via-rose-400 to-violet-500', emoji = '🎂' } = defaultData.style || {};

  const getPreviewData = () => ({
    title,
    message,
    signature,
    images,
    musicEnabled,
    musicUrl: musicUrl || defaultData.musicUrl,
    musicLabel,
    giftBoxEnabled,
    giftBoxUrl,
    style: { bgGradient, emoji }
  });

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
        templateId: cardId,
        recipientName: title, 
        heading: title,
        message1: message,
        message2: '', 
        footer: signature,
        audioUrl: musicEnabled ? musicUrl : null,
        audioLabel: musicEnabled ? musicLabel : null,
        customEmoji: emoji,
        customBgGradient: bgGradient,
        giftBoxUrl: giftBoxEnabled ? giftBoxUrl : null,
        imagesJson: JSON.stringify(images)
      };

      const response = await fetch(CARDS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(cardData)
      });

      if (!response.ok) {
        throw new Error('Failed to save card');
      }

      const result = await response.json();
      const savedId = localId || result.id || result.Id;
      if (savedId && !localId) setLocalId(savedId);

      setIsSaved(true);
      return { ...cardData, id: savedId };
    } catch (e) {
      console.error(e);
      alert('Error saving card: ' + e.message);
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

  if (showPreview) {
    const PreviewComponent = isReelTemplate ? ReelBirthdayCardPreview : BirthdayCardPreview;
    return (
      <PreviewComponent 
        data={getPreviewData()} 
        onClose={() => {
          setShowPreview(false);
          setIsSaved(false);
        }} 
        onBackToEdit={() => setShowPreview(false)}
        onSave={handleSave} 
        onPurchase={handlePurchase}
        saving={saving}
        isSaved={isSaved}
        isReadOnly={isReadOnly}
        onGoToSaved={() => navigate('/dashboard#saved')}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col font-sans">
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
                  <h1 className="text-sm sm:text-xl font-black text-slate-800 tracking-tight leading-none truncate">
                    {t('editor.birthday.studio')} {emoji}
                  </h1>
                  <p className="text-[8px] sm:text-[9px] font-black text-pink-500 uppercase tracking-widest leading-none mt-1">{t('editor.common.creative_mode')}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              <button 
                onClick={() => setShowPreview(true)}
                className="flex-1 sm:flex-none px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition active:scale-95 text-[10px] sm:text-xs cursor-pointer whitespace-nowrap bg-white"
              >
                {t('editor.common.preview')}
              </button>
              <button 
                onClick={handleSave}
                disabled={saving || isReadOnly}
                className={`flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-black hover:opacity-90 transition shadow-lg shadow-pink-500/10 disabled:opacity-50 active:scale-95 text-[10px] sm:text-xs cursor-pointer min-w-[70px] whitespace-nowrap ${isReadOnly ? 'from-slate-400 to-slate-500 shadow-none !cursor-not-allowed' : ''}`}
              >
                {saving ? t('editor.common.saving') : t('editor.common.save')}
              </button>
              {!isReadOnly && (
                <button 
                  onClick={handlePurchase}
                  disabled={saving}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-black hover:opacity-90 transition shadow-lg shadow-emerald-500/10 disabled:opacity-50 active:scale-95 text-[10px] sm:text-xs cursor-pointer min-w-[70px] whitespace-nowrap"
                >
                  💳 {language === 'ka' ? 'შეძენა' : 'Purchase'}
                </button>
              )}
            </div>
          </div>
        </div>

      {/* Workspace */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-8 bg-slate-50/30 no-scrollbar">
        <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 w-full max-w-2xl mx-auto overflow-hidden">
          
          {isSaved && (
            <div className="bg-green-50 border-b border-green-200 p-6 text-center animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="text-green-700 font-bold text-lg mb-4 flex items-center justify-center gap-2">
                 <span>✅</span>
                 {t('editor.common.saved_success')}
               </div>
               <button 
                 onClick={() => navigate('/dashboard')}
                 className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition active:scale-95 shadow-md cursor-pointer"
               >
                 {t('editor.common.go_to_cabinet')}
               </button>
            </div>
          )}

          {isReadOnly && (
            <div className="bg-amber-50 border-b border-amber-200 p-4 flex items-center justify-center gap-3 text-amber-700 text-sm font-bold uppercase tracking-wider">
               <span>🔒</span>
               {t('editor.common.read_only_warn')}
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Original Live Mini Preview */}
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{t('editor.common.live_preview')}</div>
            <div className={`rounded-2xl bg-gradient-to-br ${bgGradient} p-5 text-center space-y-2 shadow-inner`}>
              <div className="text-4xl">{emoji}</div>
              <div className="font-bold text-white text-base drop-shadow">{title || 'Your Title Here'}</div>
              <div className="text-white/80 text-[10px] leading-tight line-clamp-2">{message}</div>
              {images.length > 0 && (
                <div className="flex justify-center gap-1 mt-2">
                  {images.map((img, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white/40 shadow-sm">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                </div>
              )}
              <div className="text-white/70 text-[10px] italic">{signature}</div>
            </div>

            {/* Standard Birthday Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">🎉 {t('editor.birthday.title')}</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  disabled={isReadOnly}
                  className={`w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:border-violet-400 transition ${isReadOnly ? 'bg-slate-50 cursor-not-allowed text-slate-400' : 'hover:border-slate-300'}`}
                  placeholder={t('editor.birthday.title_placeholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">💬 {t('editor.birthday.message')}</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  disabled={isReadOnly}
                  className={`w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-violet-400 transition resize-none text-sm ${isReadOnly ? 'bg-slate-50 cursor-not-allowed text-slate-400' : 'hover:border-slate-300'}`}
                  placeholder={t('editor.birthday.message_placeholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">✍️ {t('editor.birthday.signature')}</label>
                <input
                  value={signature}
                  onChange={e => setSignature(e.target.value)}
                  disabled={isReadOnly}
                  className={`w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-violet-400 transition ${isReadOnly ? 'bg-slate-50 cursor-not-allowed text-slate-400' : 'hover:border-slate-300'}`}
                  placeholder={t('editor.birthday.signature_placeholder')}
                />
              </div>
            </div>

            {/* Photos Section */}
            <div className="bg-sky-50 rounded-2xl p-5 space-y-4 border border-sky-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📸</span>
                  <div>
                    <div className="font-bold text-slate-800">{t('editor.common.photos')}</div>
                    <div className="text-xs text-slate-400">{t('editor.common.upload_limit')}</div>
                  </div>
                </div>
                <button
                  onClick={() => !isReadOnly && imageInputRef.current?.click()}
                  disabled={isReadOnly || uploading}
                  className={`bg-sky-500 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-sky-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md`}
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>+ {t('editor.common.add')}</>
                  )}
                </button>
                <input ref={imageInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-square rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-100">
                        <img src={img} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" alt="" />
                      </div>
                      {!isReadOnly && (
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition cursor-pointer flex items-center justify-center border-2 border-white shadow-lg"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Music Section */}
            <div className="bg-violet-50 rounded-2xl p-5 space-y-4 border border-violet-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎵</span>
                  <div>
                    <div className="font-bold text-slate-800">{t('editor.common.music')}</div>
                    <div className="text-xs text-slate-400">{t('editor.birthday.magic_music')}</div>
                  </div>
                </div>
                <button
                  onClick={() => !isReadOnly && setMusicEnabled(!musicEnabled)}
                  disabled={isReadOnly}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${musicEnabled ? 'bg-violet-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${musicEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {musicEnabled && (
                <div className="space-y-4">
                  {musicUrl ? (
                    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-violet-100 shadow-sm animate-in zoom-in-95 duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg ring-4 ring-violet-50">♪</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-black text-slate-800 truncate">{musicLabel || 'Active Melody'}</div>
                        <button 
                          onClick={() => setShowMusicSearch(true)} 
                          className="px-3 py-1.5 bg-violet-100 text-violet-600 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-violet-200 transition-colors cursor-pointer mt-1 active:scale-95"
                        >
                          {t('editor.common.change_song')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowMusicSearch(true)}
                      className="w-full bg-white border-2 border-dashed border-violet-200 rounded-[2rem] p-8 text-center hover:bg-violet-50 transition group cursor-pointer shadow-inner"
                    >
                       <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform">✨</div>
                       <span className="block text-violet-600 font-black text-lg">{t('editor.common.find_melody')}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Gift Section */}
            <div className="bg-rose-50 rounded-2xl p-5 space-y-4 border border-rose-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <div className="font-bold text-slate-800">{t('editor.birthday.gift_link')}</div>
                    <div className="text-xs text-slate-400">{t('editor.birthday.gift_sub')}</div>
                  </div>
                </div>
                <button
                  onClick={() => !isReadOnly && setGiftBoxEnabled(!giftBoxEnabled)}
                  disabled={isReadOnly}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${giftBoxEnabled ? 'bg-rose-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${giftBoxEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {giftBoxEnabled && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                  <input 
                    value={giftBoxUrl}
                    onChange={e => setGiftBoxUrl(e.target.value)}
                    className="w-full border-2 border-rose-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition hover:border-rose-300"
                    placeholder={t('editor.birthday.gift_placeholder')}
                  />
                </div>
              )}
            </div>

            {/* Final Studio Branding */}
            <div className="text-center pt-6 opacity-30 select-none">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">{t('editor.common.creative_mode')}</div>
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
