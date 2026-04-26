import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CARDS_URL, UPLOAD_URL } from '../../api/config';
import { useNavigate } from 'react-router-dom';
import MusicSearch from '../MusicSearch';
import PublishModal from '../profile/PublishModal';
import MemoryCardView from './MemoryCardView';

const CARDS_API = CARDS_URL;

export default function MemoryCardEditor({ card, existingCard, category, onBack, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const fileInputRef = useRef(null);

  const isReadOnly = !!(existingCard?.urlSlug || existingCard?.UrlSlug);

  const initialHeading = existingCard?.heading || '';
  const initialAudioUrl = existingCard?.audioUrl || card.content?.audioUrl || '';
  const initialAudioLabel = existingCard?.audioLabel || '';
  
  let initialData = {
    galleries: [],
    heroSubtitle: '',
    heroScrollText: '',
    heroPhoto: ''
  };

  if (existingCard?.imagesJson) {
    try {
      const parsed = typeof existingCard.imagesJson === 'string' 
        ? JSON.parse(existingCard.imagesJson) 
        : existingCard.imagesJson;
      
      if (Array.isArray(parsed)) {
        initialData.galleries = parsed;
      } else {
        initialData = { ...initialData, ...parsed };
      }
    } catch (e) {
      console.error("Failed to parse imagesJson", e);
    }
  }

  const [headerText, setHeaderText] = useState(initialHeading);
  const [heroSubtitle, setHeroSubtitle] = useState(initialData.heroSubtitle || '');
  const [heroScrollText, setHeroScrollText] = useState(initialData.heroScrollText || '');
  const [heroPhoto, setHeroPhoto] = useState(initialData.heroPhoto || '');
  const [galleries, setGalleries] = useState(initialData.galleries || []);
  const [preview, setPreview] = useState(false);
  const [localId, setLocalId] = useState(existingCard?.id || existingCard?.Id);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [uploadingGalleryId, setUploadingGalleryId] = useState(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  
  const [musicEnabled, setMusicEnabled] = useState(!!initialAudioUrl);
  const [musicUrl, setMusicUrl] = useState(initialAudioUrl);
  const [musicLabel, setMusicLabel] = useState(initialAudioLabel);
  const [showMusicSearch, setShowMusicSearch] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [cardToPublish, setCardToPublish] = useState(null);

  const handleAddGallery = () => {
    const id = Date.now();
    setGalleries([...galleries, { id, title: '', description: '', images: [] }]);
  };

  const handleUpdateGalleryTitle = (id, title) => {
    setGalleries(galleries.map(g => g.id === id ? { ...g, title } : g));
  };

  const handleUpdateGalleryDesc = (id, description) => {
    setGalleries(galleries.map(g => g.id === id ? { ...g, description } : g));
  };

  const handleRemoveGallery = (id) => {
    setGalleries(galleries.filter(g => g.id !== id));
  };

  const handleImageUpload = async (galleryId, e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingGalleryId(galleryId);
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
        const urls = await response.json();
        if (urls && urls.length > 0) {
          setGalleries(galleries.map(g => 
            g.id === galleryId ? { ...g, images: [...g.images, ...urls] } : g
          ));
        }
      } else {
        alert(t('editor.common.uploading_failed'));
      }
    } catch (error) {
       console.error('Image upload error:', error);
       alert(t('editor.common.upload_error'));
    } finally {
       setUploadingGalleryId(null);
    }
  };

  const handleRemoveImage = (galleryId, imgUrl) => {
    setGalleries(galleries.map(g => 
      g.id === galleryId ? { ...g, images: g.images.filter(url => url !== imgUrl) } : g
    ));
  };

  const handleHeroPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    try {
      const formData = new FormData();
      formData.append('files', file);
      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: { ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}) },
        body: formData
      });
      if (res.ok) {
        const urls = await res.json();
        if (urls?.length > 0) setHeroPhoto(urls[0]);
      }
    } catch (e) { console.error(e); }
    finally { setUploadingHero(false); }
  };

  const handleSave = async () => {
    if (!user) {
      alert(t('auth.login_required'));
      return;
    }
    if (isReadOnly) {
      alert(t('editor.common.read_only_warn'));
      return;
    }
    setSaving(true);
    try {
      const targetId = localId;
      const cardData = {
        id: targetId || undefined,
        templateId: card.templateId || card.id || existingCard?.templateId,
        recipientName: headerText || "Memory Card",
        heading: headerText,
        audioUrl: musicEnabled ? musicUrl : null,
        audioLabel: musicEnabled ? musicLabel : null,
        imagesJson: JSON.stringify({
          galleries,
          heroSubtitle,
          heroScrollText,
          heroPhoto
        })
      };

      const url = targetId ? `${CARDS_API}/${targetId}` : CARDS_API;
      const method = targetId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify(cardData)
      });

      if (response.ok) {
        let result = {};
        try { result = await response.json(); } catch(e) {}
        setSaved(true);
        const savedId = targetId || result.id || result.Id;
        if (savedId && !localId) setLocalId(savedId);
        const savedCard = { ...cardData, id: savedId };
        setCardToPublish(savedCard);
      } else {
        alert(t('editor.common.save_failed'));
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(t('editor.common.save_error'));
    } finally {
      setSaving(false);
    }
  };

  const handlePurchase = () => {
    if (localId) {
      setCardToPublish({
        id: localId,
        templateId: card.templateId || card.id || existingCard?.templateId,
        heading: headerText,
        audioUrl: musicEnabled ? musicUrl : null,
        audioLabel: musicEnabled ? musicLabel : null,
        imagesJson: JSON.stringify({ 
          galleries,
          heroSubtitle,
          heroScrollText,
          heroPhoto
        })
      });
      setPublishModalOpen(true);
    } else {
      handleSave().then(() => { setPublishModalOpen(true); });
    }
  };

  const startPublishProcess = (cardId, slug, scheduleData) => {
    navigate('/payment', { state: { cardId, slug, schedule: scheduleData } });
  };

  const previewData = {
    templateId: card.templateId || card.id || existingCard?.templateId,
    heading: headerText,
    audioUrl: musicEnabled ? musicUrl : null,
    imagesJson: JSON.stringify({ 
      galleries,
      heroSubtitle,
      heroScrollText,
      heroPhoto
    })
  };

  if (preview) {
    return (
      <MemoryCardView 
        card={previewData} 
        onBackToEdit={() => setPreview(false)}
        onSave={handleSave}
        onPurchase={handlePurchase}
        onGoToSaved={() => navigate('/dashboard#saved')}
        saving={saving}
        isReadOnly={isReadOnly}
        isSaved={saved}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col font-sans overflow-hidden">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full relative bg-white sm:shadow-2xl overflow-hidden sm:my-4 sm:rounded-[3rem]">
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
                  <h1 className="text-sm sm:text-xl font-black text-slate-800 italic leading-none truncate">
                    {t('editor.memory.title') || t('editor.memory.studio')}
                  </h1>
                  <p className="text-[8px] sm:text-[9px] font-black text-teal-500 uppercase tracking-widest leading-none mt-1">{t('editor.memory.secure_memories')}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              <button 
                onClick={() => setPreview(true)}
                className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-black hover:bg-slate-50 transition active:scale-95 text-[10px] sm:text-xs"
              >
                {t('editor.common.preview')}
              </button>
              <button 
                onClick={handleSave}
                disabled={saving || isReadOnly}
                className={`flex-1 sm:flex-none px-6 py-2 bg-slate-900 text-white rounded-xl font-black hover:bg-slate-800 transition shadow-lg disabled:opacity-50 active:scale-95 text-[10px] sm:text-xs ${isReadOnly ? 'bg-slate-400 !cursor-not-allowed shadow-none' : ''}`}
              >
                {saving ? t('editor.common.saving') : t('editor.common.save')}
              </button>
              {!isReadOnly && (
                <button 
                  onClick={handlePurchase}
                  className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-black hover:opacity-90 transition shadow-lg shadow-teal-500/20 active:scale-95 text-[10px] sm:text-xs flex items-center justify-center gap-1"
                >
                  💳 <span>{t('editor.common.purchase')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-10 pb-24 relative no-scrollbar">
          {saved && (
            <div className="bg-emerald-50 border-b border-emerald-100 p-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="text-emerald-700 font-bold text-lg mb-6 flex items-center justify-center gap-2">
                 <span>✅</span> {t('editor.common.saved_success')}
               </div>
               <button onClick={() => navigate('/dashboard#saved')} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-emerald-700 transition active:scale-95 shadow-lg">
                 {t('editor.common.dashboard')}
               </button>
            </div>
          )}

          <section className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 border border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M22 13h-8v-2h8v2m0-6h-8v2h8V7m0 12h-8v2h8v-2M7 19c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h10V3H7c-2.21 0-4 1.79-4 4v10c0 2.21 1.79 4 4 4h10v-2H7z"/></svg>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-teal-500 uppercase tracking-[0.3em] mb-4">{t('editor.memory.main_heading')}</label>
                  <input value={headerText} onChange={e => setHeaderText(e.target.value)} className="w-full text-4xl md:text-6xl font-black text-slate-900 border-none focus:ring-0 placeholder-slate-200 bg-transparent tracking-tighter leading-tight" placeholder={t('editor.memory.heading_placeholder')} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-teal-500 uppercase tracking-[0.3em] mb-2">{t('editor.memory.hero_subtitle')}</label>
                  <input value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} className="w-full text-lg font-bold text-slate-600 bg-slate-50 rounded-xl px-4 py-2 border-none focus:ring-2 focus:ring-teal-500/20" placeholder={t('editor.memory.hero_subtitle_placeholder')} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-teal-500 uppercase tracking-[0.3em] mb-2">{t('editor.memory.hero_scroll')}</label>
                  <input value={heroScrollText} onChange={e => setHeroScrollText(e.target.value)} className="w-full text-lg font-bold text-slate-600 bg-slate-50 rounded-xl px-4 py-2 border-none focus:ring-2 focus:ring-teal-500/20" placeholder={t('editor.memory.hero_scroll_placeholder')} />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-[10px] font-black text-teal-500 uppercase tracking-[0.3em] mb-4">{t('editor.memory.main_photo')}</label>
                <div 
                  onClick={() => document.getElementById('heroPhotoInput').click()}
                  className="aspect-[4/3] rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-all overflow-hidden relative"
                >
                  {heroPhoto ? (
                    <>
                      <img src={heroPhoto} className="w-full h-full object-cover" alt="Hero" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white font-black text-xs uppercase tracking-widest">{t('editor.love.change_photo')}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl">🖼️</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{uploadingHero ? t('editor.common.uploading') : t('editor.love.upload_photo')}</span>
                    </>
                  )}
                </div>
                <input id="heroPhotoInput" type="file" className="hidden" accept="image/*" onChange={handleHeroPhotoUpload} />
              </div>
            </div>
          </section>

          <div className="space-y-10">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('editor.memory.galleries')}</h2>
              <button onClick={handleAddGallery} className="w-12 h-12 bg-teal-500 text-white rounded-2xl flex items-center justify-center hover:bg-teal-600 transition shadow-lg shadow-teal-500/30 active:scale-90">+</button>
            </div>

            <div className="space-y-8">
              {galleries.map((gallery) => (
                <div key={gallery.id} className="bg-slate-50 rounded-[3rem] p-8 sm:p-12 border border-white shadow-xl shadow-slate-200/30 relative group animate-in slide-in-from-bottom-8 duration-500">
                  <button onClick={() => handleRemoveGallery(gallery.id)} className="absolute top-8 right-8 w-10 h-10 bg-white text-slate-400 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:text-red-500 shadow-sm">×</button>
                  <div className="max-w-2xl">
                    <input value={gallery.title} onChange={e => handleUpdateGalleryTitle(gallery.id, e.target.value)} className="w-full text-2xl sm:text-4xl font-black text-slate-800 bg-transparent border-none focus:ring-0 placeholder-slate-300" placeholder={t('editor.memory.gallery_placeholder')} />
                    <textarea 
                      value={gallery.description} 
                      onChange={e => handleUpdateGalleryDesc(gallery.id, e.target.value)} 
                      className="w-full mt-4 text-lg font-medium text-slate-400 bg-transparent border-none focus:ring-0 placeholder-slate-200 resize-none h-20" 
                      placeholder={t('editor.memory.gallery_desc_placeholder')} 
                    />
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {gallery.images.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden group/img shadow-md">
                          <img src={url} className="w-full h-full object-cover transition duration-500 group-hover/img:scale-110" alt="" />
                          <button onClick={() => handleRemoveImage(gallery.id, url)} className="absolute inset-0 bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition font-black text-xs">REMOVE</button>
                        </div>
                      ))}
                      <button onClick={() => { fileInputRef.current.galleryId = gallery.id; fileInputRef.current.click(); }} disabled={uploadingGalleryId === gallery.id} className="aspect-square bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 hover:border-teal-400 hover:bg-teal-50 transition-all group disabled:opacity-50">
                        {uploadingGalleryId === gallery.id ? <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" /> : <><span className="text-2xl group-hover:scale-125 transition-transform">📸</span><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Photo</span></>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={e => handleImageUpload(fileInputRef.current.galleryId, e)} className="hidden" accept="image/*" multiple />
      {showMusicSearch && (
        <MusicSearch onClose={() => setShowMusicSearch(false)} onSelect={(song) => { setMusicUrl(song.url); setMusicLabel(song.name); setShowMusicSearch(false); }} />
      )}
      <PublishModal isOpen={publishModalOpen} card={cardToPublish} onClose={() => setPublishModalOpen(false)} onProceed={startPublishProcess} />
    </div>
  );
}
