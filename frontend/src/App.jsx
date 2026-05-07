import { useState } from 'react'
import ResumeScreener from './ResumeScreener'
import OfferAnalyser from './OfferAnalyser'

function App() {
  const [activeTab, setActiveTab] = useState('resume')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">HireReady</h1>
        <p className="text-sm text-gray-500">Your end-to-end hiring toolkit</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('resume')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'resume'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Resume Screener
          </button>
          <button
            onClick={() => setActiveTab('offer')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'offer'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Offer Analyser
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {activeTab === 'resume' ? (
          <ResumeScreener />
        ) : (
          <OfferAnalyser />
        )}
      </div>
    </div>
  )
}

export default App