'use client'

import { useState, useEffect } from 'react'

const loadingMessages = [
  'Building your viral ad...',
  'Crafting the perfect hook...',
  'Selecting the best avatar...',
  'Generating AI voiceover...',
  'Stitching video elements...',
  'Adding captions and effects...',
  'Almost done...',
]

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 3000)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return prev + Math.random() * 5
      })
    }, 500)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-96 bg-gray-700/30 rounded-lg border border-gray-600">
      <div className="relative w-32 h-32 mb-6">
        {/* Spinning loader */}
        <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-4 bg-purple-500/20 rounded-full animate-pulse flex items-center justify-center">
          <span className="text-3xl">✨</span>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">
        {loadingMessages[messageIndex]}
      </h3>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-600 rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="text-gray-400 text-sm mt-2">{Math.round(progress)}%</p>

      <p className="text-gray-500 text-sm mt-6 max-w-xs text-center">
        This may take 30-60 seconds as we generate your high-quality video
      </p>
    </div>
  )
}
