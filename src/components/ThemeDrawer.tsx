import React, { useEffect } from 'react';
import { X, Check, Palette } from 'lucide-react';
import { THEMES } from '../constants/themes';
import { ThemeId } from '../types';

interface ThemeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
}

export const ThemeDrawer: React.FC<ThemeDrawerProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside className="themed-sidebar relative w-full max-w-md h-full flex flex-col border-l shadow-2xl z-10 overflow-hidden backdrop-blur-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-inherit/15">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <div>
              <h2 className="font-display font-bold text-lg leading-none">Mux Design Themes</h2>
              <p className="text-xs opacity-60 mt-1">10 Curated colorways from Serafina</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="themed-btn p-2 rounded-xl opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {THEMES.map((theme) => {
            const isActive = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                  isActive
                    ? 'shadow-md ring-2'
                    : 'hover:bg-white/5 hover:border-inherit/20'
                }`}
                style={{
                  backgroundColor: theme.bgPreview,
                  borderColor: isActive ? theme.accent : theme.borderPreview,
                  color: theme.mode === 'dark' ? '#fafafa' : '#18181b',
                  boxShadow: isActive ? `0 0 0 2px ${theme.accent}` : undefined,
                }}
              >
                {/* Accent Swatch Preview */}
                <div
                  className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border shadow-xs"
                  style={{
                    backgroundColor: theme.accent,
                    borderColor: 'rgba(255,255,255,0.2)',
                  }}
                >
                  {isActive && <Check className="w-5 h-5 text-white stroke-[2.5]" />}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm truncate">{theme.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider opacity-60 bg-black/10 dark:bg-white/10 shrink-0">
                      {theme.mode}
                    </span>
                  </div>
                  <p className="text-xs opacity-75 mt-1 line-clamp-2 leading-relaxed">
                    {theme.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-inherit/15 text-center text-xs opacity-60">
          <span>Active theme persists to your device session</span>
        </div>
      </aside>
    </div>
  );
};
