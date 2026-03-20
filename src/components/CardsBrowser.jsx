import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from './Card';
import { cardsData, categories } from '../data/cardsData';

function useFadeIn(ref) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref]);
}

const API_BASE_URL = 'http://localhost:5153/api/templates';

export default function CardsBrowser() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useFadeIn(ref);

  const activeCategory = categoryId || 'birthday';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await fetch(`${API_BASE_URL}/categories`);
        const cats = await catRes.json();
        setCategoriesList(cats);

        const tempRes = await fetch(`${API_BASE_URL}/category/${activeCategory}`);
        const temps = await tempRes.json();

        // Merge local cardsData templates with API results
        const localCards = cardsData[activeCategory] || [];
        const apiIds = new Set(temps.map(t => t.id));
        const uniqueLocal = localCards.filter(c => !apiIds.has(c.id));
        setTemplates([...temps, ...uniqueLocal]);
      } catch (error) {
        console.error('Error fetching cards:', error);
        // Fallback to local data if API is down
        setCategoriesList(categories);
        setTemplates(cardsData[activeCategory] || []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeCategory]);

  const cat = categoriesList.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 pt-24 pb-16 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-violet-600 font-semibold hover:gap-3 transition-all mb-8 group cursor-pointer"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
        </button>

        <div ref={ref} className="fade-in-section mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat?.color} flex items-center justify-center text-3xl shadow-lg animate-bounce-slow`}>
              {cat?.emoji}
            </div>
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900">{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Cards</h2>
              <p className="text-slate-500 text-lg">Choose a base design and make it unique.</p>
            </div>
          </div>

          {/* Category nav tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categoriesList.map(c => (
              <button
                key={c.id}
                onClick={() => navigate(`/browse/${c.id}`)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${c.id === activeCategory
                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-xl scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-600 hover:shadow-md'
                  }`}
              >
                {c.emoji} {c.id.charAt(0).toUpperCase() + c.id.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid - Optimized for 100+ cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500 font-bold">Loading magical templates...</p>
            </div>
          ) : (
            <>
              {templates.map((card, idx) => (
                <Card key={card.id} card={card} categoryId={activeCategory} />
              ))}
              {templates.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-slate-800">No cards found in this category</h3>
                  <p className="text-slate-500">Check back later for new designs!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
