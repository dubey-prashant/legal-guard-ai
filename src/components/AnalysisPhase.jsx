import { CheckCircle, RefreshCw } from 'lucide-react';
import { Header } from './Header';
import { NoticeAnalysis } from './NoticeAnalysis';
import { ProgressSteps } from './ProgressSteps';
import { useAppContext } from '../hooks/useAppContext';

export const AnalysisPhase = () => {
  const {
    apiKey,
    setApiKey,
    uploadedFile,
    extractedText,
    analysis,
    handleAnalysisComplete,
    resetApp,
  } = useAppContext();

  return (
    <div className='min-h-screen gradient-bg'>
      <Header apiKey={apiKey} setApiKey={setApiKey} />

      <main className='container mx-auto px-4 py-6 sm:py-8 max-w-6xl'>
        {/* Progress Steps */}
        <ProgressSteps />

        {/* Combined Document and Analysis Section */}
        <div className='card-elevated'>
          {/* Document Status Header */}
          <div className='border-b border-gray-200 pb-4 sm:pb-6 mb-6 sm:mb-8'>
            <div className='flex items-center justify-between flex-wrap gap-4'>
              <div className='flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1'>
                <div className='icon-success flex-shrink-0'>
                  <CheckCircle className='h-5 w-5 sm:h-6 sm:w-6' />
                </div>
                <div className='min-w-0 flex-1'>
                  <h2 className='text-lg sm:text-xl font-semibold text-gray-900 truncate'>
                    {uploadedFile.name}
                  </h2>
                  <p className='text-xs sm:text-sm text-gray-500'>
                    {(uploadedFile.size / 1024).toFixed(1)} KB • Ready for
                    Analysis
                  </p>
                </div>
              </div>
              <button
                onClick={resetApp}
                className='btn-secondary flex items-center justify-center space-x-2 text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 rounded-xl whitespace-nowrap'
                title='Upload New Document'
              >
                <RefreshCw className='h-4 w-4' />
                <span className='hidden sm:inline'>Upload New Document</span>
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
};
