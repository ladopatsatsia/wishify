import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Card from './Card';
import { CARDS_URL, TEMPLATES_URL } from '../api/config';
import { useAuth } from '../context/AuthContext';
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

const API_BASE_URL = TEMPLATES_URL;

export default function CardsBrowser() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const ref = useRef(null);
  const { language } = useLanguage();
  const { user } = useAuth();
  const [categoriesList, setCategoriesList] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPublishedCards, setHasPublishedCards] = useState(false);

  useFadeIn(ref);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) {
        setHasPublishedCards(false);
        return;
      }
      try {
        const res = await fetch(`${CARDS_URL}/user`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Check if user has any cards with a urlSlug (published/sent)
          setHasPublishedCards(data.some(c => c.urlSlug || c.UrlSlug));
        }
      } catch (err) {
        console.error("Error fetching user stats:", err);
      }
    };
    fetchUserStats();
  }, [user]);

  const activeCategory = categoryId || 'all';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await fetch(`${API_BASE_URL}/categories`);
        const cats = await catRes.json();
        setCategoriesList(cats);

        let mergedTemplates = [];
        
        if (activeCategory === 'all') {
          // Fetch all templates from API
          const allTempRes = await fetch(`${API_BASE_URL}`);
          const allTemps = await allTempRes.json();
          
          // Merge with ALL local cards
          const allLocalCards = Object.values(cardsData).flat();
          const localById = Object.fromEntries(allLocalCards.map(c => [c.id, c]));
          
          mergedTemplates = allTemps.map(t => ({
            ...t,
            customRoute: localById[t.id]?.customRoute || t.customRoute,
            style: localById[t.id]?.style || t.style,
            content: localById[t.id]?.content || t.content,
          }));

          // Add any local cards the API doesn't have
          const apiIds = new Set(allTemps.map(t => t.id));
          const uniqueLocal = allLocalCards.filter(c => !apiIds.has(c.id));
          setTemplates([...mergedTemplates, ...uniqueLocal]);
        } else {
          // Original per-category logic
          const tempRes = await fetch(`${API_BASE_URL}/category/${activeCategory}`);
          const temps = await tempRes.json();

          const localCards = cardsData[activeCategory] || [];
          const localById = Object.fromEntries(localCards.map(c => [c.id, c]));

          mergedTemplates = temps.map(t => ({
            ...t,
            customRoute: localById[t.id]?.customRoute || t.customRoute,
            style: localById[t.id]?.style || t.style,
            content: localById[t.id]?.content || t.content,
          }));

          const apiIds = new Set(temps.map(t => t.id));
          const uniqueLocal = localCards.filter(c => !apiIds.has(c.id));
          setTemplates([...mergedTemplates, ...uniqueLocal]);
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
        setCategoriesList(categories);
        setTemplates(activeCategory === 'all' 
          ? Object.values(cardsData).flat() 
          : (cardsData[activeCategory] || []));
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
          className="flex items-center gap-2 text-violet-600 font-semibold hover:gap-3 transition-all mb-4 group cursor-pointer"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> {language === 'ka' ? 'მთავარ გვერდზე დაბრუნება' : language === 'ru' ? 'Вернуться на главную' : 'Back to Home'}
        </button>

        {!loading && templates.length > 0 && (
          <div className="mb-0 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="bg-gradient-to-r from-violet-100/40 to-pink-100/40 backdrop-blur-sm rounded-t-3xl p-4 sm:p-5 border border-white/50 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm animate-pulse shrink-0">
                ✨
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">
                  {language === 'ka' ? 'სიახლეები გზაშია!' : language === 'ru' ? 'Новинки уже в пути!' : 'New Magic is Coming!'}
                </h4>
                <p className="text-[11px] text-slate-500 italic leading-tight">
                  {language === 'ka' 
                    ? 'ჩვენს კოლექციას პერიოდულად ახალი, უფრო მეტად ჯადოსნური შაბლონები ემატება. თვალი ადევნეთ სიახლეებს!' 
                    : language === 'ru' ? 'В нашу коллекцию периодически добавляются новые, еще более волшебные шаблоны. Следите за обновлениями!'
                    : 'New, even more magical templates are added to our collection periodically.'}
                </p>
              </div>
              <div className="hidden md:block px-3 py-1 bg-white/50 rounded-full text-[9px] font-black text-violet-500 uppercase tracking-widest border border-white whitespace-nowrap">
                 {language === 'ka' ? 'ყოველკვირეული განახლებები' : language === 'ru' ? 'Еженедельные обновления' : 'Weekly Updates'}
              </div>
            </div>
          </div>
        )}

        {/* Cards grid - Attached directly to the banner */}
        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16 p-6 bg-white/30 backdrop-blur-sm border border-white/50 ${templates.length > 0 ? 'rounded-b-3xl' : 'rounded-3xl'}`}>
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500 font-bold">{language === 'ka' ? 'ჯადოსნური შაბლონები იტვირთება...' : language === 'ru' ? 'Загрузка магических шаблонов...' : 'Loading magical templates...'}</p>
            </div>
          ) : (
            <>
              {templates.map((card, idx) => (
                <Card key={card.id} card={card} categoryId={activeCategory} hasPublishedCards={hasPublishedCards} />
              ))}
              {templates.length === 0 && (
                <div className="col-span-full py-20 text-center animate-in fade-in zoom-in duration-700">
                  {activeCategory === 'holiday' || activeCategory === 'invitation' ? (
                    <>
                      <div className="text-8xl mb-6 animate-bounce-slow">
                        {activeCategory === 'holiday' ? '✨🎁🎄' : '💌🥂✨'}
                      </div>
                      <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">
                        {activeCategory === 'holiday' 
                          ? (language === 'ka' ? 'სადღესასწაულო მაგია მზადების პროცესშია...' : language === 'ru' ? 'Праздничное волшебство готовится...' : 'Holiday Magic is Brewing...')
                          : (language === 'ka' ? 'სპეციალური მოსაწვევები მზადების პროცესშია...' : language === 'ru' ? 'Специальные приглашения уже скоро...' : 'Special Invitations are Coming...')}
                      </h3>
                      <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed italic">
                        {activeCategory === 'holiday' 
                          ? (language === 'ka' 
                              ? 'ჩვენი დიზაინერები და ელფები დაუღალავად მუშაობენ ახალ, მრავალფეროვან შაბლონებზე. ძალიან მალე აქ რაღაც განსაკუთრებული დაგხვდებათ! 🎄✨' 
                              : language === 'ru' ? 'Наши дизайнеры и эльфы неустанно работают над новыми тематическими шаблонами. Совсем скоро здесь появится что-то особенное! 🎄✨'
                              : 'Our designers and elves are tirelessly working on new, diverse templates. Something special will appear here very soon! 🎁✨')
                          : (language === 'ka'
                              ? 'ჩვენ ვქმნით ელეგანტურ და დასამახსოვრებელ შაბლონებს თქვენი განსაკუთრებული დღეებისთვის. ძალიან მალე აქ საოცარი სიახლეები დაგხვდებათ! 🥂💍'
                              : language === 'ru' ? 'Мы создаем элегантные и запоминающиеся шаблоны для ваших особенных дней. Совсем скоро здесь появятся удивительные новинки! 🥂💍'
                              : 'We are creating elegant and memorable templates for your special days. Amazing updates will appear here very soon! 💌✨')}
                      </p>
                      <div className="mt-10 inline-flex items-center gap-2 px-6 py-2 bg-green-50 text-green-600 rounded-full font-bold text-sm border border-green-100">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        {language === 'ka' ? 'მალე დაემატება' : language === 'ru' ? 'Скоро' : 'Coming Soon'}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-bold text-slate-800">{language === 'ka' ? 'ამ კატეგორიაში ბარათები არ მოიძებნა' : language === 'ru' ? 'В этой категории открыток не найдено' : 'No cards found in this category'}</h3>
                      <p className="text-slate-500">{language === 'ka' ? 'მოგვიანებით შემოწმეთ ახალი დიზაინები!' : language === 'ru' ? 'Заходите позже, чтобы увидеть новые дизайны!' : 'Check back later for new designs!'}</p>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Category Navigation and Info - Moved BELOW cards grid */}
        <div ref={ref} className="fade-in-section mb-10 pt-10 border-t border-slate-200/50">
          <div className="flex items-center gap-4 mb-3">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat?.color} flex items-center justify-center text-3xl shadow-lg animate-bounce-slow shrink-0`}>
              {cat?.emoji}
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                {language === 'ka' 
                  ? (activeCategory === 'birthday' ? 'დაბადების დღის' : activeCategory === 'invitation' ? 'მოწვევის' : activeCategory === 'memory' ? 'მოგონების' : activeCategory === 'love' ? 'სიყვარულის' : activeCategory === 'holiday' ? 'დღესასწაულის' : activeCategory) + ' ბარათები'
                  : language === 'ru' ? (activeCategory === 'birthday' ? 'Дня рождения' : activeCategory === 'invitation' ? 'Пригласительные' : activeCategory === 'memory' ? 'Пამятные' : activeCategory === 'love' ? 'Любовные' : activeCategory === 'holiday' ? 'Праздничные' : activeCategory) + ' открытки'
                  : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) + ' Templates'}
              </h2>
              <p className="text-slate-400 text-sm mt-1">{language === 'ka' ? 'აღმოაჩინეთ სხვა კატეგორიები' : 'Explore other categories'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            <button
              onClick={() => navigate('/browse/all')}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${activeCategory === 'all'
                ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-xl scale-105'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-600 hover:shadow-md'
              }`}
            >
              🌈 {language === 'ka' ? 'ყველა' : language === 'ru' ? 'Все' : 'All'}
            </button>
            {categoriesList.map(c => (
              <button
                key={c.id}
                onClick={() => navigate(`/browse/${c.id}`)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${c.id === activeCategory
                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-xl scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-600 hover:shadow-md'
                  }`}
              >
                {c.emoji} {language === 'ka' ? (c.id === 'birthday' ? 'დაბადების დღე' : c.id === 'invitation' ? 'მოწვევა' : c.id === 'memory' ? 'მოგონება' : c.id === 'love' ? 'სიყვარული' : c.id === 'holiday' ? 'დღესასწაული' : c.id) : language === 'ru' ? (c.id === 'birthday' ? 'День рождения' : c.id === 'invitation' ? 'Приглашение' : c.id === 'memory' ? 'Воспоминание' : c.id === 'love' ? 'Любовь' : c.id === 'holiday' ? 'Праздник' : c.id) : c.id.charAt(0).toUpperCase() + c.id.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
