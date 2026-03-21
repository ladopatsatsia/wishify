import { useState, useRef } from 'react';
import BirthdayCardPreview from './BirthdayCardPreview';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function BirthdayCardEditor({ defaultData, onBack }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  // Editable state initialized from defaults
  const [title, setTitle] = useState(defaultData.title || 'Happy Birthday!');
  const [message, setMessage] = useState(defaultData.message || 'Wishing you a wonderful day!');
  const [signature, setSignature] = useState(defaultData.signature || 'With Love ❤️');
  const [images, setImages] = useState(defaultData.images || []);
  const [musicEnabled, setMusicEnabled] = useState(defaultData.musicEnabled || false);
  const [musicFile, setMusicFile] = useState(null);
  const [giftBoxEnabled, setGiftBoxEnabled] = useState(defaultData.giftBoxEnabled || false);
  const [giftBoxUrl, setGiftBoxUrl] = useState(defaultData.giftBoxUrl || '');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const imageInputRef = useRef(null);
  const musicInputRef = useRef(null);
  
  const { user } = useAuth();
  const { cardId, categoryId } = useParams();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      alert('Maximum 4 images allowed');
      return;
    }
    setImages(prev => [...prev, ...files].slice(0, 4));
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMusicUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setMusicFile(file);
      setMusicEnabled(true);
    }
  };

  const getPreviewData = () => ({
    title,
    message,
    signature,
    images,
    musicEnabled,
    musicFile,
    musicUrl: defaultData.musicUrl,
    giftBoxEnabled,
    giftBoxUrl,
    style: defaultData.style || {},
  });

  const { bgGradient = 'from-pink-400 via-rose-400 to-violet-500', emoji = '🎂' } = defaultData.style || {};

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleSave = async () => {
    console.log("handleSave called in Editor", { user, cardId, categoryId });
    if (!user) {
      console.warn("handleSave: No user found, alerting...");
      alert(language === 'ka' ? "გთხოვთ გაიაროთ ავტორიზაცია თქვენი ბარათების შესანახად!" : language === 'ru' ? "Пожалуйста, войдите, чтобы сохранить ваши персонализированные открытки!" : "Please log in to save your personalize cards!");
      return;
    }
    setSaving(true);
    console.log("handleSave: setSaving(true)");
    try {
      // Convert all images to base64
      const base64Images = await Promise.all(
        images.map(async (img) => {
          if (typeof img === 'string') return img; // existing picture string
          return await fileToBase64(img);
        })
      );

      const cardData = {
        templateId: cardId, // or link to specific template
        recipientName: title, 
        heading: title,
        message1: message,
        message2: '', 
        footer: signature,
        audioUrl: musicEnabled && musicFile ? "Custom Music Not Supported Yet" : (musicEnabled ? defaultData.musicUrl : null),
        customEmoji: emoji,
        customBgGradient: bgGradient,
        giftBoxUrl: giftBoxEnabled ? giftBoxUrl : null,
        imagesJson: JSON.stringify(base64Images)
      };

      const response = await fetch('http://localhost:5153/api/cards', {
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

      const savedCard = await response.json();
      setIsSaved(true);
    } catch (e) {
      console.error(e);
      alert('Error saving card: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (showPreview) {
    return (
      <BirthdayCardPreview 
        data={getPreviewData()} 
        onClose={() => {
          setShowPreview(false);
          setIsSaved(false); // reset if they go back to editor
        }} 
        onSave={handleSave} 
        saving={saving}
        isSaved={isSaved}
        onGoToSaved={() => navigate('/profile/saved')}
      />
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
              <h2 className="text-xl font-extrabold text-slate-800">{language === 'ka' ? 'დაბადების დღის ბარათის რედაქტორი' : language === 'ru' ? 'Редактор поздравительной открытки' : 'Birthday Card Editor'}</h2>
              <p className="text-sm text-slate-400">{language === 'ka' ? 'პერსონალიზაცია ყველა დეტალში' : language === 'ru' ? 'Персонализируйте каждую деталь' : 'Personalize every detail'}</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition font-bold text-lg cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Live Mini Preview */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{language === 'ka' ? 'ლაივ პრევიუ' : language === 'ru' ? 'Предпросмотр' : 'Live Preview'}</div>
          <div className={`rounded-2xl bg-gradient-to-br ${bgGradient} p-5 text-center space-y-2`}>
            <div className="text-4xl">{emoji}</div>
            <div className="font-bold text-white text-base drop-shadow">{title || 'Your Title Here'}</div>
            <div className="text-white/80 text-[10px] leading-tight line-clamp-2">{message}</div>
            {images.length > 0 && (
              <div className="flex justify-center gap-1 mt-2">
                {images.map((img, i) => (
                  <div key={i} className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white/40">
                    <img
                      src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="text-white/70 text-[10px] italic">{signature}</div>
          </div>

          {/* ===== TEXT FIELDS ===== */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">🎉 {language === 'ka' ? 'სათაური' : language === 'ru' ? 'Заголовок' : 'Title'}</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:border-violet-400 transition"
                placeholder={language === 'ka' ? 'გილოცავ დაბადების დღეს!' : language === 'ru' ? 'С днем рождения!' : 'Happy Birthday!'}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">💬 {language === 'ka' ? 'ტექსტი' : language === 'ru' ? 'Сообщение' : 'Message'}</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-violet-400 transition resize-none text-sm"
                placeholder={language === 'ka' ? 'დაწერეთ თქვენი გულწრფელი მესიჯი...' : language === 'ru' ? 'Напишите ваше искреннее сообщение...' : 'Write your heartfelt message...'}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">✍️ {language === 'ka' ? 'ხელმოწერა' : language === 'ru' ? 'Подпись' : 'Signature'}</label>
              <input
                value={signature}
                onChange={e => setSignature(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-violet-400 transition"
                placeholder={language === 'ka' ? 'სიყვარულით ❤️' : language === 'ru' ? 'С любовью ❤️' : 'With Love ❤️'}
              />
            </div>
          </div>

          {/* ===== IMAGE UPLOAD ===== */}
          <div className="bg-sky-50 rounded-2xl p-5 space-y-4 border border-sky-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📸</span>
                <div>
                  <div className="font-bold text-slate-800">{language === 'ka' ? 'სურათები' : language === 'ru' ? 'Фотографии' : 'Photos'}</div>
                  <div className="text-xs text-slate-400">{language === 'ka' ? 'ატვირთეთ მაქსიმუმ 4 სურათი' : language === 'ru' ? 'Загрузите до 4 изображений' : 'Upload up to 4 images'}</div>
                </div>
              </div>
              <button
                onClick={() => imageInputRef.current?.click()}
                className="bg-sky-500 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-sky-600 transition cursor-pointer"
              >
                + {language === 'ka' ? 'დამატება' : language === 'ru' ? 'Добавить' : 'Add'}
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-white shadow-md">
                      <img
                        src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition cursor-pointer flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && (
              <div
                onClick={() => imageInputRef.current?.click()}
                className="border-2 border-dashed border-sky-200 rounded-xl p-8 text-center cursor-pointer hover:bg-sky-100/50 transition"
              >
                <div className="text-3xl mb-2">📷</div>
                <p className="text-sm text-slate-500">{language === 'ka' ? 'დააკლიკეთ სურათების ასატვირთად' : language === 'ru' ? 'Нажмите, чтобы загрузить фотографии' : 'Click to upload photos'}</p>
              </div>
            )}
          </div>

          {/* ===== MUSIC ===== */}
          <div className="bg-violet-50 rounded-2xl p-5 space-y-4 border border-violet-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎵</span>
                <div>
                  <div className="font-bold text-slate-800">{language === 'ka' ? 'მუსიკა' : language === 'ru' ? 'Музыка' : 'Music'}</div>
                  <div className="text-xs text-slate-400">{language === 'ka' ? 'დაამატეთ მუსიკა თქვენს ბარათს' : language === 'ru' ? 'Добавьте звуковую дорожку к вашей открытке' : 'Add a soundtrack to your card'}</div>
                </div>
              </div>
              <button
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${musicEnabled ? 'bg-violet-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${musicEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            {musicEnabled && (
              <div className="space-y-3">
                 {musicFile && (
                  <div className="bg-white rounded-xl p-3 flex items-center gap-3 border border-violet-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs">♪</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-700 truncate">{musicFile.name}</div>
                      <div className="text-xs text-violet-400">{language === 'ka' ? 'ატვირთული' : language === 'ru' ? 'Собственная загрузка' : 'Custom Upload'}</div>
                    </div>
                    <div className="text-green-500 text-xs font-bold">✓</div>
                  </div>
                )}
                <button
                  onClick={() => musicInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-violet-200 rounded-xl p-4 text-center hover:bg-violet-100/50 transition cursor-pointer"
                >
                  <span className="text-sm text-violet-600 font-semibold">
                    {musicFile ? (language === 'ka' ? 'შეცვალე მუსიკა' : language === 'ru' ? 'Изменить музыкальный файл' : 'Change Music File') : (language === 'ka' ? '🎧 ატვირთეთ MP3 ფაილი' : language === 'ru' ? '🎧 Загрузить MP3 файл' : '🎧 Upload MP3 File')}
                  </span>
                </button>
                <input
                  ref={musicInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleMusicUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* ===== GIFT BOX ===== */}
          <div className="bg-rose-50 rounded-2xl p-5 space-y-4 border border-rose-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <div className="font-bold text-slate-800">{language === 'ka' ? 'საჩუქრის ყუთი' : language === 'ru' ? 'Подарочная коробка' : 'Gift Box'}</div>
                  <div className="text-xs text-slate-400">{language === 'ka' ? 'დაამატეთ ლინკი საჩუქრისთვის' : language === 'ru' ? 'Добавьте кликабельную ссылку на подарок' : 'Add a clickable gift link'}</div>
                </div>
              </div>
              <button
                onClick={() => setGiftBoxEnabled(!giftBoxEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${giftBoxEnabled ? 'bg-rose-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${giftBoxEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            {giftBoxEnabled && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{language === 'ka' ? 'საჩუქრის URL' : language === 'ru' ? 'URL подарка' : 'Gift URL'}</label>
                <input
                  value={giftBoxUrl}
                  onChange={e => setGiftBoxUrl(e.target.value)}
                  placeholder="https://example.com/gift"
                  className="w-full border-2 border-rose-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl py-3 hover:bg-slate-50 transition cursor-pointer"
          >
            ← {language === 'ka' ? 'უკან' : language === 'ru' ? 'Назад' : 'Back'}
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="flex-[2] bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold rounded-2xl py-3 hover:opacity-90 transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            ✨ {language === 'ka' ? 'ბარათის ნახვა' : language === 'ru' ? 'Предпросмотр открытки' : 'Preview Card'}
          </button>
        </div>
      </div>
    </div>
  );
}
