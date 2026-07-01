import React, { useState, useEffect, useRef } from 'react';
import { getPredictionById } from '../services/api';
import type { Prediction } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ClockIcon } from './icons/ClockIcon';

interface ResultDetailProps {
    predictionId: string;
}

const InfoItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-medium-text">{label}</p>
        <p className="text-base text-dark-text">{value || 'N/A'}</p>
    </div>
);

const AnalysisFinding: React.FC<{ title: string; text: string }> = ({ title, text }) => (
    <div>
        <h4 className="font-semibold text-dark-text">{title}</h4>
        <p className="text-medium-text">{text}</p>
    </div>
);

export const ResultDetail: React.FC<ResultDetailProps> = ({ predictionId }) => {
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<number | null>(null);

    const fetchPrediction = async () => {
        try {
            const data = await getPredictionById(predictionId);
            if (data) {
                setPrediction(data);
                if (data.status === 'completed' || data.status === 'failed') {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            } else {
                setError('Prediction not found.');
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
        } catch (err) {
            setError('Failed to fetch prediction details.');
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    };
    
    useEffect(() => {
        fetchPrediction();
        intervalRef.current = window.setInterval(fetchPrediction, 2000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [predictionId]);

    if (error) {
        return <div className="text-center p-8 text-brand-red">{error}</div>;
    }
    
    if (!prediction || prediction.status === 'processing') {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm">
                <svg className="animate-spin h-10 w-10 text-brand-blue mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="text-xl font-semibold text-dark-text">Analyzing X-Ray...</h2>
                <p className="text-medium-text mt-1">This may take a few moments.</p>
            </div>
        );
    }

    const { prediction: result, confidence } = prediction;
    const isPneumonia = result === 'Pneumonia Detected';
    const isNormal = result === 'Normal';

    return (
        <div className="space-y-6">
            <div className={`p-6 rounded-lg shadow-sm flex items-center space-x-4 ${isPneumonia ? 'bg-red-50' : isNormal ? 'bg-green-50' : 'bg-yellow-50'}`}>
                {isPneumonia && <XCircleIcon className="h-12 w-12 text-brand-red" />}
                {isNormal && <CheckCircleIcon className="h-12 w-12 text-brand-green" />}
                {!isNormal && !isPneumonia && <ClockIcon className="h-12 w-12 text-brand-yellow" />}
                <div>
                    <h2 className={`text-2xl font-bold ${isPneumonia ? 'text-brand-red' : isNormal ? 'text-brand-green' : 'text-brand-yellow'}`}>
                        {result}
                    </h2>
                    <p className="text-lg text-medium-text">Confidence: {confidence.toFixed(1)}%</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm space-y-6">
                    <h3 className="text-lg font-semibold text-dark-text border-b pb-2">Analysis Details</h3>
                    <div className="space-y-4">
                        <AnalysisFinding title="Left Lung" text={prediction.analysisDetails.leftLung} />
                        <AnalysisFinding title="Right Lung" text={prediction.analysisDetails.rightLung} />
                        <AnalysisFinding title="Heart Size" text={prediction.analysisDetails.heartSize} />
                        <AnalysisFinding title="Bone Density" text={prediction.analysisDetails.boneDensity} />
                    </div>
                     {prediction.clinicalNotes && (
                        <div>
                            <h3 className="text-lg font-semibold text-dark-text border-b pb-2 mb-2">Clinical Notes</h3>
                            <p className="text-medium-text italic">"{prediction.clinicalNotes}"</p>
                        </div>
                     )}
                </div>
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <img src={prediction.filePath} alt="X-Ray" className="rounded-md w-full object-cover"/>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                        <h3 className="text-lg font-semibold text-dark-text border-b pb-2">Patient &amp; Image Info</h3>
                        <InfoItem label="Patient Name" value={prediction.patientName} />
                        <InfoItem label="Patient ID" value={prediction.patientId} />
                        <InfoItem label="Fever" value={typeof prediction.fever === 'boolean' ? (prediction.fever ? 'Yes' : 'No') : 'N/A'} />
                        <InfoItem label="Cold" value={typeof prediction.cold === 'boolean' ? (prediction.cold ? 'Yes' : 'No') : 'N/A'} />
                        <InfoItem label="File Name" value={prediction.fileName} />
                        <InfoItem label="Analyzed At" value={new Date(prediction.analyzedAt).toLocaleString()} />
                        <InfoItem label="Model Version" value={prediction.modelVersion} />
                    </div>
                </div>
            </div>
        </div>
    );
};