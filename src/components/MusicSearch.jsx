import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function MusicSearch({ onSelect, onClose }) {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchMusic();
    }, 600); // Debounce

    return () => clearTimeout(timer);
  }, [query]);

  const [playingUrl, setPlayingUrl] = useState(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    
    if (playingUrl) {
      audio.src = playingUrl;
      audio.play().catch(err => console.error("Preview play failed:", err));
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [playingUrl]);

  // Handle modal close cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const searchMusic = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=15`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      } else {
        throw new Error('Search failed');
      }
    } catch (err) {
      console.error('Music search error:', err);
      setError(t('music_search.error') || (language === 'ka' ? 'ძიება ვერ მოხერხდა' : 'Search failed'));
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = (e, url) => {
    e.stopPropagation();
    if (playingUrl === url) {
      setPlayingUrl(null);
    } else {
      setPlayingUrl(url);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-50 to-pink-50">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              {t('music_search.title')}
            </h3>
            <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] mt-1">{t('music_search.sub')}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-400 hover:text-slate-600 transition active:scale-90 font-bold"
          >
            ×
          </button>
        </div>

        {/* Search Input Area */}
        <div className="p-8 pb-4">
          <div className="relative group">
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('music_search.placeholder')}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-4 font-bold text-slate-700 focus:outline-none focus:border-violet-400 focus:bg-white transition-all shadow-inner"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40 group-focus-within:opacity-100 transition-opacity">🔍</span>
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-3 px-8 pb-8 custom-scrollbar">
          {error && (
            <div className="text-center py-10 text-red-400 font-bold text-sm bg-red-50 rounded-2xl border border-red-100 italic">
               ⚠️ {error}
            </div>
          )}

          {results.length > 0 ? (
            results.map((track) => (
              <div 
                key={track.trackId}
                className="group bg-white hover:bg-violet-50 border border-slate-100 hover:border-violet-200 rounded-2xl p-3 flex items-center gap-4 transition-all hover:translate-x-1 cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => {
                  setPlayingUrl(null); // Stop preview when selecting
                  onSelect({
                    url: track.previewUrl,
                    name: `${track.artistName} - ${track.trackName}`,
                    artwork: track.artworkUrl100
                  });
                }}
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-md flex-shrink-0 group-hover:scale-105 transition-transform border-2 border-white">
                  <img src={track.artworkUrl100} className="w-full h-full object-cover" />
                  <button 
                    onClick={(e) => togglePlay(e, track.previewUrl)}
                    className={`absolute inset-0 flex items-center justify-center bg-black/40 text-white transition-opacity ${playingUrl === track.previewUrl ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    <span className="text-xl">{playingUrl === track.previewUrl ? '⏸' : '▶'}</span>
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-slate-800 truncate text-sm leading-tight">{track.trackName}</div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">{track.artistName}</div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                   <div className="bg-violet-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-500/30">
                     {t('music_search.add') || 'ADD ✨'}
                   </div>
                </div>
              </div>
            ))
          ) : !loading && query.trim() ? (
            <div className="text-center py-14 text-slate-300 font-bold italic">
               {t('music_search.no_results')}
            </div>
          ) : !query.trim() && (
            <div className="text-center py-20 flex flex-col items-center justify-center opacity-30 grayscale saturate-0 pointer-events-none">
               <div className="text-6xl mb-4">🎼</div>
               <p className="text-sm font-black uppercase tracking-[0.3em]">{t('music_search.start_typing')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
