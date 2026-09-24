import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="themed-header sticky top-0 z-30 flex items-center px-4 sm:px-8 py-4 border-b backdrop-blur-xl transition-colors">
      <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-inherit select-none">
        HuanMux
      </span>
    </header>
  );
};
