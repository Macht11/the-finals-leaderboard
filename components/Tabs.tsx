'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ 
  defaultValue, 
  value, 
  onValueChange, 
  children,
  className = '' 
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  
  const actualValue = value !== undefined ? value : internalValue;
  const handleValueChange = onValueChange || setInternalValue;
  
  return (
    <TabsContext.Provider value={{ value: actualValue, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`inline-flex ${className}`} role="tablist">
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useTabs();
  const isSelected = selectedValue === value;
  
  return (
    <button
      role="tab"
      aria-selected={isSelected}
      onClick={() => onValueChange(value)}
      className={`
        relative px-4 py-2 text-sm font-medium transition-colors rounded-md
        ${isSelected ? 'text-white' : 'text-text-secondary hover:text-white'}
        ${className}
      `}
    >
      {isSelected && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-0 bg-primary/10 rounded-md"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const { value: selectedValue } = useTabs();
  
  if (selectedValue !== value) return null;
  
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}
