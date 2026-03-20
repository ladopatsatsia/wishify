import { useState } from 'react';
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

  // Find the card from cardsData if cardId is provided, otherwise use default
  const templateCard = cardId
    ? cardsData.birthday?.find(c => c.id === cardId)
    : null;

  // Build default data from either the found template or our hardcoded default
  const defaultData = templateCard
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
