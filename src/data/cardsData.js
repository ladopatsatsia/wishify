// All card data organized by category
export const categories = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂', color: 'from-pink-400 to-rose-500' },
  { id: 'graduation', label: 'Graduation', emoji: '🎓', color: 'from-violet-400 to-purple-600' },
  { id: 'invitation', label: 'Invitation', emoji: '💌', color: 'from-amber-400 to-orange-500' },
  { id: 'memory', label: 'Memory', emoji: '📸', color: 'from-teal-400 to-cyan-500' },
  { id: 'love', label: 'Love', emoji: '❤️', color: 'from-red-400 to-pink-500' },
  { id: 'holiday', label: 'Holiday', emoji: '🎄', color: 'from-green-400 to-emerald-500' },
];

export const cardsData = {
  birthday: [
    {
      id: 'bday-1',
      title: 'Happy Birthday',
      recipient: 'Someone Special',
      customRoute: '/birthday-card/bday-1',
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
  invitation: [
    {
      id: 'i1',
      title: 'Grand Party',
      recipient: 'Guest',
      style: {
        bgGradient: 'from-amber-200 via-orange-100 to-yellow-50',
        emoji: '🥂',
        themeColor: 'amber',
        fontFamily: 'font-serif',
        layoutType: 'centered',
      },
      content: {
        heading: 'You\'re Invited! 🥂',
        message1: 'Join us for a night of elegance, laughter, and celebration.',
        message2: 'Your presence would make the evening truly special.',
        giftLink: 'https://google.com',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        musicLabel: 'Elegant Jazz',
      }
    },
    {
      id: 'i2',
      title: 'Summer Bash',
      recipient: 'Friend',
      style: {
        bgGradient: 'from-teal-200 via-cyan-100 to-sky-50',
        emoji: '☀️',
        themeColor: 'teal',
        fontFamily: 'font-sans',
        layoutType: 'split',
      },
      content: {
        heading: 'Let\'s Celebrate Under the Sun!',
        message1: 'Get ready for the ultimate summer pool party and BBQ.',
        message2: 'Don\'t forget your sunglasses and good vibes!',
        giftLink: 'https://google.com',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        musicLabel: 'Tropical Beats',
      }
    }
  ],
  memory: [
    {
      id: 'm1',
      title: 'Eternal Moments',
      recipient: 'Family',
      style: {
        bgGradient: 'from-teal-200 via-cyan-100 to-sky-50',
        emoji: '📷',
        themeColor: 'teal',
        fontFamily: 'font-sans',
        layoutType: 'split',
      },
      content: {
        heading: 'Forever in Our Hearts 📷',
        message1: 'Every memory we share is a treasure that glows brighter with time.',
        message2: 'Thank you for being part of this incredible story.',
        giftLink: 'https://google.com',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        musicLabel: 'Memory Waltz',
      }
    },
    {
      id: 'm2',
      title: 'Golden Days',
      recipient: 'Grandma',
      style: {
        bgGradient: 'from-amber-200 via-yellow-100 to-orange-50',
        emoji: '✨',
        themeColor: 'amber',
        fontFamily: 'font-serif',
        layoutType: 'bottom-accent',
      },
      content: {
        heading: 'A Journey Through Time',
        message1: 'Looking back at the beautiful years and looking forward to many more.',
        message2: 'Your wisdom and love guide us every single day.',
        giftLink: 'https://google.com',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        musicLabel: 'Gentle Melody',
      }
    }
  ],
  love: [
    {
      id: 'l1',
      title: 'Heartfelt Devotion',
      recipient: 'My Love',
      style: {
        bgGradient: 'from-red-200 via-pink-100 to-rose-50',
        emoji: '💕',
        themeColor: 'red',
        fontFamily: 'font-serif',
        layoutType: 'centered',
      },
      content: {
        heading: 'You Are My Everything 💕',
        message1: 'Every beat of my heart is a song of love for you.',
        message2: 'I\'m so lucky to have you by my side, today and forever.',
        giftLink: 'https://google.com',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        musicLabel: 'Romantic Piano',
      }
    },
    {
      id: 'l2',
      title: 'Sweet Symphony',
      recipient: 'Bae',
      style: {
        bgGradient: 'from-pink-300 via-rose-200 to-yellow-100',
        emoji: '💖',
        themeColor: 'pink',
        fontFamily: 'font-sans',
        layoutType: 'split',
      },
      content: {
        heading: 'Our Love Story Continues...',
        message1: 'Thinking of you makes my world so much brighter.',
        message2: 'Can\'t wait for our next adventure together!',
        giftLink: 'https://google.com',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        musicLabel: 'Sweet Acoustic',
      }
    }
  ],
  holiday: [
    {
      id: 'h1',
      title: 'Winter Wonderland',
      recipient: 'Friends',
      style: {
        bgGradient: 'from-green-200 via-emerald-100 to-teal-50',
        emoji: '🎄',
        themeColor: 'green',
        fontFamily: 'font-sans',
        layoutType: 'split',
      },
      content: {
        heading: 'Season\'s Greetings! 🎄',
        message1: 'Wishing you warmth, joy, and peace during this festive season.',
        message2: 'May your holidays be merry and your new year be bright!',
        giftLink: 'https://google.com',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        musicLabel: 'Holiday Bells',
      }
    },
    {
      id: 'h2',
      title: 'Festive Cheer',
      recipient: 'Everyone',
      style: {
        bgGradient: 'from-red-200 via-orange-100 to-yellow-50',
        emoji: '✨',
        themeColor: 'red',
        fontFamily: 'font-serif',
        layoutType: 'centered',
      },
      content: {
        heading: 'Happy Holidays from Us!',
        message1: 'Spreading cheer and happiness to you and your loved ones.',
        message2: 'Grateful for your presence in our lives this year.',
        giftLink: 'https://google.com',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        musicLabel: 'Cheerful Strings',
      }
    }
  ],
};
