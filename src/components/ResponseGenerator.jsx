import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Download, 
  Copy, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb, 
  FileText,
  Zap,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react'
import { generateResponse, getResponseTypeInfo, getEffectiveApiKey } from '../services/geminiService'

export const ResponseGenerator = ({ analysis, apiKey, originalText }) => {
  const [generatedResponse, setGeneratedResponse] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [responseType, setResponseType] = useState('')

  // Set recommended response type as default when analysis changes
  useEffect(() => {
    if (analysis?.recommendedResponseType?.type) {
      setResponseType(analysis.recommendedResponseType.type)
    }
  }, [analysis])

  const responseTypes = getResponseTypeInfo()

  const handleGenerateResponse = async () => {
    const effectiveApiKey = getEffectiveApiKey(apiKey)
    
    if (!effectiveApiKey) {
      setError('No API key available. Please enter your Gemini API key in the settings or configure a default API key.')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await generateResponse(analysis, originalText, responseType, apiKey)
      setGeneratedResponse(response)
    } catch (err) {
      setError(`Failed to generate response: ${err.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedResponse)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([generatedResponse], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `legal_response_${responseType}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const isRecommended = (type) => {
    return analysis?.recommendedResponseType?.type === type
  }

  const hasApiKey = getEffectiveApiKey(apiKey)

  return (
    <div className="space-y-6">
      {/* Response Generator Header */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="icon-primary">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Response Generator</h2>
            <p className="text-sm text-gray-500">AI-powered legal response drafting</p>
          </div>
        </div>

        {/* AI Recommendation Banner */}
        {analysis?.recommendedResponseType && (
          <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-primary-900 mb-1">AI Recommendation</p>
                <p className="text-sm text-primary-800">
                  <span className="font-medium capitalize">{analysis.recommendedResponseType.type}</span> response 
                  is recommended based on our analysis. You can customize the approach below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Response Type Selection */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Select Response Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(responseTypes).map(([type, info]) => (
              <div
                key={type}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  responseType === type
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                } ${isRecommended(type) ? 'ring-2 ring-warning-200' : ''}`}
                onClick={() => setResponseType(type)}
              >
                {isRecommended(type) && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-warning-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Recommended</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                    responseType === type 
                      ? 'border-primary-500 bg-primary-500' 
                      : 'border-gray-300'
                  }`}>
                    {responseType === type && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 capitalize">{type.replace('_', ' ')}</h4>
                    <p className="text-sm text-gray-600 mt-1">{info.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        info.riskLevel === 'low' ? 'bg-success-100 text-success-800' :
                        info.riskLevel === 'medium' ? 'bg-warning-100 text-warning-800' :
                        'bg-danger-100 text-danger-800'
                      }`}>
                        {info.riskLevel} risk
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {info.timeline}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleGenerateResponse}
            disabled={isGenerating || !hasApiKey || !responseType}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Generating Response...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Generate Professional Response</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Response */}
      {(generatedResponse || isGenerating) && (
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="icon-success">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Generated Response</h3>
            </div>
            
            {generatedResponse && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="btn-secondary flex items-center space-x-2"
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-success-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleDownload}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                
                <button
                  onClick={handleGenerateResponse}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Regenerate</span>
                </button>
              </div>
            )}
          </div>

          {isGenerating ? (
            <div className="text-center py-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-success-500 to-primary-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-success-500 to-primary-600 rounded-full p-4 inline-block">
                  <MessageSquare className="h-8 w-8 text-white animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Crafting Your Response</h3>
              <p className="text-gray-600 mb-4">AI is generating a professional, legally sound response...</p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success-600 rounded-full animate-bounce"></div>
                  <span>Legal Accuracy</span>
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <span>Professional Tone</span>
                </span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <span>Strategic Positioning</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Response Metadata */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="status-info text-xs">
                  Response Type: {responseType?.replace('_', ' ')?.charAt(0).toUpperCase() + responseType?.replace('_', ' ')?.slice(1)}
                </span>
                <span className="status-info text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Generated: {new Date().toLocaleDateString()}
                </span>
                <span className="status-info text-xs">
                  Words: {generatedResponse.split(' ').length}
                </span>
              </div>

              {/* Response Text */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 leading-relaxed font-sans">
                  {generatedResponse}
                </pre>
              </div>

              {/* Response Tips */}
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-primary-900 mb-1">Review Guidelines</p>
                    <ul className="text-xs text-primary-800 space-y-1">
                      <li>• Review all dates, names, and legal references for accuracy</li>
                      <li>• Customize the response to match your organization&apos;s tone</li>
                      <li>• Consider having a legal professional review before sending</li>
                      <li>• Keep copies of all correspondence for your records</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="card">
          <div className="p-4 bg-danger-50 border border-danger-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-danger-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-danger-900">Generation Failed</p>
                <p className="text-sm text-danger-800 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
