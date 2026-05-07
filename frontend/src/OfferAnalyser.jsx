import { useState } from 'react'

function OfferAnalyser() {
  const [offerText, setOfferText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!offerText.trim()) {
      setError('Please paste your offer letter text')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer_text: offerText })
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Could not connect to server. Make sure Flask is running.')
    } finally {
      setLoading(false)
    }
  }

  const riskColors = {
    'High Risk': {
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-700',
      dot: 'bg-red-500'
    },
    'Medium Risk': {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-700',
      dot: 'bg-yellow-500'
    },
    'Standard': {
      bg: 'bg-green-50',
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-700',
      dot: 'bg-green-500'
    },
    'Uncertain': {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      badge: 'bg-gray-100 text-gray-600',
      dot: 'bg-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-800 mb-1">Offer Letter Analyser</h2>
        <p className="text-sm text-gray-500">Paste your offer letter to identify risky clauses before signing.</p>
      </div>

      {/* Offer Letter Input */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Paste Offer Letter
        </label>
        <textarea
          value={offerText}
          onChange={(e) => setOfferText(e.target.value)}
          placeholder="Paste your full offer letter text here..."
          rows={8}
          className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:border-green-400 resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-3 rounded-xl transition-colors"
      >
        {loading ? 'Analysing...' : 'Analyse Offer Letter'}
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-semibold text-gray-800">{result.total_clauses}</p>
              <p className="text-xs text-gray-500 mt-1">Total Clauses</p>
            </div>
            <div className="bg-white border border-red-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-semibold text-red-600">{result.high_risk_count}</p>
              <p className="text-xs text-gray-500 mt-1">High Risk</p>
            </div>
            <div className="bg-white border border-yellow-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-semibold text-yellow-600">{result.medium_risk_count}</p>
              <p className="text-xs text-gray-500 mt-1">Medium Risk</p>
            </div>
          </div>

          {/* Clause Breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-medium text-gray-800 mb-4">Clause Breakdown</h3>
            <div className="space-y-3">
              {result.clauses.map((clause, i) => {
                const colors = riskColors[clause.risk] || riskColors['Uncertain']
                return (
                  <div
                    key={i}
                    className={`${colors.bg} ${colors.border} border rounded-lg p-4`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colors.dot}`} />
                        <div>
                          <p className="text-sm text-gray-700">{clause.clause}</p>
                          <p className="text-xs text-gray-500 mt-1">{clause.explanation}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${colors.badge}`}>
                        {clause.risk}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 ml-5">
                      Confidence: {clause.confidence}%
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

            {result && (
        <button
          onClick={() => {
            setResult(null)
            setOfferText('')
          }}
          className="w-full border border-gray-200 text-gray-500 hover:text-gray-700 text-sm py-2 rounded-xl transition-colors"
        >
          Start over
        </button>
      )}
    </div>
  )
}

export default OfferAnalyser