import { useState } from 'react';
import { Settings, Eye, EyeOff, Key, Shield } from 'lucide-react';

export const Header = ({ apiKey, setApiKey }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className='bg-white/90 backdrop-blur-lg shadow-soft border-b border-gray-200/50 sticky top-0 z-50'>
      <div className='container mx-auto px-4 py-3 md:py-4 flex justify-between items-center'>
        <div className='flex items-center space-x-2 sm:space-x-4'>
          <div className='flex items-center space-x-2 sm:space-x-3'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl blur opacity-30'></div>
              <div className='relative bg-gradient-to-r from-primary-500 to-primary-600 p-1.5 sm:p-2 rounded-xl'>
                <Shield className='h-5 w-5 sm:h-6 sm:w-6 text-white' />
              </div>
            </div>
            <div>
              <h1 className='text-lg sm:text-xl md:text-2xl font-bold font-heading bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent'>
                LegalGuard AI
              </h1>
              <span className='text-xs text-gray-500 font-medium hidden sm:block'>
                Legal Document Intelligence
              </span>
            </div>
          </div>
        </div>

        <div className='flex items-center space-x-2 sm:space-x-4'>
          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className='p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105'
          >
            <Settings className='h-4 w-4 sm:h-5 sm:w-5' />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className='absolute top-full right-2 sm:right-4 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-large border border-gray-200 p-4 sm:p-6 z-50 animate-slide-up'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-base sm:text-lg font-semibold text-gray-900'>
              Settings
            </h3>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className='p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600'
            >
              ✕
            </button>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Gemini API Key
              </label>
              <div className='relative'>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder='Enter your Gemini API key'
                  className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10 sm:pr-12 transition-all duration-200 text-sm'
                />
                <button
                  type='button'
                  onClick={() => setShowApiKey(!showApiKey)}
                  className='absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showApiKey ? (
                    <EyeOff className='h-4 w-4 sm:h-5 sm:w-5' />
                  ) : (
                    <Eye className='h-4 w-4 sm:h-5 sm:w-5' />
                  )}
                </button>
              </div>
            </div>

            {/* API Key Help */}
            <div className='bg-primary-50 border border-primary-200 rounded-xl p-3 sm:p-4'>
              <div className='flex items-start space-x-2 sm:space-x-3'>
                <Key className='h-4 w-4 sm:h-5 sm:w-5 text-primary-600 mt-0.5 flex-shrink-0' />
                <div>
                  <p className='text-xs sm:text-sm font-medium text-primary-900 mb-1'>
                    How to get your API key
                  </p>
                  <ol className='text-xs text-primary-800 space-y-1'>
                    <li>1. Visit Google AI Studio</li>
                    <li>2. Sign in with your Google account</li>
                    <li>3. Create a new API key</li>
                    <li>4. Copy and paste it above</li>
                  </ol>
                  <a
                    href='https://makersuite.google.com/app/apikey'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center text-xs text-primary-600 hover:text-primary-700 font-medium mt-2'
                  >
                    Get API Key →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
