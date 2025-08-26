import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { NoticeAnalysis } from './components/NoticeAnalysis';
import { ResponseGenerator } from './components/ResponseGenerator';
import { Header } from './components/Header';
import {
  Shield,
  FileText,
  MessageSquare,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Clock,
  Users,
} from 'lucide-react';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [apiKey, setApiKey] = useState('');

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

  const currentStep = getCurrentStep();

  // Progress Steps Component
  const ProgressSteps = () => (
    <div className='flex justify-center mb-12'>
      <div className='flex items-center space-x-4'>
        {/* Step 1: Upload */}
        <div
          className={`progress-step ${
            currentStep >= 1 ? 'completed' : 'inactive'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentStep >= 1
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {currentStep > 1 ? (
              <CheckCircle className='h-5 w-5' />
            ) : (
              <FileText className='h-5 w-5' />
            )}
          </div>
          <span className='font-medium text-sm'>Upload Document</span>
        </div>

        <div
          className={`progress-line ${
            currentStep >= 2 ? 'completed' : 'inactive'
          }`}
        ></div>

        {/* Step 2: Analyze */}
        <div
          className={`progress-step ${
            currentStep >= 2
              ? currentStep === 2
                ? 'active'
                : 'completed'
              : 'inactive'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentStep >= 3
                ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg'
                : currentStep === 2
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg pulse'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {currentStep > 2 ? (
              <CheckCircle className='h-5 w-5' />
            ) : (
              <Shield className='h-5 w-5' />
            )}
          </div>
          <span className='font-medium text-sm'>AI Analysis</span>
        </div>

        <div
          className={`progress-line ${
            currentStep >= 3 ? 'completed' : 'inactive'
          }`}
        ></div>

        {/* Step 3: Response */}
        <div
          className={`progress-step ${
            currentStep >= 3 ? 'active' : 'inactive'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentStep >= 3
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <MessageSquare className='h-5 w-5' />
          </div>
          <span className='font-medium text-sm'>Generate Response</span>
        </div>
      </div>
    </div>
  );

  // Hero Landing Page
  if (!uploadedFile) {
    return (
      <div className='min-h-screen gradient-bg'>
        <Header apiKey={apiKey} setApiKey={setApiKey} />

        <main className='flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8'>
          <div className='w-full max-w-6xl'>
            {/* Hero Section */}
            <div className='text-center mb-16 px-4'>
              <div className='flex justify-center mb-8'>
                <div className='relative'>
                  <div className='absolute inset-0 animated-gradient rounded-full blur-3xl opacity-30'></div>
                  <div className='relative bg-white rounded-full p-6 shadow-large'>
                    <Shield className='h-16 w-16 text-primary-600' />
                  </div>
                </div>
              </div>

              <h1 className='text-6xl md:text-7xl pb-4 font-bold font-heading mb-6 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 bg-clip-text text-transparent px-4'>
                LegalGuard AI
              </h1>

              <p className='text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8'>
                Transform legal document analysis with AI-powered insights. Get
                instant risk assessments, compliance guidance, and professional
                responses.
              </p>

              <div className='flex flex-wrap justify-center gap-3 mb-12'>
                <span className='status-badge bg-primary-100 text-primary-800 border border-primary-200'>
                  <Sparkles className='h-3 w-3 mr-1' />
                  AI-Powered Analysis
                </span>
                <span className='status-badge bg-success-100 text-success-800 border border-success-200'>
                  <CheckCircle className='h-3 w-3 mr-1' />
                  Instant Results
                </span>
                <span className='status-badge bg-warning-100 text-warning-800 border border-warning-200'>
                  <Shield className='h-3 w-3 mr-1' />
                  Risk Assessment
                </span>
              </div>
            </div>

            {/* Progress Steps */}
            <ProgressSteps />

            {/* Upload Section */}
            <div className='max-w-3xl mx-auto mb-16'>
              <FileUpload
                onFileUpload={handleFileUpload}
                uploadedFile={uploadedFile}
                onReset={resetApp}
              />
            </div>

            {/* Features Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
              <div className='glass-card text-center group hover:scale-105 transition-all duration-300'>
                <div className='icon-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                  <FileText className='h-6 w-6' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Smart Document Processing
                </h3>
                <p className='text-sm text-gray-600'>
                  Advanced PDF text extraction with support for complex legal
                  documents
                </p>
              </div>

              <div className='glass-card text-center group hover:scale-105 transition-all duration-300'>
                <div className='icon-success mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                  <TrendingUp className='h-6 w-6' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Risk Analysis
                </h3>
                <p className='text-sm text-gray-600'>
                  Comprehensive risk assessment with severity scoring and
                  recommendations
                </p>
              </div>

              <div className='glass-card text-center group hover:scale-105 transition-all duration-300'>
                <div className='icon-warning mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                  <Clock className='h-6 w-6' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Deadline Tracking
                </h3>
                <p className='text-sm text-gray-600'>
                  Automatic deadline extraction with urgency alerts and
                  compliance timelines
                </p>
              </div>

              <div className='glass-card text-center group hover:scale-105 transition-all duration-300'>
                <div className='icon-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                  <Users className='h-6 w-6' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Professional Responses
                </h3>
                <p className='text-sm text-gray-600'>
                  Generate legally sound responses tailored to your specific
                  situation
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Analysis Phase
  if (uploadedFile && !analysis) {
    return (
      <div className='min-h-screen gradient-bg'>
        <Header apiKey={apiKey} setApiKey={setApiKey} />

        <main className='container mx-auto px-4 py-8 max-w-6xl'>
          {/* Progress Steps */}
          <ProgressSteps />

          {/* Combined Document and Analysis Section */}
          <div className='card-elevated'>
            {/* Document Status Header */}
            <div className='border-b border-gray-200 pb-6 mb-8'>
              <div className='flex items-center justify-between flex-wrap gap-4'>
                <div className='flex items-center space-x-4'>
                  <div className='icon-success'>
                    <CheckCircle className='h-6 w-6' />
                  </div>
                  <div>
                    <h2 className='text-xl font-semibold text-gray-900'>
                      {uploadedFile.name}
                    </h2>
                    <p className='text-sm text-gray-500'>
                      {(uploadedFile.size / 1024).toFixed(1)} KB • Ready for
                      Analysis
                    </p>
                  </div>
                </div>
                <button onClick={resetApp} className='btn-secondary text-sm'>
                  Upload New Document
                </button>
              </div>
            </div>

            {/* Analysis Component */}
            <NoticeAnalysis
              text={extractedText}
              apiKey={apiKey}
              onAnalysisComplete={handleAnalysisComplete}
              analysis={analysis}
            />
          </div>
        </main>
      </div>
    );
  }

  // Complete Workflow - Analysis & Response
  return (
    <div className='min-h-screen gradient-bg'>
      <Header apiKey={apiKey} setApiKey={setApiKey} />

      <main className='container mx-auto px-4 py-8 max-w-7xl'>
        {/* Progress Steps */}
        <ProgressSteps />

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column - Compact Analysis Summary */}
          <div className='lg:col-span-1 space-y-4'>
            {/* Document Info */}
            <div className='card'>
              <div className='flex items-center space-x-3 mb-3'>
                <div className='icon-success'>
                  <CheckCircle className='h-4 w-4' />
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-medium text-gray-900 truncate text-sm'>
                    {uploadedFile.name}
                  </h3>
                  <p className='text-xs text-gray-500'>
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={resetApp}
                className='btn-secondary text-xs w-full'
              >
                Upload New Document
              </button>
            </div>

            {/* Compact Analysis Results */}
            {analysis && (
              <div className='space-y-4'>
                {/* Executive Summary */}
                {analysis.summary && (
                  <div className='card'>
                    <h3 className='font-medium text-gray-900 mb-3 text-sm'>
                      Executive Summary
                    </h3>
                    <p className='text-xs text-gray-700 leading-relaxed'>
                      {safeRender(analysis.summary)}
                    </p>
                  </div>
                )}

                {/* Quick Metrics */}
                <div className='card'>
                  <h3 className='font-medium text-gray-900 mb-3 text-sm'>
                    Key Metrics
                  </h3>
                  <div className='space-y-2'>
                    {analysis.riskAssessment?.level && (
                      <div className='flex items-center justify-between'>
                        <span className='text-xs text-gray-600'>
                          Risk Level
                        </span>
                        <span
                          className={`${getRiskBadge(
                            analysis.riskAssessment.level
                          )} text-xs`}
                        >
                          {safeRender(
                            analysis.riskAssessment.level
                          ).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {analysis.urgency && (
                      <div className='flex items-center justify-between'>
                        <span className='text-xs text-gray-600'>Urgency</span>
                        <span
                          className={`${getUrgencyBadge(
                            analysis.urgency
                          )} text-xs`}
                        >
                          {safeRender(analysis.urgency).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {analysis.responseDeadline && (
                      <div className='flex items-center justify-between'>
                        <span className='text-xs text-gray-600'>Deadline</span>
                        <span className='text-xs text-gray-900 font-medium'>
                          {safeRender(analysis.responseDeadline)}
                        </span>
                      </div>
                    )}
                    {analysis.financialImplications && (
                      <div className='flex items-center justify-between'>
                        <span className='text-xs text-gray-600'>
                          Financial Impact
                        </span>
                        <span className='text-xs text-gray-900 font-medium'>
                          {safeRender(analysis.financialImplications)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Recommendation */}
                {analysis.recommendedResponseType && (
                  <div className='card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200'>
                    <h3 className='font-medium text-primary-900 mb-2 text-sm'>
                      AI Recommendation
                    </h3>
                    <div className='text-xs text-primary-800 mb-2 capitalize'>
                      {safeRender(analysis.recommendedResponseType.type)}{' '}
                      Response
                    </div>
                    <p className='text-xs text-primary-700 leading-relaxed'>
                      {safeRender(analysis.recommendedResponseType.reasoning)}
                    </p>
                  </div>
                )}

                {/* Quick Action Items */}
                {safeRenderArray(analysis.actionItems).length > 0 && (
                  <div className='card'>
                    <h3 className='font-medium text-gray-900 mb-3 text-sm'>
                      Action Items
                    </h3>
                    <div className='space-y-1'>
                      {safeRenderArray(analysis.actionItems)
                        .slice(0, 3)
                        .map((item, index) => (
                          <div
                            key={index}
                            className='flex items-start space-x-2'
                          >
                            <div className='flex-shrink-0 w-4 h-4 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5'>
                              {index + 1}
                            </div>
                            <p className='text-xs text-gray-700 leading-relaxed'>
                              {safeRender(item)}
                            </p>
                          </div>
                        ))}
                      {safeRenderArray(analysis.actionItems).length > 3 && (
                        <p className='text-xs text-gray-500 italic'>
                          +{safeRenderArray(analysis.actionItems).length - 3}{' '}
                          more items
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Response Generator */}
          <div className='lg:col-span-2'>
            <ResponseGenerator
              analysis={analysis}
              apiKey={apiKey}
              originalText={extractedText}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
