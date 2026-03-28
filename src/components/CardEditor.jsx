import { useState, useRef } from 'react';
import InteractiveCardView from './InteractiveCardView';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const API_BASE_URL = 'https://localhost:44328/api/cards';

export default function CardEditor({ card, category, onBack, onClose }) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [heading, setHeading] = useState(card.defaultHeading || card.heading || '');
  const [subheading, setSubheading] = useState(card.defaultMessage1 || card.subheading || '');
  const [message2, setMessage2] = useState(card.defaultMessage2 || '');
  const [footer, setFooter] = useState(card.footer || 'Sent with Love from Wishify');
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [musicUrl, setMusicUrl] = useState(card.defaultAudioUrl || card.audioUrl || card.defaultMusic);
  const [customMusicUrl, setCustomMusicUrl] = useState('');
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const {
    bgGradient = 'from-slate-100 to-slate-200',
    emoji = '✨',
  } = card.style || card; // Handle both template and card objects

  const handleSave = async () => {
    setSaving(true);
    try {
      const cardData = {
        templateId: card.id,
        recipientName: "Someone Special", // TODO: Add field
        heading,
        message1: subheading,
        message2,
        footer,
        audioUrl: musicEnabled ? musicUrl : null,
      };

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify(cardData)
      });

      if (response.ok) {
        const createdCard = await response.json();
        setSaved(true);
        setShareUrl(`${window.location.origin}/view/${createdCard.id}`);
        // Keep saved message for 5s if shareUrl is shown
      }
    } catch (error) {
      console.error('Error saving card:', error);
    } finally {
      setSaving(false);
    }
  };

  const applyCustomMusic = () => {
    if (customMusicUrl.trim()) setMusicUrl(customMusicUrl.trim());
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
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:border-violet-400 transition"
                placeholder={language === 'ka' ? 'შეიყვანეთ სათაური...' : language === 'ru' ? 'Введите праздничный заголовок...' : 'Enter a celebratory heading...'}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">💬 {language === 'ka' ? 'საწყისი მესიჯი' : language === 'ru' ? 'Начальное сообщение' : 'Opening Message'}</label>
              <textarea
                value={subheading}
                onChange={e => setSubheading(e.target.value)}
                rows={2}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-violet-400 transition resize-none text-sm"
                placeholder={language === 'ka' ? 'თბილი საწყისი წინადადება...' : language === 'ru' ? 'Теплое вступительное предложение...' : 'A warm opening sentence...'}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">💬 {language === 'ka' ? 'პირადი დეტალი' : language === 'ru' ? 'Личная деталь' : 'Personal Detail'}</label>
              <textarea
                value={message2}
                onChange={e => setMessage2(e.target.value)}
                rows={2}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-violet-400 transition resize-none text-sm"
                placeholder={language === 'ka' ? 'დაამატეთ პირადი შტრიხი...' : language === 'ru' ? 'Добавьте еще один личный штрих...' : 'Add another personalized touch...'}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">💌 {language === 'ka' ? 'ქვედა ტექსტი' : language === 'ru' ? 'Текст внизу' : 'Footer Text'}</label>
              <input
                value={footer}
                onChange={e => setFooter(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-violet-400 transition"
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
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${musicEnabled ? 'bg-violet-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${musicEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            {musicEnabled && (
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-3 flex items-center gap-3 border border-violet-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs">♪</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-700">{card.musicLabel || (language === 'ka' ? 'მისალოცი მელოდია' : language === 'ru' ? 'Поздравительная мелодия' : 'Greeting Melody')}</div>
                    <div className="text-xs text-violet-400">{language === 'ka' ? 'ბარათის მუსიკა' : language === 'ru' ? 'Стандартный трек открытки' : 'Default Card Track'}</div>
                  </div>
                  <div className="text-green-500 text-xs font-bold">✓ {language === 'ka' ? 'აქტიურია' : language === 'ru' ? 'Активно' : 'Active'}</div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">{language === 'ka' ? 'გსურთ სხვა მუსიკა? ჩასვით .mp3 ლინკი:' : language === 'ru' ? 'Хотите свою музыку? Вставьте прямую ссылку на .mp3:' : 'Want custom music? Paste a direct .mp3 link:'}</label>
                  <div className="flex gap-2">
                    <input
                      value={customMusicUrl}
                      onChange={e => setCustomMusicUrl(e.target.value)}
                      placeholder="https://example.com/music.mp3"
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400 transition"
                    />
                    <button
                      onClick={applyCustomMusic}
                      className="bg-violet-500 text-white rounded-xl px-3 py-2 text-sm font-semibold hover:bg-violet-600 transition cursor-pointer"
                    >
                      {language === 'ka' ? 'დამატება' : language === 'ru' ? 'Применить' : 'Apply'}
                    </button>
                  </div>
                </div>
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
              disabled={saving}
              className="flex-[1.5] btn-primary !rounded-2xl !py-3 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {language === 'ka' ? 'ინახება...' : language === 'ru' ? 'Сохранение...' : 'Saving...'}
                </>
              ) : (
                language === 'ka' ? 'შენახვა და გაზიარება ✨' : language === 'ru' ? 'Сохранить и поделиться ✨' : 'Save & Share ✨'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
