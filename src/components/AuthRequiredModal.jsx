import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

export default function AuthRequiredModal({ isOpen, onClose }) {
  const { language } = useLanguage();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.stopPropagation();
    onClose();
    navigate('/login');
  };

  const handleRegister = (e) => {
    e.stopPropagation();
    onClose();
    navigate('/signup');
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop - absolute to cover everything, clickable to close */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
        onClick={(e) => {
          console.log("Backdrop Absolute Clicked");
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Modal - relative to stay on top, stopPropagation to prevent closing when clicking inside */}
      <div 
        className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 flex flex-col items-center text-center gap-8 animate-in fade-in zoom-in duration-200"
        onClick={(e) => {
          console.log("Modal Container Clicked");
          e.stopPropagation();
        }}
      >
        
        {/* Glow behind icon */}
        <div className="absolute top-10 w-24 h-24 bg-violet-400/20 blur-3xl rounded-full" />
        
        {/* Icon */}
        <div className="relative w-20 h-20 bg-gradient-to-br from-violet-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl shadow-violet-200 animate-bounce-subtle">
          <span className="text-4xl">🔐</span>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            {language === 'ka' ? 'ავტორიზაცია საჭიროა' : language === 'ru' ? 'Требуется вход' : 'Login Required'}
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            {language === 'ka' 
              ? 'ბარათის პერსონალიზაციისთვის და შესანახად გთხოვთ გაიაროთ ავტორიზაცია ან დარეგისტრირდეთ.' 
              : language === 'ru' 
                ? 'Чтобы персонализировать и сохранить открытку, пожалуйста, войдите в систему или зарегистрируйтесь.' 
                : 'To personalize and save your cards, please log in to your account or create a new one.'}
          </p>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg cursor-pointer"
          >
            {language === 'ka' ? 'შესვლა' : language === 'ru' ? 'Войти' : 'Login'}
          </button>
          <button
            onClick={handleRegister}
            className="w-full py-4 border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            {language === 'ka' ? 'რეგისტრაცია' : language === 'ru' ? 'Регистрация' : 'Register'}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="mt-2 text-slate-400 font-bold text-sm hover:text-slate-600 transition cursor-pointer"
          >
            {language === 'ka' ? 'მოგვიანებით' : language === 'ru' ? 'Позже' : 'Maybe Later'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modal-root'));
}
