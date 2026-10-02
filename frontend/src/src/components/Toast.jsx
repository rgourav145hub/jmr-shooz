import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, subtext, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-brand-surface border border-brand-gold/50 rounded-xl shadow-2xl p-4 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300">
      <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0 mt-0.5">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h5 className="text-sm font-bold text-white tracking-wide">{message}</h5>
        {subtext && <p className="text-xs text-slate-300 mt-0.5">{subtext}</p>}
      </div>
      <button 
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
