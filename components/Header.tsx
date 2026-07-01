
import React from 'react';
import type { View } from '../types';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const NavLink: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-brand-blue text-white'
        : 'text-medium-text hover:bg-medium-bg hover:text-dark-text'
    }`}
  >
    {children}
  </button>
);

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm4 0a1 1 0 00-1 1v8a1 1 0 001 1h6a1 1 0 001-1V6a1 1 0 00-1-1H7z" clipRule="evenodd" />
              <path d="M10 7a.5.5 0 00-.5.5v5a.5.5 0 001 0v-5A.5.5 0 0010 7zM7 10a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5A.5.5 0 017 10z" />
            </svg>
            <h1 className="text-xl font-bold text-dark-text">AI Pneumonia Detection</h1>
          </div>
          <nav className="flex space-x-4">
            <NavLink isActive={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')}>
              Dashboard
            </NavLink>
            <NavLink isActive={currentView === 'history'} onClick={() => onNavigate('history')}>
              History
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};
