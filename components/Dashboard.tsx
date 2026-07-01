
import React, { useState, useEffect } from 'react';
import { getStats, getHistory, getModelInfo } from '../services/api';
import type { Stats, Prediction, ModelInfo, View } from '../types';
import { UploadCard } from './UploadCard';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
    <div className="bg-brand-blue-light text-brand-blue rounded-full p-3">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-medium-text">{title}</p>
      <p className="text-2xl font-bold text-dark-text">{value}</p>
    </div>
  </div>
);

const RecentPredictionItem: React.FC<{ prediction: Prediction, onSelect: (id: string) => void }> = ({ prediction, onSelect }) => (
    <li 
      onClick={() => onSelect(prediction.id)}
      className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
    >
      <div>
        <p className="font-semibold text-dark-text">{prediction.patientName}</p>
        <p className="text-sm text-medium-text">
            {new Date(prediction.createdAt).toLocaleDateString()}
            {' - '}
            <span className={`font-medium ${prediction.prediction === 'Pneumonia Detected' ? 'text-brand-red' : 'text-brand-green'}`}>
                {prediction.prediction}
            </span>
        </p>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-text" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </li>
);


export const Dashboard: React.FC<{ onNavigate: (view: View, id?: string) => void }> = ({ onNavigate }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Prediction[]>([]);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);

  useEffect(() => {
    getStats().then(setStats);
    getHistory().then(history => setRecent(history.slice(0, 5)));
    getModelInfo().then(setModelInfo);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Predictions" value={stats?.totalPredictions || 0} icon={<ChartBarIcon />} />
        <StatCard title="Pneumonia Cases" value={stats?.pneumoniaCases || 0} icon={<ChartBarIcon className="text-brand-red"/>} />
        <StatCard title="Normal Cases" value={stats?.normalCases || 0} icon={<ChartBarIcon className="text-brand-green"/>} />
        <StatCard title="Avg. Processing Time" value={`${stats?.avgProcessingTime || 0}s`} icon={<DocumentTextIcon />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <UploadCard onUploadSuccess={(id) => onNavigate('result', id)} />
        </div>
        <div className="space-y-4">
             <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-dark-text mb-4">Recent Analyses</h3>
                {recent.length > 0 ? (
                    <ul className="space-y-2">
                        {recent.map(p => <RecentPredictionItem key={p.id} prediction={p} onSelect={(id) => onNavigate('result', id)} />)}
                    </ul>
                ) : (
                    <p className="text-medium-text">No recent predictions found.</p>
                )}
            </div>
            {modelInfo && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-dark-text mb-2">Model Information</h3>
                    <p className="text-sm text-medium-text"><span className="font-semibold">{modelInfo.modelName} (v{modelInfo.version})</span></p>
                    <p className="text-xs text-light-text mt-1">{modelInfo.description}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
