import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BirthdayCardPreview from './BirthdayCardPreview';
import BirthdayCardEditor from './BirthdayCardEditor';
import { useAuth } from '../../context/AuthContext';
import { cardsData } from '../../data/cardsData';
import { useLanguage } from '../../context/LanguageContext';

// Default template data for the new birthday card
const DEFAULT_BIRTHDAY_CARD = {
  title: 'Happy Birthday!',
  message: 'On this special day, I want you to know how much you mean to me.\n\nMay your birthday be as wonderful and extraordinary as you are. Here\'s to another year of amazing adventures, beautiful memories, and dreams coming true!\n\nYou deserve all the happiness in the world. 🎉',
  signature: 'With All My Love ❤️',
  images: [],
  musicEnabled: false,
  musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  giftBoxEnabled: false,
  giftBoxUrl: '',
  style: {
    bgGradient: 'from-pink-400 via-rose-400 to-violet-500',
    emoji: '🎂',
  },
};

export default function BirthdayCard({ subdomainSlug }) {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [mode, setMode] = useState('preview'); // 'preview' | 'edit'
  const [dbCard, setDbCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cardId && cardId.length > 20) {
      setLoading(true);
      
      const fetchHeaders = {};
      if (user?.token) {
        fetchHeaders['Authorization'] = `Bearer ${user.token}`;
      }

      fetch(`http://localhost:5153/api/cards/${cardId}`, {
        headers: fetchHeaders
      })
        .then(res => {
          if (res.status === 403 || res.status === 401) {
             if (!user) {
                navigate('/login');
                return null;
             }
             throw new Error(language === 'ka' ? "თქვენ არ გაქვთ ამ ბარათის ნახვის უფლება." : language === 'ru' ? "У вас нет прав для просмотра этой открытки." : "You don't have permission to view this card.");
          }
          if (!res.ok) throw new Error(language === 'ka' ? "ბარათის ჩატვირთვა ვერ მოხერხდა." : language === 'ru' ? "Не удалось загрузить открытку." : "Failed to load card.");
          return res.json();
        })
        .then(data => {
          if (data && data.id) setDbCard(data);
        })
        .catch(err => {
          if (err) {
            console.error('Failed to load card from DB', err);
            setError(err.message);
          }
        })
        .finally(() => setLoading(false));
    } else if (subdomainSlug) {
      setLoading(true);
      fetch(`http://localhost:5153/api/cards/slug/${subdomainSlug}`)
        .then(res => {
          if (!res.ok) throw new Error(language === 'ka' ? "ბარათი ვერ მოიძებნა ან პრივატულია." : language === 'ru' ? "Открытка не найдена или является приватной." : "Card not found or is private.");
          return res.json();
        })
        .then(data => {
          if (data && data.id) setDbCard(data);
        })
        .catch(err => {
          console.error('Failed to load card by slug', err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [cardId, subdomainSlug, user, navigate]);

  // Find the card from cardsData if cardId is provided and NOT a GUID
  const templateCard = (cardId && cardId.length < 20)
    ? cardsData.birthday?.find(c => c.id === cardId)
    : null;

  // Build default data from either DB Card, Template Card, or Hardcoded Default
  const defaultData = dbCard 
    ? {
      title: dbCard.heading,
      message: [dbCard.message1, dbCard.message2].filter(Boolean).join('\n\n'),
      signature: dbCard.footer,
      images: dbCard.imagesJson ? JSON.parse(dbCard.imagesJson).filter(img => img) : [],
      musicEnabled: !!dbCard.audioUrl,
      musicUrl: dbCard.audioUrl || null,
      giftBoxEnabled: !!dbCard.giftBoxUrl,
      giftBoxUrl: dbCard.giftBoxUrl || '',
      style: {
        bgGradient: dbCard.customBgGradient || 'from-pink-400 via-rose-400 to-violet-500',
        emoji: dbCard.customEmoji || '🎂',
      }
    }
    : templateCard
      ? {
        title: templateCard.content?.heading || (language === 'ka' ? 'გილოცავ დაბადების დღეს!' : language === 'ru' ? 'С днем рождения!' : 'Happy Birthday!'),
        message: `${templateCard.content?.message1 || ''}\n\n${templateCard.content?.message2 || ''}`,
        signature: language === 'ka' ? 'სიყვარულით ❤️' : language === 'ru' ? 'С любовью ❤️' : 'With Love ❤️',
        images: [],
        musicEnabled: !!templateCard.content?.audioUrl,
        musicUrl: templateCard.content?.audioUrl || null,
        giftBoxEnabled: !!templateCard.content?.giftLink,
        giftBoxUrl: templateCard.content?.giftLink || '',
        style: templateCard.style || DEFAULT_BIRTHDAY_CARD.style,
      }
      : DEFAULT_BIRTHDAY_CARD;

  // Render a loading state if we're aggressively fetching from DB
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render an error state if access is denied or card not found
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="text-2xl font-bold text-white mb-2">{language === 'ka' ? 'წვდომა შეზღუდულია' : language === 'ru' ? 'Доступ ограничен' : 'Access Denied'}</h2>
        <p className="text-slate-400 mb-8 max-w-sm">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-white text-slate-900 font-bold py-3 px-8 rounded-xl hover:bg-slate-100 transition shadow-lg cursor-pointer"
        >
          {language === 'ka' ? 'მთავარ გვერდზე დაბრუნება' : language === 'ru' ? 'Вернуться на главную' : 'Back to Home'}
        </button>
      </div>
    );
  }

  if (mode === 'edit') {
    return (
      <BirthdayCardEditor
        defaultData={defaultData}
        onBack={() => setMode('preview')}
      />
    );
  }

  // STANDALONE PREVIEW MODE - Full page, not a popup
  return (
    <BirthdayCardPreview
      data={defaultData}
      standalone={true}
      isPublic={dbCard?.isPublic || dbCard?.IsPublic || !!subdomainSlug}
      onPersonalize={subdomainSlug ? undefined : () => setMode('edit')}
      onBack={subdomainSlug ? undefined : () => navigate('/browse/birthday')}
    />
  );
}
