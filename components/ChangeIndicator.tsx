'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getChangeIndicator } from '@/lib/ranks';

interface ChangeIndicatorProps {
  change: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ChangeIndicator({ 
  change, 
  showIcon = true,
  size = 'md' 
}: ChangeIndicatorProps) {
  const indicator = getChangeIndicator(change);
  
  const sizeClasses = {
    sm: 'text-xs gap-0.5',
    md: 'text-sm gap-1',
    lg: 'text-base gap-1.5',
  };
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };
  
  const getIcon = () => {
    if (change > 0) return <TrendingUp size={iconSizes[size]} />;
    if (change < 0) return <TrendingDown size={iconSizes[size]} />;
    return <Minus size={iconSizes[size]} />;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center font-mono font-medium ${sizeClasses[size]}`}
      style={{ color: indicator.color }}
    >
      {showIcon && getIcon()}
      <span>{indicator.text}</span>
    </motion.div>
  );
}
