
import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/30 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20">
          <div className="flex items-center">
            <ShieldCheck className="h-10 w-10 text-indigo-400" />
            <h1 className="ml-3 text-3xl font-bold tracking-tight text-white">
              Football Insight <span className="text-indigo-400">AI</span>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
