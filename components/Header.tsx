'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Trophy, Users, BarChart3, Target } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'rising', label: 'Rising Stars', icon: Target },
  { id: 'stats', label: 'Statistics', icon: BarChart3 },
];

export default function Header({ currentView, onViewChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => onViewChange('leaderboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <Trophy className="text-white" size={20} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black tracking-tight">
                <span className="gradient-text">THE FINALS</span>
              </h1>
              <p className="text-xs text-text-muted">Ranked Leaderboard</p>
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${currentView === item.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-secondary hover:text-white hover:bg-surface-light'
                  }
                `}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* Season Badge */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-surface-light border border-white/5">
              <span className="text-xs text-text-muted">Season</span>
              <span className="ml-2 text-sm font-bold text-white">9</span>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-light transition-colors"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <Menu size={24} className="text-white" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-white/5 bg-surface"
        >
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${currentView === item.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-secondary hover:text-white hover:bg-surface-light'
                  }
                `}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
