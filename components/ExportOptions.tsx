'use client'

import { useState } from 'react'

interface ExportOptionsProps {
  adId: string
  videoUrl: string
}

export default function ExportOptions({ adId, videoUrl }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleDownload = async () => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a')
    link.href = videoUrl
    link.download = `instant-ugc-${adId}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportToTikTok = async () => {
    setIsExporting(true)
    try {
      // This would integrate with TikTok's API
      alert('TikTok export integration coming soon!')
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportToMeta = async () => {
    setIsExporting(true)
    try {
      // This would integrate with Meta's Ads Manager API
      alert('Meta Ads Manager export integration coming soon!')
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-white font-semibold mb-3">Export Options</h3>

      <button
        onClick={handleDownload}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <span>⬇️</span>
        Download Video
      </button>

      <button
        onClick={handleExportToTikTok}
        disabled={isExporting}
        className="w-full bg-black hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span>📱</span>
        Push to TikTok
      </button>

      <button
        onClick={handleExportToMeta}
        disabled={isExporting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span>📢</span>
        Push to Meta Ads Manager
      </button>
    </div>
  )
}
