import {
  Shield,
  FileText,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Clock,
  Users,
} from 'lucide-react';
import { Header } from './Header';
import { FileUpload } from './FileUpload';
import { ProgressSteps } from './ProgressSteps';
import { useAppContext } from '../hooks/useAppContext';

export const HeroLanding = () => {
  const { apiKey, setApiKey, handleFileUpload, uploadedFile, resetApp } =
    useAppContext();

  return (
    <div className='min-h-screen gradient-bg'>
      <Header apiKey={apiKey} setApiKey={setApiKey} />

      <main className='flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-4 sm:py-8'>
        <div className='w-full max-w-6xl'>
          {/* Hero Section */}
          <div className='text-center mb-8 sm:mb-12 md:mb-16 px-2 sm:px-4'>
            <div className='flex justify-center mb-6 sm:mb-8'>
              <div className='relative'>
                <div className='absolute inset-0 animated-gradient rounded-full blur-3xl opacity-30'></div>
                <div className='relative bg-white rounded-full p-4 sm:p-6 shadow-large'>
                  <Shield className='h-12 w-12 sm:h-16 sm:w-16 text-primary-600' />
                </div>
              </div>
            </div>

            <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl pb-4 font-bold font-heading mb-4 sm:mb-6 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 bg-clip-text text-transparent px-2 sm:px-4'>
              LegalGuard AI
            </h1>

            <p className='text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2'>
              Transform legal document analysis with AI-powered insights. Get
              instant risk assessments, compliance guidance, and professional
              responses.
            </p>

            <div className='flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-2'>
              <span className='status-badge bg-primary-100 text-primary-800 border border-primary-200 text-xs sm:text-sm'>
                <Sparkles className='h-3 w-3 mr-1' />
                AI-Powered Analysis
              </span>
              <span className='status-badge bg-success-100 text-success-800 border border-success-200 text-xs sm:text-sm'>
                <CheckCircle className='h-3 w-3 mr-1' />
                Instant Results
              </span>
              <span className='status-badge bg-warning-100 text-warning-800 border border-warning-200 text-xs sm:text-sm'>
                <Shield className='h-3 w-3 mr-1' />
                Risk Assessment
              </span>
            </div>
          </div>

          {/* Progress Steps */}
          <ProgressSteps />

          {/* Upload Section */}
          <div className='max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 px-2'>
            <FileUpload
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedFile}
              onReset={resetApp}
            />
          </div>

          {/* Features Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto px-2'>
            <div className='glass-card text-center group hover:scale-105 transition-all duration-300'>
              <div className='icon-primary mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300'>
                <FileText className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2 text-sm sm:text-base'>
                Smart Document Processing
              </h3>
              <p className='text-xs sm:text-sm text-gray-600'>
                Advanced PDF text extraction with support for complex legal
                documents
              </p>
            </div>

            <div className='glass-card text-center group hover:scale-105 transition-all duration-300'>
              <div className='icon-success mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300'>
                <TrendingUp className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2 text-sm sm:text-base'>
                Risk Analysis
              </h3>
              <p className='text-xs sm:text-sm text-gray-600'>
                Comprehensive risk assessment with severity scoring and
                recommendations
              </p>
            </div>

            <div className='glass-card text-center group hover:scale-105 transition-all duration-300'>
              <div className='icon-warning mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300'>
                <Clock className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2 text-sm sm:text-base'>
                Deadline Tracking
              </h3>
              <p className='text-xs sm:text-sm text-gray-600'>
                Automatic deadline extraction with urgency alerts and compliance
                timelines
              </p>
            </div>

            <div className='glass-card text-center group hover:scale-105 transition-all duration-300'>
              <div className='icon-primary mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300'>
                <Users className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2 text-sm sm:text-base'>
                Professional Responses
              </h3>
              <p className='text-xs sm:text-sm text-gray-600'>
                Generate legally sound responses tailored to your specific
                situation
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
