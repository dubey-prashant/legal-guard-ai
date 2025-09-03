import { CheckCircle, RefreshCw } from 'lucide-react';
import { Header } from './Header';
import { ResponseGenerator } from './ResponseGenerator';
import { ProgressSteps } from './ProgressSteps';
import { useAppContext } from '../hooks/useAppContext';

export const CompleteWorkflow = () => {
  const {
    apiKey,
    setApiKey,
    uploadedFile,
    extractedText,
    analysis,
    resetApp,
    safeRender,
    safeRenderArray,
    getRiskBadge,
    getUrgencyBadge,
  } = useAppContext();

  return (
    <div className='min-h-screen gradient-bg'>
      <Header apiKey={apiKey} setApiKey={setApiKey} />

      <main className='container mx-auto px-4 py-6 sm:py-8 max-w-7xl'>
        {/* Progress Steps */}
        <ProgressSteps />

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
          {/* Left Column - Compact Analysis Summary */}
          <div className='lg:col-span-1 space-y-3 sm:space-y-4 order-2 lg:order-1'>
            {/* Document Info */}
            <div className='card'>
              <div className='flex items-center space-x-3 mb-3'>
                <div className='icon-success'>
                  <CheckCircle className='h-3 w-3 sm:h-4 sm:w-4' />
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-medium text-gray-900 truncate text-xs sm:text-sm'>
                    {uploadedFile.name}
                  </h3>
                  <p className='text-xs text-gray-500'>
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={resetApp}
                className='btn-secondary flex items-center justify-center space-x-2 text-xs px-3 py-2 rounded-xl w-full sm:w-auto'
                title='Upload New Document'
              >
                <RefreshCw className='h-4 w-4' />
                <span>Upload New Document</span>
              </button>
            </div>

            {/* Compact Analysis Results */}
            {analysis && (
              <div className='space-y-3 sm:space-y-4'>
                {/* Executive Summary */}
                {analysis.summary && (
                  <div className='card'>
                    <h3 className='font-medium text-gray-900 mb-2 sm:mb-3 text-xs sm:text-sm'>
                      Executive Summary
                    </h3>
                    <p className='text-xs leading-relaxed text-gray-700'>
                      {safeRender(analysis.summary)}
                    </p>
                  </div>
                )}

                {/* Quick Metrics */}
                <div className='card'>
                  <h3 className='font-medium text-gray-900 mb-2 sm:mb-3 text-xs sm:text-sm'>
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
                    <h3 className='font-medium text-primary-900 mb-2 text-xs sm:text-sm'>
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
                    <h3 className='font-medium text-gray-900 mb-2 sm:mb-3 text-xs sm:text-sm'>
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
                            <div className='flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5'>
                              {index + 1}
                            </div>
                            <p className='text-xs leading-relaxed text-gray-700'>
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
          <div className='lg:col-span-2 order-1 lg:order-2'>
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
};
