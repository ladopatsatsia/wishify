import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CARDS_URL, UPLOAD_URL } from '../../api/config';
import MemoryCardView from './MemoryCardView';

export default function MemoryCardEditor({ card, category, onBack, onClose }) {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [headerText, setHeaderText] = useState(card.defaultHeading || 'Our Beautiful Journey');
  const [galleries, setGalleries] = useState([
    { id: Date.now(), name: 'Gallery 1', images: [] }
  ]);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [uploadingGalleryId, setUploadingGalleryId] = useState(null);
  const fileInputRef = useRef(null);

  // Load existing data if any
  useEffect(() => {
    if (card.imagesJson) {
      try {
        const data = JSON.parse(card.imagesJson);
        if (data.type === 'memory') {
          setHeaderText(data.headerText || '');
          setGalleries(data.galleries || []);
        }
      } catch (e) {
        console.error("Failed to parse imagesJson", e);
      }
    }
  }, [card]);

  const addGallery = () => {
    setGalleries([...galleries, { id: Date.now(), name: `New Gallery ${galleries.length + 1}`, images: [] }]);
  };

  const removeGallery = (id) => {
    setGalleries(galleries.filter(g => g.id !== id));
  };

  const updateGalleryName = (id, name) => {
    setGalleries(galleries.map(g => g.id === id ? { ...g, name } : g));
  };

  // Multi-file upload logic
  const handleFileUpload = async (e, galleryId) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Check gallery limit (25 photos)
    const gallery = galleries.find(g => g.id === galleryId);
    if (gallery.images.length + files.length > 25) {
      alert(t('editor.memory.limit_alert'));
      return;
    }

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
        const uploadedUrls = await response.json();
        setGalleries(galleries.map(g => {
          if (g.id === galleryId) {
            return { ...g, images: [...g.images, ...uploadedUrls] };
          }
          return g;
        }));
      } else {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        alert(t('editor.common.uploading_failed') || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert(t('editor.common.upload_error') || 'Error during upload');
    } finally {
      setUploadingGalleryId(null);
      e.target.value = ''; // Reset input
    }
  };

  const removeImage = (galleryId, index) => {
    setGalleries(galleries.map(g => {
      if (g.id === galleryId) {
        const newImages = g.images.filter((_, i) => i !== index);
        return { ...g, images: newImages };
      }
      return g;
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const memoryData = {
        type: 'memory',
        headerText,
        galleries: galleries.filter(g => g.images.length > 0)
      };

      const cardData = {
        templateId: card.templateId || card.id,
        recipientName: "Memory Collection",
        heading: headerText,
        message1: "A collection of memories",
        message2: "",
        footer: "Sent with Love from Wishify",
        imagesJson: JSON.stringify(memoryData),
      };

      const isExisting = card.id && card.id.length > 20;
      const url = isExisting ? `${CARDS_URL}/${card.id}` : CARDS_URL;
      const method = isExisting ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify(cardData)
      });

      if (response.ok) {
        setSaved(true);
        const result = await response.json();
        const cardId = isExisting ? card.id : result.id;
        setShareUrl(`${window.location.origin}/view/memory/${cardId}`);
      }
    } catch (error) {
      console.error('Error saving memory card:', error);
    } finally {
      setSaving(false);
    }
  };

  if (preview) {
    const previewData = {
      ...card,
      heading: headerText,
      imagesJson: JSON.stringify({ type: 'memory', headerText, galleries })
    };
    return (
      <div className="fixed inset-0 z-[100] bg-black overflow-y-auto">
        <MemoryCardView 
          card={previewData} 
          onBackToEdit={() => setPreview(false)} 
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          {/* Left: Back Button Only */}
          <div className="flex items-center">
            <button 
              onClick={onBack} 
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-2xl transition text-slate-600 font-bold text-sm border border-transparent hover:border-slate-100 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="15 19l-7-7 7-7" /></svg>
              {t('editor.common.back')}
            </button>
          </div>

          {/* Center: Title (Absolute Centered) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none sm:pointer-events-auto">
            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none text-nowrap">
              {t('editor.memory.studio')}
            </h1>
            <p className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em] leading-none mt-1">{t('editor.common.creative_mode')}</p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setPreview(true)}
              className="hidden sm:block px-5 py-2.5 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition active:scale-95 text-xs"
            >
              {t('editor.common.preview')}
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-2.5 bg-teal-500 text-white rounded-2xl font-black hover:bg-teal-600 transition shadow-xl shadow-teal-500/20 disabled:opacity-50 active:scale-95 text-xs min-w-[100px]"
            >
              {saving ? t('editor.common.saving') : t('editor.common.save')}
            </button>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 max-w-5xl mx-auto w-full">
        {saved && (
          <div className="bg-white border-2 border-green-100 rounded-[2.5rem] p-8 animate-in fade-in slide-in-from-top-4 duration-500 shadow-2xl shadow-green-100/50 space-y-4">
            <div className="text-green-600 font-black text-xl flex items-center gap-3">
              <span className="text-3xl">✨</span>
              {t('editor.common.saved_success')}
            </div>
            <div className="flex justify-center pt-2">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-teal-500 text-white px-10 py-4 rounded-2xl font-black hover:bg-teal-600 transition active:scale-95 shadow-lg shadow-teal-500/20"
              >
                {t('editor.common.go_to_cabinet')}
              </button>
            </div>
          </div>
        )}

        {/* Header Setting */}
        <section className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 border border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M22 13h-8v-2h8v2m0-6h-8v2h8V7m0 12h-8v2h8v-2M7 19c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h10V3H7c-2.21 0-4 1.79-4 4v10c0 2.21 1.79 4 4 4h10v-2H7z"/></svg>
          </div>
          <label className="block text-[10px] font-black text-teal-500 uppercase tracking-[0.3em] mb-4">
            {t('editor.memory.main_heading')}
          </label>
          <input 
            value={headerText}
            onChange={e => setHeaderText(e.target.value)}
            className="w-full text-4xl md:text-7xl font-black text-slate-900 border-none focus:ring-0 placeholder-slate-200 bg-transparent tracking-tighter leading-tight"
            placeholder={t('editor.memory.heading_placeholder')}
          />
        </section>

        {/* Galleries List */}
        <div className="space-y-10">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {t('editor.memory.galleries')}
            </h2>
            <button 
              onClick={addGallery}
              className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 text-teal-600 font-black hover:scale-105 transition active:scale-95"
            >
              <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg shadow-teal-500/30">+</div>
              {t('editor.memory.add_gallery')}
            </button>
          </div>

          {galleries.map((gallery, gIdx) => (
            <div key={gallery.id} className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-white space-y-8 relative group">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-3xl shadow-inner">📁</div>
                <div className="flex-1 space-y-1 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t('editor.memory.gallery_name')}</label>
                  <input 
                    value={gallery.name}
                    onChange={e => updateGalleryName(gallery.id, e.target.value)}
                    className="text-2xl font-black text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 w-full placeholder-slate-200"
                    placeholder={t('editor.memory.gallery_placeholder')}
                  />
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">{gallery.images.length}/25</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('editor.memory.photos_count')}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Local Upload Input */}
                    <div className="relative">
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        className="hidden" 
                        id={`file-upload-${gallery.id}`}
                        onChange={(e) => handleFileUpload(e, gallery.id)}
                      />
                      <label 
                        htmlFor={`file-upload-${gallery.id}`}
                        className={`flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-teal-600 transition cursor-pointer shadow-xl active:scale-95 text-xs whitespace-nowrap ${uploadingGalleryId === gallery.id ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        {uploadingGalleryId === gallery.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{t('editor.common.uploading')}</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            <span>{t('editor.memory.add_photos') || t('editor.common.add')}</span>
                          </>
                        )}
                      </label>
                    </div>

                    {/* Delete Gallery Button (Moved here from absolute position) */}
                    <button 
                      onClick={() => removeGallery(gallery.id)}
                      title={t('editor.memory.remove') || 'Delete Gallery'}
                      className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95 border border-transparent hover:border-red-100 flex-shrink-0"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-4">
                {gallery.images.map((img, iIdx) => (
                  <div key={iIdx} className="relative group/img aspect-square rounded-3xl overflow-hidden bg-slate-100 border-2 border-white shadow-lg transition-transform hover:scale-105 active:scale-95">
                    <img 
                      src={img} 
                      className="w-full h-full object-cover transition duration-500 group-hover/img:scale-110" 
                      alt="Uploaded Preview" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => removeImage(gallery.id, iIdx)}
                        className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-white hover:text-red-500 transition-all"
                      >
                         {t('editor.memory.remove') || 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Empty State / Prompt */}
                {gallery.images.length === 0 && !uploadingGalleryId && (
                  <label 
                    htmlFor={`file-upload-${gallery.id}`}
                    className="col-span-full py-16 flex flex-col items-center justify-center gap-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 hover:text-teal-500 hover:border-teal-200 transition-all cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg text-3xl">🖼️</div>
                    <div className="text-center">
                      <p className="font-bold text-slate-600">{t('editor.memory.no_photos')}</p>
                      <p className="text-xs">{t('editor.memory.click_to_upload')}</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Finish Info */}
        <div className="text-center pb-24 pt-10">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-xl shadow-slate-100 border border-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest text-nowrap">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            {t('editor.memory.secure_memories')}
          </div>
        </div>
      </div>
    </div>
  );
}
