import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InstantUGC - AI-Powered Video Ads Generator',
  description: 'Transform your business ideas into high-converting UGC-style video ads instantly with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
