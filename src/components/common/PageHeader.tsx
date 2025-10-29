import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => (
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-600 mt-1 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
    <div className="mt-4 lg:mt-0 w-full lg:w-auto">
      {children}
    </div>
  </div>
);
