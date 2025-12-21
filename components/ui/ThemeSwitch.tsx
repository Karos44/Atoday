import React from 'react';

interface ThemeSwitchProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeSwitch = ({ isDark, onToggle }: ThemeSwitchProps) => {
  return (
    <div className="w-full px-6 mb-2">
      {/* Label */}
      <div className="text-[10px] text-ink-400 dark:text-metal-700 uppercase tracking-widest font-mono opacity-50 mb-2">
        全局光照控制
      </div>

      <button 
        onClick={onToggle}
        className={`
          relative w-full h-12 border-2 transition-all active:scale-[0.98]
          flex items-center justify-between px-4 font-tech tracking-widest text-xs
          ${isDark 
            ? 'border-metal-700 bg-metal-900 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] text-metal-500' // Dark: "Sunken"
            : 'border-concrete-300 bg-concrete-100 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.8)] text-ink-900' // Light: "Raised"
          }
        `}
      >
         <span>{isDark ? '夜间任务' : '日间任务'}</span>
         
         {/* Physical Switch Indicator */}
         <div className={`w-8 h-4 rounded-sm border transition-colors flex items-center p-0.5 ${isDark ? 'border-metal-600 bg-metal-800' : 'border-concrete-400 bg-concrete-200'}`}>
            <div className={`w-3 h-full bg-safety-orange shadow-sm transition-transform ${isDark ? 'translate-x-0 opacity-50' : 'translate-x-4 opacity-100'}`}></div>
         </div>
      </button>

      <div className="mt-2 text-[10px] text-ink-400 dark:text-metal-700 uppercase tracking-widest font-mono opacity-50 text-right">
        模式选择器 // V.02
      </div>
    </div>
  );
};