import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BirthdayCardPreview from './BirthdayCardPreview';
import BirthdayCardEditor from './BirthdayCardEditor';
import { cardsData } from '../../data/cardsData';

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

export default function BirthdayCard() {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const [mode, setMode] = useState('preview'); // 'preview' | 'edit'
  const [dbCard, setDbCard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Treat cardId as a Database ID if it looks like a GUID (longer than 20 chars)
    if (cardId && cardId.length > 20) {
      setLoading(true);
      fetch(`http://localhost:5153/api/cards/${cardId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.id) setDbCard(data);
        })
        .catch(err => console.error('Failed to load card from DB', err))
        .finally(() => setLoading(false));
    }
  }, [cardId]);

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
        title: templateCard.content?.heading || DEFAULT_BIRTHDAY_CARD.title,
        message: `${templateCard.content?.message1 || ''}\n\n${templateCard.content?.message2 || ''}`,
        signature: 'With Love ❤️',
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
      onPersonalize={() => setMode('edit')}
      onBack={() => navigate('/browse/birthday')}
    />
  );
}
