'use client'

import { useState } from 'react'
import LoadingState from './LoadingState'
import VideoPreview from './VideoPreview'
import ExportOptions from './ExportOptions'

interface AdFormData {
  productName: string
  targetAudience: string
  mainBenefit: string
}

interface GeneratedAd {
  id: string
  script: {
    hook: string
    body: string
    cta: string
  }
  videoUrl?: string
  status: 'generating' | 'completed' | 'failed'
}

export default function AdGenerator() {
  const [formData, setFormData] = useState<AdFormData>({
    productName: '',
    targetAudience: '',
    mainBenefit: '',
  })
  const [generatedAd, setGeneratedAd] = useState<GeneratedAd | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [credits, setCredits] = useState(10) // Mock credits

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async () => {
    if (!formData.productName || !formData.targetAudience || !formData.mainBenefit) {
      alert('Please fill in all fields')
      return
    }

    if (credits < 1) {
      alert('Insufficient credits. Please purchase more credits to generate videos.')
      return
    }

    setIsGenerating(true)
    setGeneratedAd({
      id: 'temp-id',
      script: { hook: '', body: '', cta: '' },
      status: 'generating',
    })

    try {
      // Step 1: Generate script
      const scriptResponse = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const scriptData = await scriptResponse.json()

      setGeneratedAd(prev => ({
        ...prev!,
        script: scriptData.script,
      }))

      // Step 2: Generate video
      const videoResponse = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          script: scriptData.script,
        }),
      })
      const videoData = await videoResponse.json()

      setGeneratedAd({
        id: videoData.id,
        script: scriptData.script,
        videoUrl: videoData.videoUrl,
        status: 'completed',
      })

      setCredits(prev => prev - 1)
    } catch (error) {
      console.error('Error generating ad:', error)
      setGeneratedAd(prev => prev ? { ...prev, status: 'failed' } : null)
      alert('Failed to generate ad. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Create Your Ad</h2>
            <div className="bg-purple-600 px-4 py-2 rounded-lg">
              <span className="text-white font-semibold">{credits} Credits</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="e.g., EcoBottle Pro"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Target Audience
              </label>
              <input
                type="text"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                placeholder="e.g., Eco-conscious millennials"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Main Benefit
              </label>
              <textarea
                name="mainBenefit"
                value={formData.mainBenefit}
                onChange={handleInputChange}
                placeholder="e.g., Reduce plastic waste by 90% with our reusable smart bottle"
                rows={4}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isGenerating ? 'Generating...' : '✨ Generate Viral Ad'}
            </button>
          </div>

          {generatedAd && (
            <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
              <h3 className="text-white font-semibold mb-3">Generated Script</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-purple-400 font-medium">Hook:</span>
                  <p className="text-gray-300 mt-1">{generatedAd.script.hook || 'Generating...'}</p>
                </div>
                <div>
                  <span className="text-purple-400 font-medium">Body:</span>
                  <p className="text-gray-300 mt-1">{generatedAd.script.body || 'Generating...'}</p>
                </div>
                <div>
                  <span className="text-purple-400 font-medium">CTA:</span>
                  <p className="text-gray-300 mt-1">{generatedAd.script.cta || 'Generating...'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Preview</h2>

          {!generatedAd && (
            <div className="flex items-center justify-center h-96 bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-600">
              <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-gray-400">Your video will appear here</p>
              </div>
            </div>
          )}

          {isGenerating && <LoadingState />}

          {generatedAd && generatedAd.status === 'completed' && generatedAd.videoUrl && (
            <>
              <VideoPreview videoUrl={generatedAd.videoUrl} />
              <ExportOptions adId={generatedAd.id} videoUrl={generatedAd.videoUrl} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
