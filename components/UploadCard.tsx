import React, { useState, useCallback } from 'react';
import { uploadXray } from '../services/api';
import type { UploadData } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface UploadCardProps {
    onUploadSuccess: (predictionId: string) => void;
}

export const UploadCard: React.FC<UploadCardProps> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [patientName, setPatientName] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [fever, setFever] = useState(false);
    const [cold, setCold] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            const selectedFile = files[0];
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
                setError('File size must be less than 10MB.');
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/tiff', 'image/bmp'].includes(selectedFile.type)) {
                setError('Invalid file type. Please upload a JPEG, PNG, TIFF, or BMP image.');
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !patientName) {
            setError('Patient name and an X-ray image are required.');
            return;
        }
        setError(null);
        setIsUploading(true);

        try {
            const uploadData: UploadData = {
                xrayImage: file,
                patientName,
                patientAge: patientAge ? parseInt(patientAge) : undefined,
                clinicalNotes,
                fever,
                cold,
            };
            const result = await uploadXray(uploadData);
            onUploadSuccess(result.id);
        } catch (err) {
            // Show a more specific error message in the UI when available
            console.error('Upload failed:', err);
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        handleFileChange(e.dataTransfer.files);
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-dark-text">New Analysis</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div 
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragOver ? 'border-brand-blue bg-brand-blue-light' : 'border-gray-300 hover:border-gray-400'}`}
                    onClick={() => document.getElementById('file-upload')?.click()}
                >
                    <input id="file-upload" type="file" className="hidden" onChange={(e) => handleFileChange(e.target.files)} accept="image/jpeg,image/png,image/tiff,image/bmp" />
                    <div className="flex flex-col items-center justify-center space-y-2 text-medium-text">
                        <UploadIcon />
                        {file ? (
                             <p><span className="font-semibold">{file.name}</span> selected.</p>
                        ) : (
                            <p>Drag & drop an X-ray image here, or click to select</p>
                        )}
                        <p className="text-xs text-light-text">PNG, JPG, TIFF, BMP up to 10MB</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="patientName" className="block text-sm font-medium text-medium-text">Patient Name</label>
                        <input type="text" id="patientName" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" required />
                    </div>
                    <div>
                        <label htmlFor="patientAge" className="block text-sm font-medium text-medium-text">Patient Age</label>
                        <input 
                            type="number" 
                            id="patientAge" 
                            value={patientAge} 
                            onChange={(e) => setPatientAge(e.target.value)} 
                            min="0" 
                            max="150"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-medium-text">Fever</label>
                        <div className="mt-2 flex space-x-4">
                            <label className="inline-flex items-center">
                                <input type="radio" name="fever" checked={fever === true} onChange={() => setFever(true)} className="form-radio h-4 w-4 text-brand-blue"/>
                                <span className="ml-2 text-sm text-dark-text">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" name="fever" checked={fever === false} onChange={() => setFever(false)} className="form-radio h-4 w-4 text-brand-blue"/>
                                <span className="ml-2 text-sm text-dark-text">No</span>
                            </label>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-medium-text">Cold</label>
                        <div className="mt-2 flex space-x-4">
                            <label className="inline-flex items-center">
                                <input type="radio" name="cold" checked={cold === true} onChange={() => setCold(true)} className="form-radio h-4 w-4 text-brand-blue"/>
                                <span className="ml-2 text-sm text-dark-text">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" name="cold" checked={cold === false} onChange={() => setCold(false)} className="form-radio h-4 w-4 text-brand-blue"/>
                                <span className="ml-2 text-sm text-dark-text">No</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="clinicalNotes" className="block text-sm font-medium text-medium-text">Clinical Notes (Optional)</label>
                    <textarea id="clinicalNotes" value={clinicalNotes} onChange={(e) => setClinicalNotes(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"></textarea>
                </div>

                {error && <p className="text-sm text-brand-red">{error}</p>}

                <button type="submit" disabled={isUploading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isUploading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </>
                    ) : 'Start Analysis'}
                </button>
            </form>
        </div>
    );
};