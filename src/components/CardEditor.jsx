import { useState, useRef, useEffect } from 'react';
import InteractiveCardView from './InteractiveCardView';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import MusicSearch from './MusicSearch';
import { CARDS_URL, UPLOAD_URL } from '../api/config';

const CARDS_API = CARDS_URL;

export default function CardEditor({ card, existingCard, category, onBack, onClose }) {
  const { user } = useAuth();
  const { language } = useLanguage();
  
  const isReadOnly = !!(existingCard?.urlSlug || existingCard?.UrlSlug);
  // Initialize from existingCard if provided, otherwise from template card
  const initialHeading = existingCard?.heading || card.defaultHeading || card.heading || '';
  const initialSubheading = existingCard?.message1 || card.defaultMessage1 || card.subheading || '';
  const initialMessage2 = existingCard?.message2 || card.defaultMessage2 || '';
  const initialFooter = existingCard?.footer || card.footer || 'Sent with Love from Wishify';
  const initialMusicUrl = existingCard?.audioUrl || card.audioUrl || card.content?.audioUrl || card.defaultAudioUrl || card.defaultMusic;
  const initialMusicLabel = existingCard?.audioLabel || '';

  const [heading, setHeading] = useState(initialHeading);
  const [subheading, setSubheading] = useState(initialSubheading);
  const [message2, setMessage2] = useState(initialMessage2);
  const [footer, setFooter] = useState(initialFooter);
  const [musicEnabled, setMusicEnabled] = useState(!!initialMusicUrl);
  const [musicUrl, setMusicUrl] = useState(initialMusicUrl);
  const [musicLabel, setMusicLabel] = useState(initialMusicLabel);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showMusicSearch, setShowMusicSearch] = useState(false);
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  // Force actual reload when source changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [musicUrl]);

  const {
    bgGradient = 'from-slate-100 to-slate-200',
    emoji = '✨',
  } = card.style || card; // Handle both template and card objects

  const handleSave = async () => {
    if (isReadOnly) {
      alert(language === 'ka' ? 'გამოქვეყნებული ბარათის რედაქტირება შეუძლებელია' : 'Cannot edit published card');
      return;
    }
    setSaving(true);
    try {
      const cardData = {
        templateId: card.id,
        recipientName: "Someone Special", 
        heading,
        message1: subheading,
        message2,
        footer,
        audioUrl: musicEnabled ? musicUrl : null,
        audioLabel: musicEnabled ? musicLabel : null,
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
        setShareUrl(`${window.location.origin}/view/${category || 'birthday'}/${cardId}`);
      }
    } catch (error) {
      console.error('Error saving card:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.error("Audio play failed:", e);
      });
    }
    setPlaying(!playing);
  };

  // Construct data for the interactive preview
  const previewData = {
    ...card,
    content: {
      ...card.content,
      heading: heading,
      message1: subheading,
      message2: message2,
      audioUrl: musicEnabled ? musicUrl : null,
      audioLabel: musicEnabled ? musicLabel : null,
    }
  };

  if (preview) {
    return (
      <div className="fixed inset-0 z-[100] bg-black overflow-y-auto">
        <InteractiveCardView 
          previewData={previewData} 
          onBackToEdit={() => setPreview(false)} 
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 py-10">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{emoji}</div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">{language === 'ka' ? 'ბარათის რედაქტორი' : language === 'ru' ? 'Редактор открытки' : 'Card Editor'}</h2>
              <p className="text-sm text-slate-400">{card.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition font-bold text-lg"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Live mini preview */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{language === 'ka' ? 'ლაივ პრევიუ' : language === 'ru' ? 'Предпросмотр' : 'Live Preview'}</div>
          <div className={`rounded-2xl bg-gradient-to-br ${bgGradient} p-5 text-center space-y-2`}>
            <div className="text-4xl">{emoji}</div>
            <div className="font-bold text-slate-800 text-base">{heading || (language === 'ka' ? 'სათაური' : language === 'ru' ? 'Ваш заголовок здесь' : 'Your Heading Here')}</div>
            <div className="text-slate-500 text-[10px] leading-tight line-clamp-2">
              {subheading} {message2}
            </div>
            <div className="text-slate-400 text-[10px] italic">{footer}</div>
          </div>

          {/* Text fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">✏️ {language === 'ka' ? 'მთავარი სათაური' : language === 'ru' ? 'Главный заголовок' : 'Main Heading'}</label>
              <input
                value={heading}
                onChange={e => setHeading(e.target.value)}
                disabled={isReadOnly}
                className={`w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:border-violet-400 transition ${isReadOnly ? 'bg-slate-50 cursor-not-allowed text-slate-400' : ''}`}
                placeholder={language === 'ka' ? 'შეიყვანეთ სათაური...' : language === 'ru' ? 'Введите праздничный заголовок...' : 'Enter a celebratory heading...'}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">💬 {language === 'ka' ? 'საწყისი მესიჯი' : language === 'ru' ? 'Начальное сообщение' : 'Opening Message'}</label>
              <textarea
                value={subheading}
                onChange={e => setSubheading(e.target.value)}
                rows={2}
                disabled={isReadOnly}
                className={`w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-violet-400 transition resize-none text-sm ${isReadOnly ? 'bg-slate-50 cursor-not-allowed text-slate-400' : ''}`}
                placeholder={language === 'ka' ? 'თბილი საწყისი წინადადება...' : language === 'ru' ? 'Теплое вступительное предложение...' : 'A warm opening sentence...'}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">💬 {language === 'ka' ? 'პირადი დეტალი' : language === 'ru' ? 'Личная деталь' : 'Personal Detail'}</label>
              <textarea
                value={message2}
                onChange={e => setMessage2(e.target.value)}
                rows={2}
                disabled={isReadOnly}
                className={`w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-violet-400 transition resize-none text-sm ${isReadOnly ? 'bg-slate-50 cursor-not-allowed text-slate-400' : ''}`}
                placeholder={language === 'ka' ? 'დაამატეთ პირადი შტრიხი...' : language === 'ru' ? 'Добавьте еще один личный штрих...' : 'Add another personalized touch...'}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">💌 {language === 'ka' ? 'ქვედა ტექსტი' : language === 'ru' ? 'Текст внизу' : 'Footer Text'}</label>
              <input
                value={footer}
                onChange={e => setFooter(e.target.value)}
                disabled={isReadOnly}
                className={`w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-violet-400 transition ${isReadOnly ? 'bg-slate-50 cursor-not-allowed text-slate-400' : ''}`}
                placeholder={language === 'ka' ? 'გამოგზავნილია სიყვარულით Wishify-სგან' : language === 'ru' ? 'Отправлено с любовью от Wishify' : 'Sent with Love from Wishify'}
              />
            </div>
          </div>

          {/* Music section */}
          <div className="bg-violet-50 rounded-2xl p-5 space-y-4 border border-violet-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎵</span>
                <div>
                  <div className="font-bold text-slate-800">{language === 'ka' ? 'ჯადოსნური მუსიკა' : language === 'ru' ? 'Магическая музыка' : 'Magic Music'}</div>
                  <div className="text-xs text-slate-400">{language === 'ka' ? 'დაამატეთ მუსიკა' : language === 'ru' ? 'Добавьте интерактивный саундтрек' : 'Add an interactive soundtrack'}</div>
                </div>
              </div>
              <button
                onClick={() => !isReadOnly && setMusicEnabled(!musicEnabled)}
                disabled={isReadOnly}
                className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${musicEnabled ? 'bg-violet-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${musicEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            {isReadOnly && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-700 animate-in fade-in zoom-in duration-300 mx-5 my-2">
                <span className="text-2xl">🔒</span>
                <div className="text-xs font-bold leading-tight uppercase tracking-wider">
                  {language === 'ka' ? 'გამოქვეყნებული ბარათის რედაქტირება შეუძლებელია' : language === 'ru' ? 'Редактировать опубликованную открытку нельзя' : 'You cannot edit a published card'}
                </div>
              </div>
            )}

            {musicEnabled && (
              <div className="space-y-4">
                {musicUrl ? (
                  <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-violet-100 shadow-sm">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg ring-4 ring-violet-50">
                      ♪
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-slate-800 truncate">
                        {musicLabel || (language === 'ka' ? 'არჩეული მუსიკა' : 'Selected Music')}
                      </div>
                      <div className="text-[10px] text-violet-400 font-bold uppercase tracking-widest mt-1">
                         {language === 'ka' ? 'აქტიურია' : 'Active'}
                      </div>
                    </div>
                    <button
                      onClick={() => !isReadOnly && setShowMusicSearch(true)}
                      disabled={isReadOnly}
                      className="bg-violet-50 text-violet-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-100 transition active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       {language === 'ka' ? 'შეცვლა' : 'Change'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => !isReadOnly && setShowMusicSearch(true)}
                    disabled={isReadOnly}
                    className="w-full bg-white border-2 border-dashed border-violet-200 rounded-[2rem] p-8 text-center hover:bg-violet-50 transition group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform">✨</div>
                     <span className="block text-violet-600 font-black text-lg">
                       {language === 'ka' ? 'დაამატეთ მუსიკა' : 'Add Magic Music'}
                     </span>
                     <span className="text-xs text-slate-400 mt-2 block font-medium">
                       {language === 'ka' ? 'იპოვეთ სასურველი სიმღერა' : 'Search any song by name'}
                     </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 pt-0 flex flex-col gap-4">
          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex flex-col gap-2 animate-fade-in">
              <div className="flex items-center gap-2 text-green-700 font-bold">
                <span>✅ {language === 'ka' ? 'წარმატებით შეინახა!' : language === 'ru' ? 'Успешно сохранено!' : 'Saved successfully!'}</span>
              </div>
              <div className="flex gap-2">
                <input 
                  readOnly 
                  value={shareUrl} 
                  className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-1 text-xs text-slate-600"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    alert("Link copied!");
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-700 transition cursor-pointer"
                >
                  {language === 'ka' ? 'ლინკის კოპირება' : language === 'ru' ? 'Копировать ссылку' : 'Copy Link'}
                </button>
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl py-3 hover:bg-slate-50 transition cursor-pointer"
            >
              ← {language === 'ka' ? 'უკან' : language === 'ru' ? 'Назад' : 'Back'}
            </button>
            <button
              onClick={() => setPreview(true)}
              className="flex-1 border-2 border-violet-200 text-violet-700 font-bold rounded-2xl py-3 hover:bg-violet-50 transition cursor-pointer"
            >
              {language === 'ka' ? 'სრული ნახვა' : language === 'ru' ? 'Полный просмотр' : 'Full Preview'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || isReadOnly}
              className={`flex-[1.5] btn-primary !rounded-2xl !py-3 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer ${isReadOnly ? 'bg-slate-400 border-slate-500' : ''}`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {language === 'ka' ? 'ინახება...' : language === 'ru' ? 'Сохранение...' : 'Saving...'}
                </>
              ) : isReadOnly ? (
                <>🔒 {language === 'ka' ? 'დაბლოკილია' : 'Locked'}</>
              ) : (
                language === 'ka' ? 'შენახვა და გაზიარება ✨' : language === 'ru' ? 'Сохранить и поделиться ✨' : 'Save & Share ✨'
              )}
            </button>
          </div>
        </div>
        {/* Hidden Audio Player for Preview */}
        <audio 
          ref={audioRef} 
          src={musicUrl} 
          onEnded={() => setPlaying(false)} 
          loop 
        />
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
