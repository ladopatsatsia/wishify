import { useState, useRef, useEffect } from 'react';
import InvitationView from './InvitationView';
import MusicSearch from '../MusicSearch';
import PublishModal from '../profile/PublishModal';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CARDS_URL, UPLOAD_URL } from '../../api/config';
import { useNavigate } from 'react-router-dom';

const CARDS_API = CARDS_URL;

export default function InvitationEditor({ card, existingCard, category, onBack, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const fileInputRef = useRef(null);

  const isReadOnly = !!(existingCard?.urlSlug || existingCard?.UrlSlug);

  // Initialize from existingCard (user's saved data) or start clean for templates
  const initialHeading = existingCard?.heading || '';
  const initialMessage1 = existingCard?.message1 || '';
  const initialMessage2 = existingCard?.message2 || '';
  const initialFooter = existingCard?.footer || '';
  const initialAudioUrl = existingCard?.audioUrl || card.content?.audioUrl || '';
  const initialAudioLabel = existingCard?.audioLabel || '';
  
  let initialData = {
    images: [],
    locations: [],
    phones: [],
    seating: []
  };

  if (existingCard?.imagesJson) {
    try {
      const parsed = typeof existingCard.imagesJson === 'string' 
        ? JSON.parse(existingCard.imagesJson) 
        : existingCard.imagesJson;
      
      if (Array.isArray(parsed)) {
        initialData.images = parsed;
      } else {
        initialData = { ...initialData, ...parsed };
      }
    } catch (e) {
      console.error("Failed to parse imagesJson", e);
    }
  }

  const [heading, setHeading] = useState(initialHeading);
  const [message1, setMessage1] = useState(initialMessage1);
  const [message2, setMessage2] = useState(initialMessage2);
  const [footer, setFooter] = useState(initialFooter);
  const [eventDate, setEventDate] = useState(initialData.eventDate || '');
  const [photos, setPhotos] = useState(initialData.images || []);
  const [locations, setLocations] = useState(initialData.locations || []);
  const [phones, setPhones] = useState(initialData.phones.length > 0 ? initialData.phones : ['']);
  const [seating, setSeating] = useState(initialData.seating || []);
  
  const [preview, setPreview] = useState(false);
  const [localId, setLocalId] = useState(existingCard?.id || existingCard?.Id);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(!!initialAudioUrl);
  const [musicUrl, setMusicUrl] = useState(initialAudioUrl);
  const [musicLabel, setMusicLabel] = useState(initialAudioLabel);
  const [showMusicSearch, setShowMusicSearch] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [cardToPublish, setCardToPublish] = useState(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

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
        const urls = await response.json();
        if (urls && urls.length > 0) {
          setPhotos(prev => [...prev, ...urls]);
        }
      } else {
        alert(t('editor.common.uploading_failed'));
      }
    } catch (error) {
       console.error('Image upload error:', error);
       alert(t('editor.common.upload_error'));
    } finally {
       setUploading(false);
    }
  };

  const handleAddLocation = () => {
    setLocations([...locations, { name: '', time: '', desc: '' }]);
  };

  const handleUpdateLocation = (index, field, value) => {
    const newLocations = [...locations];
    newLocations[index][field] = value;
    setLocations(newLocations);
  };

  const handleRemoveLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleAddPhone = () => {
    setPhones([...phones, '']);
  };

  const handleUpdatePhone = (index, value) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  const handleRemovePhone = (index) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const handleAddSeating = () => {
    setSeating([...seating, { name: '', phone: '', table: '', seat: '' }]);
  };

  const handleUpdateSeating = (index, field, value) => {
    const newSeating = [...seating];
    newSeating[index][field] = value;
    setSeating(newSeating);
  };

  const handleRemoveSeating = (index) => {
    setSeating(seating.filter((_, i) => i !== index));
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
        recipientName: heading || "Wedding Invitation",
        heading,
        message1,
        message2,
        footer,
        audioUrl: musicEnabled ? musicUrl : null,
        audioLabel: musicEnabled ? musicLabel : null,
        imagesJson: JSON.stringify({
          images: photos,
          locations,
          phones,
          seating,
          eventDate
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
        const savedCard = { 
          ...cardData, 
          id: savedId
        };
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
        heading,
        message1,
        message2,
        footer,
        audioUrl: musicEnabled ? musicUrl : null,
        audioLabel: musicEnabled ? musicLabel : null,
        imagesJson: JSON.stringify({
          images: photos,
          locations,
          phones,
          seating,
          eventDate
        })
      });
      setPublishModalOpen(true);
    } else {
      handleSave().then(() => {
        setPublishModalOpen(true);
      });
    }
  };

  const startPublishProcess = (cardId, slug, scheduleData) => {
    navigate('/payment', { state: { cardId, slug, schedule: scheduleData } });
  };

  const previewData = {
    templateId: card.templateId || card.id || existingCard?.templateId,
    heading,
    message1,
    message2,
    footer,
    audioUrl: musicEnabled ? musicUrl : null,
    imagesJson: JSON.stringify({
       images: photos,
       locations,
       phones,
       seating,
       eventDate
    })
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#F8FAFC] flex flex-col font-sans">
      <div className="flex-1 flex flex-col bg-white overflow-hidden sm:rounded-[32px] sm:shadow-2xl max-w-7xl mx-auto w-full relative">
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
                    {t('editor.invitation.title')}
                  </h1>
                  <p className="text-[8px] sm:text-[9px] font-black text-amber-500 uppercase tracking-widest leading-none mt-1">{t('editor.invitation.sub_title')}</p>
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
                className={`flex-1 sm:flex-none px-6 py-2 bg-slate-900 text-white rounded-xl font-black hover:bg-slate-800 transition shadow-lg disabled:opacity-50 active:scale-95 text-[10px] sm:text-xs ${isReadOnly ? 'bg-slate-400 !cursor-not-allowed' : ''}`}
              >
                {saving ? t('editor.common.saving') : t('editor.common.save')}
              </button>
              {!isReadOnly && (
                <button 
                  onClick={handlePurchase}
                  disabled={saving}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-black hover:opacity-90 transition shadow-lg shadow-emerald-500 disabled:opacity-50 active:scale-95 text-[10px] sm:text-xs cursor-pointer min-w-[70px] whitespace-nowrap"
                >
                  💳 {language === 'ka' ? 'შეძენა' : 'Purchase'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 sm:p-8 bg-slate-50 no-scrollbar">
          <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 w-full max-w-2xl mx-auto overflow-hidden">
            {saved && (
              <div className="bg-emerald-50 border-b border-emerald-100 p-8 text-center animate-in fade-in slide-in-from-top-4 duration-500 flex flex-col items-center gap-4">
                 <div className="text-emerald-700 font-bold text-lg flex items-center justify-center gap-2">
                   <span>✅</span>
                   {t('editor.common.saved_success')}
                 </div>
                 <button 
                   onClick={() => navigate('/dashboard#saved')}
                   className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-emerald-700 transition active:scale-95 shadow-lg shadow-emerald-600/20 cursor-pointer"
                 >
                   {t('editor.common.go_to_dashboard') || 'GO TO DASHBOARD'}
                 </button>
              </div>
            )}

            {isReadOnly && (
              <div className="bg-amber-50 border-b border-amber-200 p-4 flex items-center justify-center gap-3 text-amber-700 text-sm font-bold uppercase tracking-wider">
                 <span>🔒</span>
                 {t('editor.common.read_only_warn')}
              </div>
            )}

            <div className="p-4 sm:p-10 space-y-12">

              <div className="space-y-8">
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t('editor.invitation.basic_info')}</div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t('editor.invitation.title')}</label>
                    <input 
                      value={heading}
                      onChange={e => setHeading(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 font-bold focus:bg-white focus:border-amber-400 transition-all outline-none"
                      placeholder={t('editor.invitation.heading_placeholder')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t('editor.invitation.sub_title')}</label>
                    <textarea 
                      value={message1}
                      onChange={e => setMessage1(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 font-bold focus:bg-white focus:border-amber-400 transition-all outline-none min-h-[120px] resize-none"
                      placeholder={t('editor.invitation.msg_placeholder')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t('editor.invitation.signature')}</label>
<input 
  value={footer}
  onChange={e => setFooter(e.target.value)}
  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 font-bold focus:bg-white focus:border-amber-400 transition-all outline-none"
  placeholder={t('editor.invitation.signature_placeholder')}
/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t('editor.invitation.event_date')}</label>
<input 
  value={eventDate}
  onChange={e => setEventDate(e.target.value)}
  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 font-bold focus:bg-white focus:border-amber-400 transition-all outline-none"
  placeholder={t('editor.invitation.date_placeholder')}
/>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t('editor.invitation.locations')}</div>
                  <button onClick={handleAddLocation} className="text-amber-600 font-black text-[10px] uppercase tracking-widest hover:text-amber-700 transition flex items-center gap-1.5">
                    <span>+</span> {t('editor.invitation.add_location')}
                  </button>
                </div>
                <div className="space-y-4">
                  {locations.map((loc, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-[2rem] p-6 sm:p-8 border border-slate-100 relative group animate-in slide-in-from-right-4 duration-300">
                      {!isReadOnly && (
                        <button onClick={() => handleRemoveLocation(idx)} className="absolute top-4 right-4 w-8 h-8 bg-white text-slate-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:text-red-500 shadow-sm">×</button>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('editor.invitation.location_name')}</label>
                          <input value={loc.name} onChange={e => handleUpdateLocation(idx, 'name', e.target.value)} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-amber-400 transition-all" placeholder="e.g. Wedding Hall" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('editor.invitation.location_time')}</label>
                          <input value={loc.time} onChange={e => handleUpdateLocation(idx, 'time', e.target.value)} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-amber-400 transition-all" placeholder="e.g. 19:00" />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('editor.invitation.location_desc')}</label>
                          <input value={loc.desc} onChange={e => handleUpdateLocation(idx, 'desc', e.target.value)} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-amber-400 transition-all" placeholder="e.g. Rustaveli Ave. 1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t('editor.common.photos')}</div>
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading || isReadOnly} className="text-amber-600 font-black text-[10px] uppercase tracking-widest hover:text-amber-700 transition flex items-center gap-1.5 disabled:opacity-50">
                    <span>+</span> {uploading ? t('editor.common.uploading') : t('editor.common.add_photo')}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" multiple />
                </div>
                {photos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {photos.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                        <img src={url} className="w-full h-full object-cover" alt="" />
                        {!isReadOnly && (
                          <button onClick={() => setPhotos(photos.filter((_, i) => i !== idx))} className="absolute inset-0 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs font-bold">Delete</button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t('editor.invitation.seating')}</div>
                  <button onClick={handleAddSeating} className="text-amber-600 font-black text-[10px] uppercase tracking-widest hover:text-amber-700 transition flex items-center gap-1.5">
                    <span>+</span> {t('editor.invitation.add_guest')}
                  </button>
                </div>
                <div className="space-y-3">
                  {seating.map((guest, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-in slide-in-from-left-4 duration-300">
                      <input value={guest.name} onChange={e => handleUpdateSeating(idx, 'name', e.target.value)} placeholder={t('editor.invitation.guest_name')} className="w-full sm:w-40 bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 outline-none" />
                      <input value={guest.phone} onChange={e => handleUpdateSeating(idx, 'phone', e.target.value)} placeholder={t('editor.invitation.guest_phone')} className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 outline-none" />
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input value={guest.table} onChange={e => handleUpdateSeating(idx, 'table', e.target.value)} placeholder={t('editor.invitation.guest_table')} className="w-full sm:w-20 bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 outline-none" />
                        <input value={guest.seat} onChange={e => handleUpdateSeating(idx, 'seat', e.target.value)} placeholder={t('editor.invitation.guest_seat')} className="w-full sm:w-20 bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 outline-none" />
                        <button onClick={() => handleRemoveSeating(idx)} className="text-slate-400 hover:text-red-500 font-bold px-2">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 rounded-3xl p-6 sm:p-10 border border-amber-100 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-amber-100">🎵</div>
                    <div>
                      <div className="font-black text-slate-800">{t('editor.common.music')}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('editor.common.add_melody')}</div>
                    </div>
                  </div>
                  <button onClick={() => !isReadOnly && setMusicEnabled(!musicEnabled)} disabled={isReadOnly} className={`relative w-14 h-7 rounded-full transition-all duration-300 ${musicEnabled ? 'bg-amber-500 shadow-lg shadow-amber-200' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${musicEnabled ? 'translate-x-8' : 'translate-x-1'}`} />
                  </button>
                </div>
                {musicEnabled && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    {musicUrl ? (
                      <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-amber-100 shadow-sm">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white text-lg">♪</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-800 truncate">{musicLabel || 'Active Music'}</div>
                          <button onClick={() => !isReadOnly && setShowMusicSearch(true)} className="text-amber-600 font-black text-[10px] uppercase tracking-widest hover:text-amber-700 transition mt-1">{t('editor.common.change_song')}</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => !isReadOnly && setShowMusicSearch(true)} className="w-full bg-white border-2 border-dashed border-amber-200 rounded-2xl p-6 text-center hover:bg-amber-50 transition">
                        <span className="block text-amber-600 font-bold">{t('editor.common.find_melody')}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="text-center pt-8 opacity-20">
                <div className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400">INVITATION STUDIO &copy; WISHIFY</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 z-[100] bg-black overflow-y-auto">
          <InvitationView card={previewData} onBackToEdit={() => setPreview(false)} onSave={handleSave} onPurchase={handlePurchase} onGoToSaved={() => navigate('/dashboard#saved')} saving={saving} isReadOnly={isReadOnly} isSaved={saved} />
        </div>
      )}

      {showMusicSearch && (
        <MusicSearch onClose={() => setShowMusicSearch(false)} onSelect={(song) => { setMusicUrl(song.url); setMusicLabel(song.name); setShowMusicSearch(false); }} />
      )}
      <PublishModal isOpen={publishModalOpen} card={cardToPublish} onClose={() => setPublishModalOpen(false)} onProceed={startPublishProcess} />
    </div>
  );
}
