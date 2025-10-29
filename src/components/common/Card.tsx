import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick} 
    className={cn(
      "bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-6 transition-all duration-200",
      onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300' : '',
      className
    )}
  >
    {children}
  </div>
);
