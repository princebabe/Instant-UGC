import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check application health
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        openai: !!process.env.OPENAI_API_KEY,
        elevenlabs: !!process.env.ELEVENLABS_API_KEY,
        videoRender: !!process.env.VIDEO_RENDER_API_KEY,
      },
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
