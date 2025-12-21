import React from 'react';
import { Category } from '../../types';

interface MechanicalKnobProps {
  options: Category[];
  selected: Category;
  onChange: (c: Category) => void;
  // Theme props removed for separation of concerns
}

export const MechanicalKnob = ({ options, selected, onChange }: MechanicalKnobProps) => {
  const idx = options.indexOf(selected);
  const angle = -60 + (idx * (120 / (options.length - 1)));
  
  return (
    <div className="flex flex-col items-center py-8 border-b-2 border-concrete-300 dark:border-metal-800 bg-concrete-50 dark:bg-metal-900 transition-colors">
      {/* Visual Knob */}
      <div className="relative w-24 h-24 rounded-full border-4 border-concrete-600 dark:border-metal-600 bg-concrete-200 dark:bg-metal-800 shadow-lg flex items-center justify-center transition-transform ease-out mb-8" style={{ transform: `rotate(${angle}deg)` }}>
        <div className="absolute top-1 w-2 h-6 bg-safety-orange rounded-sm shadow-[0_0_8px_#ffaa00]"></div>
        <div className="w-16 h-16 rounded-full border border-concrete-300 dark:border-metal-700 bg-linear-to-br from-concrete-100 to-concrete-300 dark:from-metal-700 dark:to-metal-900"></div>
      </div>

      {/* Control List */}
      <div className="flex flex-col gap-1 w-full px-6 mb-2">
        {options.map((opt) => {
          const isActive = selected === opt;
          
          return (
            <button 
              key={opt} 
              onClick={() => onChange(opt)} 
              disabled={isActive}
              className={`
                group relative w-full flex items-center justify-between
                py-3 px-4 border-l-[3px]
                text-xs font-bold tracking-[0.2em] font-tech
                transition-all ease-out
                ${isActive 
                  ? 'border-safety-orange text-safety-orange bg-concrete-100 dark:bg-metal-800 shadow-[inset_10px_0_20px_-10px_rgba(255,170,0,0.3)] cursor-default translate-x-0' 
                  : 'border-concrete-200 dark:border-metal-800 text-ink-700 dark:text-metal-400 hover:border-concrete-600 dark:hover:border-metal-400 hover:text-ink-900 dark:hover:text-metal-100 hover:bg-black/5 dark:hover:bg-metal-800/40 hover:translate-x-2 cursor-pointer'
                }
              `}
            >
              {/* Text Label */}
              <span className="relative z-10">{opt}</span>
              
              {/* Status Indicator Light (Right side) */}
              <span className={`
                w-1.5 h-1.5 rounded-sm transition-all
                ${isActive 
                  ? 'bg-safety-orange shadow-[0_0_6px_#ffaa00] opacity-100' 
                  : 'bg-concrete-600 dark:bg-metal-600 opacity-0 group-hover:opacity-50'
                }
              `}></span>

              {/* Background Scanline Decoration (Only visible on Active) */}
              {isActive && (
                <span className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2VkAAIlHRj/AAH8/8cDAgEAAgEBAQAAAAABAgMEWQMZs49C9AAAAABJRU5ErkJggg==')] opacity-10 pointer-events-none"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};