'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMode } from '@/types';
import { GAME_MODES, getGameModeConfig } from '@/lib/api';
import { 
  Trophy, Globe, Zap, Move, Crosshair, Swords, Flag, Award, 
  ChevronDown, Gamepad2 
} from 'lucide-react';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  globe: Globe,
  zap: Zap,
  move: Move,
  crosshair: Crosshair,
  swords: Swords,
  flag: Flag,
  award: Award,
};

export default function GameModeSelector({ currentMode, onModeChange }: GameModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentConfig = getGameModeConfig(currentMode);
  const CurrentIcon = iconMap[currentConfig.icon] || Gamepad2;
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelect = (mode: GameMode) => {
    onModeChange(mode);
    setIsOpen(false);
  };
  
  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-text-secondary mb-2">
        Game Mode
      </label>
      
      {/* Current Selection Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto flex items-center gap-3 px-4 py-3 bg-surface border border-white/10 rounded-xl hover:border-white/20 transition-all"
      >
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <CurrentIcon size={20} className="text-primary" />
        </div>
        <div className="flex-1 text-left">
          <div className="font-semibold text-white">{currentConfig.name}</div>
          <div className="text-xs text-text-muted">{currentConfig.description}</div>
        </div>
        <ChevronDown 
          size={20} 
          className={`text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            />
            
            {/* Options */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 sm:right-auto sm:w-80 mt-2 bg-surface border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                {GAME_MODES.map((mode) => {
                  const Icon = iconMap[mode.icon] || Gamepad2;
                  const isActive = mode.id === currentMode;
                  
                  return (
                    <button
                      key={mode.id}
                      onClick={() => handleSelect(mode.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                        ${isActive 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-surface-light border border-transparent'
                        }
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${isActive ? 'bg-primary/20' : 'bg-surface-light'}
                      `}>
                        <Icon 
                          size={20} 
                          className={isActive ? 'text-primary' : 'text-text-secondary'} 
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-medium ${isActive ? 'text-white' : 'text-text-secondary'}`}>
                          {mode.name}
                        </div>
                        <div className="text-xs text-text-muted">{mode.description}</div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
