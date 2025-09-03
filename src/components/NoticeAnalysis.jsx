import { useState } from 'react';
import {
  Brain,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  TrendingUp,
  Target,
  FileCheck,
  Calendar,
  DollarSign,
  Zap,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
} from 'lucide-react';
import { analyzeNotice, getEffectiveApiKey } from '../services/geminiService';

export const NoticeAnalysis = ({
  text,
  apiKey,
  onAnalysisComplete,
  analysis,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    const effectiveApiKey = getEffectiveApiKey(apiKey);

    if (!effectiveApiKey) {
      setError(
        'No API key available. Please enter your Gemini API key in the settings or configure a default API key.'
      );
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const result = await analyzeNotice(text, apiKey);
      onAnalysisComplete(result);
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper functions
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

  const hasApiKey = getEffectiveApiKey(apiKey);

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Analysis Header */}
      <div className='card'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-4'>
          <div className='flex items-center space-x-3'>
            <div className='icon-primary flex-shrink-0'>
              <Brain className='h-5 w-5 sm:h-6 sm:w-6' />
            </div>
            <div className='min-w-0 flex-1'>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-900'>
                AI Legal Analysis
              </h2>
              <p className='text-xs sm:text-sm text-gray-500'>
                Comprehensive document insights and recommendations
              </p>
            </div>
          </div>

          {!analysis && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !hasApiKey}
              className='btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 w-full sm:w-auto flex-shrink-0'
            >
              {isAnalyzing ? (
                <>
                  <div className='animate-spin h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full'></div>
                  <span className='text-sm sm:text-base'>Analyzing...</span>
                </>
              ) : (
                <>
                  <Zap className='h-3 w-3 sm:h-4 sm:w-4' />
                  <span className='text-sm sm:text-base'>Start Analysis</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className='text-center py-8 sm:py-12'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full blur-xl opacity-30 animate-pulse'></div>
              <div className='relative bg-gradient-to-r from-primary-500 to-primary-600 rounded-full p-3 sm:p-4 inline-block'>
                <Brain className='h-6 w-6 sm:h-8 sm:w-8 text-white animate-pulse' />
              </div>
            </div>
            <h3 className='text-base sm:text-lg font-medium text-gray-900 mt-3 sm:mt-4 mb-2'>
              AI Analysis in Progress
            </h3>
            <p className='text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-4'>
              Our AI is examining your document for key insights...
            </p>
            <div className='flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 px-4'>
              <span className='flex items-center space-x-1'>
                <div className='w-2 h-2 bg-primary-600 rounded-full animate-bounce'></div>
                <span>Risk Assessment</span>
              </span>
              <span className='flex items-center space-x-1'>
                <div
                  className='w-2 h-2 bg-primary-600 rounded-full animate-bounce'
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <span>Compliance Check</span>
              </span>
              <span className='flex items-center space-x-1'>
                <div
                  className='w-2 h-2 bg-primary-600 rounded-full animate-bounce'
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <span>Action Plan</span>
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='p-3 sm:p-4 bg-danger-50 border border-danger-200 rounded-xl'>
            <div className='flex items-start space-x-2 sm:space-x-3'>
              <AlertCircle className='h-4 w-4 sm:h-5 sm:w-5 text-danger-600 mt-0.5 flex-shrink-0' />
              <div className='min-w-0 flex-1'>
                <p className='text-xs sm:text-sm font-medium text-danger-900'>
                  Analysis Failed
                </p>
                <p className='text-xs sm:text-sm text-danger-800 mt-1 break-words'>
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className='space-y-4 sm:space-y-6'>
          {/* Key Insights Dashboard */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
            {/* Risk Level */}
            {analysis.riskAssessment?.level && (
              <div className='card text-center'>
                <div className='icon-danger mx-auto mb-2 sm:mb-3'>
                  <Shield className='h-5 w-5 sm:h-6 sm:w-6' />
                </div>
                <h3 className='font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base'>
                  Risk Level
                </h3>
                <span
                  className={`${getRiskBadge(
                    analysis.riskAssessment.level
                  )} text-sm`}
                >
                  {safeRender(analysis.riskAssessment.level).toUpperCase()}
                </span>
              </div>
            )}

            {/* Urgency */}
            {analysis.urgency && (
              <div className='card text-center'>
                <div className='icon-warning mx-auto mb-3'>
                  <Clock className='h-6 w-6' />
                </div>
                <h3 className='font-medium text-gray-900 mb-2'>
                  Urgency Level
                </h3>
                <span
                  className={`${getUrgencyBadge(analysis.urgency)} text-sm`}
                >
                  {safeRender(analysis.urgency).toUpperCase()}
                </span>
              </div>
            )}

            {/* Compliance Status */}
            {analysis.complianceRequirement && (
              <div className='card text-center'>
                <div className='icon-primary mx-auto mb-3'>
                  <FileCheck className='h-6 w-6' />
                </div>
                <h3 className='font-medium text-gray-900 mb-2'>Compliance</h3>
                <span className='status-info text-sm'>
                  {safeRender(analysis.complianceRequirement).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Executive Summary */}
          <div className='card-elevated'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='icon-primary'>
                <FileCheck className='h-5 w-5' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900'>
                Executive Summary
              </h3>
            </div>
            <p className='text-gray-700 leading-relaxed'>
              {safeRender(analysis.summary)}
            </p>
          </div>

          {/* AI Recommendation */}
          {analysis.recommendedResponseType && (
            <div className='card-elevated bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200'>
              <div className='flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4'>
                <div className='icon-primary'>
                  <Lightbulb className='h-4 w-4 sm:h-5 sm:w-5' />
                </div>
                <h3 className='text-base sm:text-lg font-semibold text-primary-900'>
                  AI Strategic Recommendation
                </h3>
              </div>

              <div className='bg-white rounded-xl p-3 sm:p-4 border border-primary-200 mb-3 sm:mb-4'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2 sm:mb-3'>
                  <div className='flex items-center space-x-2'>
                    <Target className='h-3 w-3 sm:h-4 sm:w-4 text-primary-600' />
                    <span className='font-medium text-gray-900 capitalize text-sm sm:text-base'>
                      {safeRender(analysis.recommendedResponseType.type)}{' '}
                      Response
                    </span>
                  </div>
                  <span className='status-info text-xs'>
                    {safeRender(analysis.recommendedResponseType.confidence)}{' '}
                    confidence
                  </span>
                </div>
                <p className='text-gray-700 text-xs sm:text-sm leading-relaxed'>
                  {safeRender(analysis.recommendedResponseType.reasoning)}
                </p>
              </div>

              {safeRenderArray(
                analysis.recommendedResponseType.alternativeOptions
              ).length > 0 && (
                <div>
                  <p className='text-sm font-medium text-primary-900 mb-2'>
                    Alternative Approaches:
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {safeRenderArray(
                      analysis.recommendedResponseType.alternativeOptions
                    ).map((option, index) => (
                      <span key={index} className='status-info text-xs'>
                        {safeRender(option)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Risk Assessment Details */}
          {analysis.riskAssessment && (
            <div className='card'>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='icon-danger'>
                  <AlertTriangle className='h-5 w-5' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Risk Assessment
                </h3>
              </div>

              <div className='space-y-4'>
                {safeRenderArray(analysis.riskAssessment.factors).length >
                  0 && (
                  <div>
                    <h4 className='font-medium text-gray-900 mb-2'>
                      Risk Factors
                    </h4>
                    <div className='space-y-2'>
                      {safeRenderArray(analysis.riskAssessment.factors).map(
                        (factor, index) => (
                          <div
                            key={index}
                            className='flex items-start space-x-3 p-3 bg-danger-50 rounded-lg border border-danger-200'
                          >
                            <AlertTriangle className='h-4 w-4 text-danger-600 mt-0.5 flex-shrink-0' />
                            <span className='text-sm text-danger-800'>
                              {safeRender(factor)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {safeRenderArray(analysis.riskAssessment.mitigationStrategies)
                  .length > 0 && (
                  <div>
                    <h4 className='font-medium text-gray-900 mb-2'>
                      Mitigation Strategies
                    </h4>
                    <div className='space-y-2'>
                      {safeRenderArray(
                        analysis.riskAssessment.mitigationStrategies
                      ).map((strategy, index) => (
                        <div
                          key={index}
                          className='flex items-start space-x-3 p-3 bg-success-50 rounded-lg border border-success-200'
                        >
                          <CheckCircle className='h-4 w-4 text-success-600 mt-0.5 flex-shrink-0' />
                          <span className='text-sm text-success-800'>
                            {safeRender(strategy)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Strategic Advice */}
          {analysis.strategicAdvice && (
            <div className='card bg-gradient-to-r from-success-50 to-primary-50 border-success-200'>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='icon-success'>
                  <TrendingUp className='h-5 w-5' />
                </div>
                <h3 className='text-lg font-semibold text-success-900'>
                  Strategic Advice
                </h3>
              </div>
              <p className='text-success-800 leading-relaxed'>
                {safeRender(analysis.strategicAdvice)}
              </p>
            </div>
          )}

          {/* Key Information Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Deadlines */}
            {analysis.responseDeadline && (
              <div className='card'>
                <div className='flex items-center space-x-3 mb-3'>
                  <Calendar className='h-5 w-5 text-warning-600' />
                  <h4 className='font-medium text-gray-900'>
                    Response Deadline
                  </h4>
                </div>
                <p className='text-gray-700'>
                  {safeRender(analysis.responseDeadline)}
                </p>
              </div>
            )}

            {/* Financial Impact */}
            {analysis.financialImplications && (
              <div className='card'>
                <div className='flex items-center space-x-3 mb-3'>
                  <DollarSign className='h-5 w-5 text-success-600' />
                  <h4 className='font-medium text-gray-900'>
                    Financial Impact
                  </h4>
                </div>
                <p className='text-gray-700'>
                  {safeRender(analysis.financialImplications)}
                </p>
              </div>
            )}
          </div>

          {/* Action Items */}
          {safeRenderArray(analysis.actionItems).length > 0 && (
            <div className='card'>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='icon-primary'>
                  <CheckCircle className='h-5 w-5' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Action Items
                </h3>
              </div>
              <div className='space-y-3'>
                {safeRenderArray(analysis.actionItems).map((item, index) => (
                  <div
                    key={index}
                    className='flex items-start space-x-3 p-3 bg-gray-50 rounded-lg'
                  >
                    <div className='flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5'>
                      {index + 1}
                    </div>
                    <div className='flex-1'>
                      <p className='text-gray-900 text-sm'>
                        {safeRender(item)}
                      </p>
                    </div>
                    <ChevronRight className='h-4 w-4 text-gray-400 mt-0.5' />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
