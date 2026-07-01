
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { HistoryTable } from './components/HistoryTable';
import { ResultDetail } from './components/ResultDetail';
import type { View } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(null);

  const handleNavigate = (newView: View, predictionId: string | null = null) => {
    setView(newView);
    setSelectedPredictionId(predictionId);
  };
  
  const renderContent = () => {
    switch (view) {
      case 'history':
        return <HistoryTable onSelectPrediction={(id) => handleNavigate('result', id)} />;
      case 'result':
        return selectedPredictionId ? <ResultDetail predictionId={selectedPredictionId} /> : <Dashboard onNavigate={handleNavigate} />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-light-bg">
      <Header currentView={view} onNavigate={handleNavigate} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
