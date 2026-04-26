import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function DeleteConfirmModal({ isOpen, onConfirm, onCancel }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onCancel}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
            🗑️
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {t('dashboard.delete_modal.title')}
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              {t('dashboard.delete_modal.desc')}
            </p>
          </div>
          
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={onConfirm}
              className="w-full py-4 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition active:scale-95 shadow-xl shadow-red-200"
            >
              {t('dashboard.delete_modal.btn_confirm')}
            </button>
            <button
              onClick={onCancel}
              className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition active:scale-95"
            >
              {t('dashboard.delete_modal.btn_cancel')}
            </button>
          </div>
        </div>
        
        {/* Bottom decorative bar */}
        <div className="h-1.5 bg-gradient-to-r from-red-400 to-rose-500" />
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modal-root') || document.body);
}
