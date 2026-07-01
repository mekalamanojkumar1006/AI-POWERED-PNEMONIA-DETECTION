import React, { useState, useEffect, useMemo } from 'react';
import { getHistory } from '../services/api';
import type { Prediction } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

type SortKey = keyof Prediction;
type SortOrder = 'asc' | 'desc';

const SortableHeader: React.FC<{
    title: string;
    sortKey: SortKey;
    currentSortKey: SortKey;
    sortOrder: SortOrder;
    onSort: (key: SortKey) => void;
}> = ({ title, sortKey, currentSortKey, sortOrder, onSort }) => {
    const isCurrent = currentSortKey === sortKey;
    return (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-text uppercase tracking-wider cursor-pointer" onClick={() => onSort(sortKey)}>
            <div className="flex items-center">
                {title}
                {isCurrent && (
                    <span className="ml-2">
                        {sortOrder === 'asc' ? '▲' : '▼'}
                    </span>
                )}
            </div>
        </th>
    );
};


export const HistoryTable: React.FC<{ onSelectPrediction: (id: string) => void }> = ({ onSelectPrediction }) => {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    useEffect(() => {
        setLoading(true);
        setError(null);
        getHistory()
            .then(data => {
                setPredictions(data);
            })
            .catch(() => {
                setError('Failed to load prediction history. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    
    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const sortedPredictions = useMemo(() => {
        return [...predictions].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [predictions, sortKey, sortOrder]);

    if (loading) {
        return <div className="text-center p-8">Loading prediction history...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-brand-red">{error}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-dark-text">Prediction History</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader title="Patient Name" sortKey="patientName" currentSortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />
                            <SortableHeader title="Date" sortKey="createdAt" currentSortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />
                            <SortableHeader title="Prediction" sortKey="prediction" currentSortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />
                            <SortableHeader title="Confidence" sortKey="confidence" currentSortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />
                            <SortableHeader title="Fever" sortKey="fever" currentSortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />
                            <SortableHeader title="Cold" sortKey="cold" currentSortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">View</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedPredictions.map((p) => (
                            <tr key={p.id} onClick={() => onSelectPrediction(p.id)} className="hover:bg-gray-50 cursor-pointer">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-dark-text">{p.patientName}</div>
                                    <div className="text-sm text-medium-text">{p.patientId}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-medium-text">{new Date(p.createdAt).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.prediction === 'Pneumonia Detected' ? 'bg-red-100 text-brand-red' : p.prediction === 'Normal' ? 'bg-green-100 text-brand-green' : 'bg-yellow-100 text-brand-yellow'}`}>
                                        {p.prediction}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-medium-text">{p.confidence.toFixed(1)}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-medium-text">{typeof p.fever === 'boolean' ? (p.fever ? 'Yes' : 'No') : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-medium-text">{typeof p.cold === 'boolean' ? (p.cold ? 'Yes' : 'No') : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onSelectPrediction(p.id)} className="text-brand-blue hover:text-blue-700">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};