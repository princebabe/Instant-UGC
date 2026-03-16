'use client'

interface VideoPreviewProps {
  videoUrl: string
}

export default function VideoPreview({ videoUrl }: VideoPreviewProps) {
  return (
    <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden max-w-sm mx-auto">
      <video
        src={videoUrl}
        controls
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        Your browser does not support the video tag.
      </video>

      {/* Overlay indicators */}
      <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-full">
        <span className="text-white text-xs font-semibold">UGC AD</span>
      </div>

      <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full">
        <span className="text-white text-xs">9:16</span>
      </div>
    </div>
  )
}
