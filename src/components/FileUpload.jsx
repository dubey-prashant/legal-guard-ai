import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, Loader2, CheckCircle, File, RefreshCw, Sparkles } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

export const FileUpload = ({ onFileUpload, uploadedFile, onReset }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [processingStep, setProcessingStep] = useState('')

  const extractTextFromPDF = async (file) => {
    try {
      setProcessingStep('Reading PDF file...')
      const arrayBuffer = await file.arrayBuffer()
      
      setProcessingStep('Loading PDF document...')
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      let fullText = ''
      const totalPages = pdf.numPages
      
      for (let i = 1; i <= totalPages; i++) {
        setProcessingStep(`Extracting text from page ${i} of ${totalPages}...`)
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()
        
        if (pageText) {
          fullText += pageText + '\n\n'
        }
      }
      
      if (!fullText.trim()) {
        throw new Error('No text found in PDF. The PDF might be image-based or encrypted.')
      }
      
      return fullText.trim()
    } catch (err) {
      console.error('PDF extraction error:', err)
      if (err.message?.includes('Invalid PDF')) {
        throw new Error('Invalid PDF file. Please ensure the file is not corrupted.')
      } else if (err.message?.includes('password')) {
        throw new Error('Password-protected PDFs are not supported. Please upload an unprotected PDF.')
      } else {
        throw new Error(err.message || 'Failed to extract text from PDF. Please try a different file.')
      }
    }
  }

  const readTextFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => reject(new Error('Failed to read text file'))
      reader.readAsText(file)
    })
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setIsLoading(true)
    setError('')
    setProcessingStep('Processing file...')

    try {
      let extractedText = ''

      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file)
      } else if (file.type === 'text/plain') {
        setProcessingStep('Reading text file...')
        extractedText = await readTextFile(file)
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or text file.')
      }

      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error('The document appears to be too short or empty. Please ensure it contains meaningful text content.')
      }

      setProcessingStep('File processed successfully!')
      onFileUpload(file, extractedText)
    } catch (err) {
      console.error('File processing error:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
      setProcessingStep('')
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: isLoading
  })

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-danger-600" />
    }
    return <File className="h-8 w-8 text-primary-600" />
  }

  // If no file uploaded, show upload interface
  if (!uploadedFile) {
    return (
      <div className="card-elevated">
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
            ${isDragActive 
              ? 'border-primary-400 bg-primary-50 scale-105' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }
            ${isLoading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {/* Upload Icon */}
          <div className="mb-6">
            {isLoading ? (
              <div className="icon-primary mx-auto animate-pulse">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="icon-primary mx-auto">
                <Upload className="h-8 w-8" />
              </div>
            )}
          </div>

          {/* Upload Text */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {isLoading ? 'Processing Document' : 'Upload Legal Document'}
            </h3>
            
            {isLoading ? (
              <div className="space-y-2">
                <p className="text-sm text-primary-600 font-medium">{processingStep}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mx-auto max-w-xs">
                  <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-600">
                  {isDragActive
                    ? 'Drop your document here...'
                    : 'Drag and drop your document here, or click to browse'
                  }
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF and TXT files up to 10MB
                </p>
              </>
            )}
          </div>

          {/* Supported Formats */}
          {!isLoading && (
            <div className="flex justify-center space-x-4 mt-6">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <FileText className="h-4 w-4 text-danger-600" />
                <span>PDF</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <File className="h-4 w-4 text-primary-600" />
                <span>TXT</span>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-danger-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-danger-900">Upload Failed</p>
                <p className="text-sm text-danger-800 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pro Tips */}
        <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <Sparkles className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-primary-900 mb-2">Pro Tips for Best Results</p>
              <ul className="text-xs text-primary-800 space-y-1">
                <li>• Upload text-searchable PDFs for accurate analysis</li>
                <li>• Ensure document contains at least 50 characters</li>
                <li>• Remove passwords from PDFs before uploading</li>
                <li>• Supported formats: PDF, TXT files</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If file uploaded, show file info
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Uploaded Document</h2>
        <CheckCircle className="h-5 w-5 text-success-600" />
      </div>

      <div className="space-y-4">
        {/* File Info */}
        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex-shrink-0">
            {getFileIcon(uploadedFile)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {uploadedFile.name}
            </p>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-xs text-gray-500">
                {formatFileSize(uploadedFile.size)}
              </p>
              <p className="text-xs text-gray-500">
                {uploadedFile.type === 'application/pdf' ? 'PDF Document' : 'Text File'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-success-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Document processed successfully</span>
          </div>
          
          <button
            onClick={onReset}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Upload New</span>
          </button>
        </div>
      </div>
    </div>
  )
}
