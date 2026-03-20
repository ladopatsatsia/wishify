import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  
  const categoriesList = [
    { label: 'Birthday 🎂', cat: 'birthday' },
    { label: 'Graduation 🎓', cat: 'graduation' },
    { label: 'Invitation 💌', cat: 'invitation' },
    { label: 'Memory 📸', cat: 'memory' },
    { label: 'Love ❤️', cat: 'love' },
    { label: 'Holiday 🎄', cat: 'holiday' },
  ];

  const columns = [
    { title: 'Product', links: ['browse', 'howItWorks', 'features', 'pricing'] },
    { title: 'Company', links: ['about', 'blog', 'careers', 'press'] },
    { title: 'Support', links: ['help', 'contact', 'privacy', 'terms'] },
  ];

  const socials = [
    { icon: '𝕏', label: 'Twitter' },
    { icon: '📸', label: 'Instagram' },
    { icon: '💙', label: 'Facebook' },
    { icon: '💼', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-lg">
                🎉
              </div>
              <span className="font-extrabold text-2xl text-white">
                Wish<span className="text-violet-400">ify</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm max-w-xs">
              Making every celebration special with magical digital greeting cards that come to life.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(s => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-violet-500 hover:text-white transition-all hover:scale-110"
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col, idx) => (
            <div key={idx}>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(linkKey => (
                  <li key={linkKey}>
                    <button
                      onClick={() => {
                        if (linkKey === 'browse') navigate('/browse/birthday');
                        else navigate('/');
                      }}
                      className="text-slate-400 hover:text-violet-400 transition-colors text-sm text-left"
                    >
                      {linkKey === 'browse' ? 'Browse Cards' : 
                       linkKey === 'howItWorks' ? 'How it Works' :
                       linkKey === 'features' ? 'Features' :
                       linkKey === 'pricing' ? 'Pricing' :
                       linkKey.charAt(0).toUpperCase() + linkKey.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Category quick links */}
        <div className="border-t border-slate-800 pt-8 pb-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Browse Occasions</p>
          <div className="flex flex-wrap gap-2">
            {categoriesList.map(cat => (
              <button
                key={cat.cat}
                onClick={() => navigate(`/browse/${cat.cat}`)}
                className="text-xs bg-slate-800 text-slate-400 hover:bg-violet-600 hover:text-white px-3 py-1.5 rounded-full transition-colors"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 Wishify Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
