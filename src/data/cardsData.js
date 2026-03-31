// All card data organized by category
export const categories = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂', color: 'from-pink-400 to-rose-500' },
  { id: 'invitation', label: 'Invitation', emoji: '💌', color: 'from-amber-400 to-orange-500' },
  { id: 'memory', label: 'Memory', emoji: '📸', color: 'from-teal-400 to-cyan-500' },
  { id: 'love', label: 'Love', emoji: '❤️', color: 'from-red-400 to-pink-500' },
  { id: 'holiday', label: 'Holiday', emoji: '🎄', color: 'from-green-400 to-emerald-500' },
];

export const cardsData = {
  birthday: [
    {
      id: 'b1',
      title: 'Happy Birthday',
      recipient: 'Someone Special',
      customRoute: '/birthday-card/b1',
      style: {
        bgGradient: 'from-pink-400 via-rose-400 to-violet-500',
        emoji: '🎂',
        themeColor: 'pink',
        fontFamily: 'font-sans',
        layoutType: 'centered',
      },
      content: {
        heading: 'Happy Birthday!',
        message1: 'On this special day, I want you to know how much you mean to me.',
        message2: 'May your birthday be as wonderful and extraordinary as you are!',
        giftLink: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        musicLabel: 'Birthday Melody',
      }
    },
    {
      id: 'b2',
      title: 'Birthday Reel',
      recipient: 'TikTok Fan',
      customRoute: '/birthday-card/b2',
      style: {
        bgGradient: 'from-slate-900 via-purple-900 to-slate-900',
        emoji: '🎂',
        themeColor: 'purple',
        fontFamily: 'font-sans',
        layoutType: 'reel',
      },
      content: {
        heading: 'Happy Birthday Reel!',
        message1: 'Swipe up for more birthdays ✨ Just kidding, have the best day ever!',
        message2: 'You deserve all the happiness today.',
        giftLink: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        musicLabel: 'Trending Lo-Fi',
      }
    }
  ],
  graduation: [
    {
      id: 'g1',
      title: 'Triumphant Cap',
      recipient: 'Sarah',
      style: {
        bgGradient: 'from-violet-300 via-purple-200 to-indigo-100',
        emoji: '🎓',
        themeColor: 'violet',
        fontFamily: 'font-sans',
        layoutType: 'centered',
      },
      content: {
        heading: 'Congrats, Sarah! 🎓',
        message1: 'You did it! The hard work paid off and the future looks incredibly bright.',
        message2: 'Go out there and show the world what you\'re made of!',
        giftLink: 'https://google.com',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        musicLabel: 'Success March',
      }
    },
    {
      id: 'g2',
      title: 'New Horizons',
      recipient: 'Chris',
      style: {
        bgGradient: 'from-teal-200 to-emerald-100',
        emoji: '🚀',
        themeColor: 'teal',
        fontFamily: 'font-serif',
        layoutType: 'split',
      },
      content: {
        heading: 'Next Stop: Greatness!',
        message1: 'Congratulations on your graduation. The journey is just beginning.',
        message2: 'May your path be filled with success and wonderful discoveries.',
        giftLink: 'https://google.com',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        musicLabel: 'Adventure Tune',
      }
    }
  ],
  invitation: [],
  memory: [
    {
      id: 'm1',
      title: 'Memory Studio',
      recipient: 'Special One',
      style: {
        bgGradient: 'from-teal-100 via-cyan-50 to-white',
        emoji: '📸',
        themeColor: 'teal',
        fontFamily: 'font-sans',
        layoutType: 'memory-web',
      },
      content: {
        heading: 'Our Beautiful Journey 📸',
        message1: 'Capturing every moment together.',
        message2: 'A collection of our favorite memories.',
        giftLink: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        musicLabel: 'Acoustic Softness',
      }
    }
  ],
  love: [
    {
      id: 'l3',
      title: 'Eternal Love Letter',
      recipient: 'Soulmate',
      style: {
        bgGradient: 'from-rose-500 via-red-600 to-rose-700',
        emoji: '✉️',
        themeColor: 'red',
        fontFamily: 'font-serif',
        layoutType: 'love-letter',
      },
      content: {
        heading: 'My Dearest...',
        message1: 'I wanted to write you something that truly captures how I feel. You are the light in my darkness, the hope in my heart, and the love of my life. Every day with you is a gift that I cherish more than words can say.',
        message2: 'I love you more than all the stars in the sky.',
        footer: 'Forever Yours, [Your Name]',
        giftLink: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        musicLabel: 'Romantic Piano Solo',
      }
    }
  ],
  holiday: [],
};
