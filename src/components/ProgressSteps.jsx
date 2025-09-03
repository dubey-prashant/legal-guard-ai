import { CheckCircle, FileText, Shield, MessageSquare } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';

export const ProgressSteps = () => {
  const { currentStep } = useAppContext();

  return (
    <div className='flex justify-center mb-8 sm:mb-12 px-4'>
      <div className='flex items-center space-x-2 sm:space-x-4 overflow-x-auto max-w-full'>
        {/* Step 1: Upload */}
        <div
          className={`progress-step ${
            currentStep >= 1 ? 'completed' : 'inactive'
          } flex-shrink-0`}
        >
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentStep >= 1
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {currentStep > 1 ? (
              <CheckCircle className='h-4 w-4 sm:h-5 sm:w-5' />
            ) : (
              <FileText className='h-4 w-4 sm:h-5 sm:w-5' />
            )}
          </div>
          <span className='font-medium text-xs sm:text-sm whitespace-nowrap'>
            Upload Document
          </span>
        </div>

        <div
          className={`progress-line ${
            currentStep >= 2 ? 'completed' : 'inactive'
          } flex-shrink-0`}
        ></div>

        {/* Step 2: Analyze */}
        <div
          className={`progress-step ${
            currentStep >= 2
              ? currentStep === 2
                ? 'active'
                : 'completed'
              : 'inactive'
          } flex-shrink-0`}
        >
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentStep >= 3
                ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg'
                : currentStep === 2
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg pulse'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {currentStep > 2 ? (
              <CheckCircle className='h-4 w-4 sm:h-5 sm:w-5' />
            ) : (
              <Shield className='h-4 w-4 sm:h-5 sm:w-5' />
            )}
          </div>
          <span className='font-medium text-xs sm:text-sm whitespace-nowrap'>
            AI Analysis
          </span>
        </div>

        <div
          className={`progress-line ${
            currentStep >= 3 ? 'completed' : 'inactive'
          } flex-shrink-0`}
        ></div>

        {/* Step 3: Response */}
        <div
          className={`progress-step ${
            currentStep >= 3 ? 'active' : 'inactive'
          } flex-shrink-0`}
        >
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentStep >= 3
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <MessageSquare className='h-4 w-4 sm:h-5 sm:w-5' />
          </div>
          <span className='font-medium text-xs sm:text-sm whitespace-nowrap'>
            Generate Response
          </span>
        </div>
      </div>
    </div>
  );
};
