import { useState } from 'react';
import { AppContext } from '../hooks/useAppContext';

export const AppProvider = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [apiKey, setApiKey] = useState('');

  const handleFileUpload = (file, text) => {
    setUploadedFile(file);
    setExtractedText(text);
    setAnalysis(null); // Reset analysis when new file is uploaded
  };

  const handleAnalysisComplete = (analysisResult) => {
    setAnalysis(analysisResult);
  };

  const resetApp = () => {
    setUploadedFile(null);
    setExtractedText('');
    setAnalysis(null);
  };

  // Get current step for progress indicator
  const getCurrentStep = () => {
    if (!uploadedFile) return 1;
    if (uploadedFile && !analysis) return 2;
    return 3;
  };

  // Helper functions for analysis display
  const safeRender = (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value === null || value === undefined) return 'Not specified';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const safeRenderArray = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.filter((item) => item && typeof item === 'string');
  };

  const getRiskBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'status-high';
      case 'medium':
        return 'status-medium';
      case 'low':
        return 'status-low';
      default:
        return 'status-info';
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return 'status-high';
      case 'medium':
        return 'status-medium';
      case 'low':
        return 'status-low';
      default:
        return 'status-info';
    }
  };

  const value = {
    // State
    uploadedFile,
    extractedText,
    analysis,
    apiKey,

    // Actions
    setApiKey,
    handleFileUpload,
    handleAnalysisComplete,
    resetApp,

    // Computed values
    currentStep: getCurrentStep(),

    // Helper functions
    safeRender,
    safeRenderArray,
    getRiskBadge,
    getUrgencyBadge,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
