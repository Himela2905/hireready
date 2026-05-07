import { useState } from 'react'

function ResumeScreener() {
  const [file, setFile] = useState(null)
  const [jdText, setJdText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected && selected.type === 'application/pdf') {
      setFile(selected)
      setError('')
    } else {
      setError('Please upload a PDF file')
    }
  }

  const handleAnalyze = async () => {
    if (!file) { setError('Please upload your resume PDF'); return }
    if (!jdText.trim()) { setError('Please paste a job description'); return }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('jd_text', jdText)

      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        body: formData
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

  const scoreColor = (score) => {
    if (score >= 60) return 'text-green-600'
    if (score >= 40) return 'text-yellow-600'
    if (score >= 20) return 'text-orange-500'
    return 'text-red-500'
  }

  const scoreBarColor = (score) => {
    if (score >= 60) return 'bg-green-500'
    if (score >= 40) return 'bg-yellow-500'
    if (score >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-800 mb-1">Resume Screener</h2>
        <p className="text-sm text-gray-500">Upload your resume and paste a job description to see how well you match.</p>
      </div>

      {/* Upload Resume */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Upload Resume (PDF)
        </label>
        <div
          className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-green-400 transition-colors"
          onClick={() => document.getElementById('fileInput').click()}
        >
          {file ? (
            <div>
              <p className="text-green-600 font-medium">{file.name}</p>
              <p className="text-xs text-gray-400 mt-1">Click to change</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 text-sm">Click to upload your resume PDF</p>
              <p className="text-xs text-gray-300 mt-1">PDF files only</p>
            </div>
          )}
        </div>
        <input
          id="fileInput"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Job Description */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Paste Job Description
        </label>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={6}
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
        {loading ? 'Analysing...' : 'Analyse Resume'}
      </button>

      {/* Results */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <h3 className="font-medium text-gray-800">Analysis Results</h3>

          {/* Score */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm text-gray-500">Match Score</span>
              <span className={`text-3xl font-semibold ${scoreColor(result.score)}`}>
                {result.score}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${scoreBarColor(result.score)}`}
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          {/* Level and Advice */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-gray-800">{result.level}</p>
            <p className="text-sm text-gray-500 mt-1">{result.advice}</p>
          </div>

          {/* Missing Skills */}
          {result.missing_skills && result.missing_skills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Keywords to add to your resume
              </p>
              <div className="flex flex-wrap gap-2">
                {result.missing_skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-red-50 text-red-600 text-xs font-medium px-3 py-1 rounded-full border border-red-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

            {result && (
        <button
          onClick={() => {
            setResult(null)
            setFile(null)
            setJdText('')
          }}
          className="w-full border border-gray-200 text-gray-500 hover:text-gray-700 text-sm py-2 rounded-xl transition-colors"
        >
          Start over
        </button>
      )}
    </div>
  )
}

export default ResumeScreener