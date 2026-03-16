# InstantUGC System Architecture

## Overview
InstantUGC is an AI-driven SaaS platform that transforms business ideas or product URLs into high-converting UGC-style video ads optimized for TikTok/Reels.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js Frontend (React + Tailwind CSS)              │ │
│  │  - Onboarding Dashboard                               │ │
│  │  - Video Preview Component                            │ │
│  │  - Export Options UI                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER (Next.js)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Routes (/pages/api or /app/api)                 │ │
│  │  - /api/generate-script    (GPT-4 Integration)       │ │
│  │  - /api/generate-video     (Video Rendering)         │ │
│  │  - /api/generate-voiceover (ElevenLabs)              │ │
│  │  - /api/users              (User Management)         │ │
│  │  - /api/credits            (Credit System)           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                      │
│  ┌─────────────────┐  ┌──────────────────────────────────┐ │
│  │  Magic Engine   │  │  Video Processing Pipeline       │ │
│  │  - Script Gen   │  │  1. Script Generation (GPT-4)   │ │
│  │  - Avatar Select│  │  2. Avatar/Footage Selection     │ │
│  │  - Text Overlay │  │  3. Voiceover Generation (EL)    │ │
│  │  - CTA Builder  │  │  4. Video Stitching (Shotstack)  │ │
│  └─────────────────┘  │  5. Caption Overlay              │ │
│                       └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Supabase (PostgreSQL)                                │ │
│  │  - users table                                        │ │
│  │  - ads table                                          │ │
│  │  - credits table                                      │ │
│  │  - generations table                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  OpenAI      │  │ ElevenLabs   │  │  Shotstack/     │  │
│  │  GPT-4       │  │  Voice API   │  │  HeyGen/Gan.ai  │  │
│  │  (Scripting) │  │  (Audio)     │  │  (Video Render) │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow: Idea to Video

1. **User Input** → Frontend captures: Product Name, Target Audience, Main Benefit
2. **Script Generation** → API calls OpenAI GPT-4 to create Hook, Body, CTA
3. **Asset Selection** → System selects AI avatar or stock footage based on target audience
4. **Voiceover Creation** → ElevenLabs API generates realistic creator voice
5. **Video Assembly** → Shotstack API stitches video with captions and overlays
6. **Preview & Export** → User previews in browser, downloads or pushes to ad platforms

## Key Components

### Frontend Components
- `AdGenerator.tsx` - Main "Idea-to-Ad" interface
- `VideoPreview.tsx` - Real-time video player
- `Dashboard.tsx` - User onboarding and history
- `ExportOptions.tsx` - Download/publish controls
- `LoadingState.tsx` - Engaging loading animations

### Backend Services
- `scriptService.ts` - OpenAI GPT-4 integration
- `videoService.ts` - Video rendering orchestration
- `voiceService.ts` - ElevenLabs integration
- `creditService.ts` - Credit management system
- `exportService.ts` - Export to ad platforms

### Database Models
- User (auth, credits, subscription)
- Ad (generated video metadata)
- Generation (processing state tracking)
- Credit Transaction (billing audit trail)

## Scalability Considerations

1. **Async Processing** - Video generation is queued and processed asynchronously
2. **Webhook Notifications** - Video services notify completion via webhooks
3. **CDN Integration** - Generated videos stored on CDN for fast delivery
4. **Rate Limiting** - API rate limiting to prevent abuse
5. **Credit System** - Pay-per-generation model to manage API costs
6. **Caching** - Redis for caching common scripts and assets

## Security

- API keys stored in environment variables
- Row-level security in Supabase
- Rate limiting on API routes
- Input validation and sanitization
- Secure video URL signing with expiration
