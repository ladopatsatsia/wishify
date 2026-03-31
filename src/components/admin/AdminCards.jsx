import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CreditCard, ExternalLink, Calendar, User, Search, Filter } from 'lucide-react';
import { ADMIN_URL } from '../../api/config';

export default function AdminCards() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`${ADMIN_URL}/cards`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch cards');
        const data = await response.json();
        setCards(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [user.token]);

  const filteredCards = cards.filter(c => 
    c.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.creator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-2xl font-black text-slate-800">
          {language === 'ka' ? 'ყველა ბარათი' : 'All Platform Cards'}
        </h3>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder={language === 'ka' ? 'ძიება...' : 'Search cards...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl py-2 px-10 text-sm font-medium focus:ring-2 focus:ring-violet-500 outline-none w-64 shadow-sm"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-violet-600 transition shadow-sm">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <div key={card.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-200/20 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-50 rounded-full -mr-12 -mt-12 group-hover:bg-violet-100 transition-colors" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-violet-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-800 line-clamp-1">{card.heading || 'No Heading'}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{card.templateTitle}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <User className="w-4 h-4 text-violet-400" />
                <span className="font-medium">To: <span className="font-bold text-slate-800">{card.recipientName}</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-violet-400" />
                <span className="font-medium">By: <span className="font-bold text-slate-800">{card.creator}</span></span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-tighter">
                <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                {card.isPublic && (
                  <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-md">Public</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a 
                href={`/view/birthday/${card.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-center hover:bg-slate-800 transition shadow-lg shadow-slate-200"
              >
                Inspect Card
              </a>
              <button className="p-3 bg-slate-50 text-slate-400 hover:text-violet-600 rounded-2xl transition hover:bg-violet-50">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filteredCards.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 font-medium italic">No cards found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
