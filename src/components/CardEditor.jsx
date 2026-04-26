import { useState, useRef, useEffect } from 'react';
import CardView from './InteractiveCardView';
import MusicSearch from './MusicSearch';
import PublishModal from './profile/PublishModal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CARDS_URL, UPLOAD_URL } from '../api/config';
import { useNavigate } from 'react-router-dom';

const CARDS_API = CARDS_URL;

export default function CardEditor({ card, existingCard, category, onBack, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  const isReadOnly = !!(existingCard?.urlSlug || existingCard?.UrlSlug);

  const initialRecipient = existingCard?.recipientName || '';
  const initialMessage = existingCard?.message1 || '';
  const initialSender = existingCard?.footer || '';
  const initialAudioUrl = existingCard?.audioUrl || card.content?.audioUrl || '';
  const initialAudioLabel = existingCard?.audioLabel || '';
  const initialImage = existingCard?.imagesJson ? JSON.parse(existingCard.imagesJson)[0] : '';

  const [recipient, setRecipient] = useState(initialRecipient);
  const [message, setMessage] = useState(initialMessage);
  const [sender, setSender] = useState(initialSender);
  const [imageUrl, setImageUrl] = useState(initialImage);
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
  const [playing, setPlaying] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  useEffect(() => {
    if (musicEnabled && audioRef.current && playing) {
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [musicEnabled, playing, musicUrl]);

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
          setImageUrl(urls[0]);
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
        recipientName: recipient,
        message1: message,
        footer: sender,
        audioUrl: musicEnabled ? musicUrl : null,
        audioLabel: musicEnabled ? musicLabel : null,
        imagesJson: JSON.stringify(imageUrl ? [imageUrl] : [])
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
        
        const cardUrl = `${window.location.origin}/view/${category || 'birthday'}/${savedId}`;
        setShareUrl(cardUrl);
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

  const startPublishProcess = (cardId, slug, scheduleData) => {
    navigate('/payment', { state: { cardId, slug, schedule: scheduleData } });
  };

  const previewData = {
    templateId: card.templateId || card.id || existingCard?.templateId,
    recipientName: recipient,
    message1: message,
    footer: sender,
    audioUrl: musicEnabled ? musicUrl : null,
    imagesJson: JSON.stringify(imageUrl ? [imageUrl] : [])
  };

  if (preview) {
    return (
      <CardView 
        card={previewData} 
        onBackToEdit={() => setPreview(false)}
        onSave={handleSave}
        onPurchase={() => setPublishModalOpen(true)}
        onGoToSaved={() => navigate('/dashboard#saved')}
        saving={saving}
        isReadOnly={isReadOnly}
        isSaved={saved}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#F8FAFC] flex flex-col font-sans">
      <div className="flex-1 flex flex-col bg-white overflow-hidden sm:rounded-[32px] sm:shadow-2xl max-w-7xl mx-auto w-full relative">
        <div className="bg-white border-b border-slate-100 p-4 sm:p-6 sticky top-0 z-50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition active:scale-95">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <h1 className="text-xl font-black text-slate-800 italic hidden sm:block">{t('editor.common.title')}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPreview(true)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition active:scale-95 text-sm">{t('editor.common.preview')}</button>
              <button onClick={handleSave} disabled={saving || isReadOnly} className={`px-6 py-2 bg-slate-900 text-white rounded-xl font-black hover:bg-slate-800 transition shadow-lg disabled:opacity-50 active:scale-95 text-sm ${isReadOnly ? 'bg-slate-400 !cursor-not-allowed' : ''}`}>
                {saving ? t('editor.common.saving') : t('editor.common.save')}
              </button>
              {!isReadOnly && (
                <button onClick={() => setPublishModalOpen(true)} className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-black hover:opacity-90 transition shadow-lg active:scale-95 text-sm">{t('editor.common.purchase')}</button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-10 pb-24 relative no-scrollbar">
          <div className="relative bg-white rounded-3xl shadow-sm border border-slate-100 w-full max-w-2xl mx-auto overflow-hidden">
            {saved && (
              <div className="bg-emerald-50 border-b border-emerald-100 p-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                 <div className="text-emerald-700 font-bold text-lg mb-6 flex items-center justify-center gap-2">
                   <span>✅</span> {t('editor.common.saved_success')}
                 </div>
                 <button onClick={() => navigate('/dashboard#saved')} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-emerald-700 transition active:scale-95 shadow-lg">{t('editor.common.dashboard')}</button>
              </div>
            )}

            <div className="p-6 sm:p-10 space-y-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">{t('editor.birthday.recipient')}</label>
                <input value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 font-bold focus:bg-white focus:border-violet-400 transition-all outline-none" placeholder="e.g. Lado" />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">{t('editor.birthday.message')}</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 font-bold focus:bg-white focus:border-violet-400 transition-all outline-none min-h-[150px] resize-none" placeholder="Your wishes..." />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">{t('editor.birthday.sender')}</label>
                <input value={sender} onChange={e => setSender(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 font-bold focus:bg-white focus:border-violet-400 transition-all outline-none" placeholder="e.g. With Love, Family" />
              </div>

              <div className="bg-violet-50 rounded-3xl p-6 sm:p-8 border border-violet-100 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🎵</div>
                    <div>
                      <div className="font-black text-slate-800">{t('editor.common.music')}</div>
                      <div className="text-sm text-slate-400 font-medium">{t('editor.common.add_melody')}</div>
                    </div>
                  </div>
                  <button onClick={() => !isReadOnly && setMusicEnabled(!musicEnabled)} disabled={isReadOnly} className={`relative w-14 h-7 rounded-full transition-all duration-300 ${musicEnabled ? 'bg-violet-500 shadow-lg shadow-violet-200' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${musicEnabled ? 'translate-x-8' : 'translate-x-1'}`} />
                  </button>
                </div>
                {musicEnabled && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    {musicUrl ? (
                      <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-violet-100 shadow-sm">
                        <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center text-white text-lg">♪</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-800 truncate">{musicLabel || 'Active Music'}</div>
                          <button onClick={() => setShowMusicSearch(true)} className="text-violet-600 font-black text-xs uppercase tracking-widest hover:text-violet-700 transition">Change</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setShowMusicSearch(true)} className="w-full bg-white border-2 border-dashed border-violet-200 rounded-2xl p-6 text-center hover:bg-violet-50 transition">
                        <span className="text-violet-600 font-black">+ Add Music</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PublishModal isOpen={publishModalOpen} card={previewData} onClose={() => setPublishModalOpen(false)} onProceed={startPublishProcess} />
      <audio ref={audioRef} src={musicUrl} onEnded={() => setPlaying(false)} loop />
    </div>
  );
}
