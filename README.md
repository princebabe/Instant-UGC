[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fprincebabe%2FInstant-UGC&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,OPENAI_API_KEY,NEXT_PUBLIC_APP_URL&envDescription=API%20keys%20needed%20for%20InstantUGC&envLink=https%3A%2F%2Fgithub.com%2Fprincebabe%2FInstant-UGC%2Fblob%2Fmain%2FDEPLOYMENT.md&project-name=instant-ugc&repository-name=instant-ugc)

# InstantUGC - AI-Powered Video Ads Generator

Transform your business ideas into high-converting UGC-style video ads instantly with AI.

## 🚀 Quick Deploy

Click the button above to deploy to Vercel in one click!

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Overview

InstantUGC is an AI-driven SaaS platform that converts simple product ideas or URLs into professional, TikTok/Reels-style video advertisements. The platform leverages cutting-edge AI technologies including GPT-4 for scripting, ElevenLabs for voiceovers, and Shotstack/HeyGen for video rendering.

## Features

- **🎯 Simple Input Interface**: Enter product name, target audience, and main benefit
- **🤖 AI-Powered Script Generation**: GPT-4 creates Hook-Body-CTA structure optimized for conversions
- **🎬 Automated Video Creation**: AI avatars or stock footage with professional editing
- **🎙️ Realistic Voiceovers**: ElevenLabs generates natural-sounding creator voices
- **📱 Real-time Preview**: Watch your video as it's being created
- **💾 Export Options**: Download or push directly to TikTok/Meta Ads Manager
- **💳 Credit System**: Pay-per-generation model to manage API costs
- **⚡ Loading States**: Engaging animations keep users informed during generation

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Dark mode optimized)
- **UI Components**: Custom React components

### Backend
- **Runtime**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (ready to integrate)

### AI Services
- **Script Generation**: OpenAI GPT-4
- **Voiceover**: ElevenLabs API
- **Video Rendering**: Shotstack/HeyGen/Gan.ai (configurable)

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/princebabe/Instant-UGC.git
cd Instant-UGC
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# ElevenLabs (optional)
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Video Rendering (optional)
VIDEO_RENDER_API_KEY=your_video_render_api_key
VIDEO_RENDER_API_URL=https://api.shotstack.io/v1

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the database:

Run the SQL scripts in `DATABASE_SCHEMA.md` in your Supabase SQL editor to create all necessary tables.

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.

**Quick Deploy Options:**
- ✅ [Vercel](https://vercel.com) - Recommended (click button above)
- ✅ [Netlify](https://netlify.com)
- ✅ [AWS Amplify](https://aws.amazon.com/amplify/)
- ✅ [Railway](https://railway.app)

## Project Structure

```
instant-ugc/
├── app/
│   ├── api/                    # API routes
│   │   ├── generate-script/   # GPT-4 script generation
│   │   ├── generate-video/    # Video rendering orchestration
│   │   ├── credits/           # Credit management
│   │   ├── ads/               # Ad history
│   │   └── health/            # Health check endpoint
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── AdGenerator.tsx        # Main idea-to-ad component
│   ├── LoadingState.tsx       # Engaging loading animations
│   ├── VideoPreview.tsx       # Video player component
│   └── ExportOptions.tsx      # Download/export controls
├── lib/
│   ├── supabase.ts           # Supabase client
│   └── utils.ts              # Utility functions
├── types/
│   └── index.ts              # TypeScript type definitions
├── ARCHITECTURE.md            # System architecture documentation
├── DATABASE_SCHEMA.md         # Database schema and setup
├── DEPLOYMENT.md              # Deployment guide
├── IMPLEMENTATION.md          # Implementation summary
└── README.md                  # This file
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system architecture documentation.

## Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for complete database schema and setup instructions.

## Key Components

### AdGenerator Component
The main "Idea-to-Ad" interface where users input product details and generate videos.

**Location**: `/components/AdGenerator.tsx`

**Features**:
- Form validation
- Credit balance display
- Async video generation with progress tracking
- Script preview

### Magic Engine Logic Flow

1. **User Input** → Capture product details
2. **Script Generation** → Call `/api/generate-script` with GPT-4
3. **Asset Selection** → Choose avatar based on target audience
4. **Voiceover Creation** → Generate audio with ElevenLabs
5. **Video Assembly** → Stitch video with Shotstack API
6. **Preview & Export** → Display and allow download/publish

### LoadingState Component
Engaging loading experience with rotating messages and progress bar.

**Location**: `/components/LoadingState.tsx`

**Messages**:
- "Building your viral ad..."
- "Crafting the perfect hook..."
- "Selecting the best avatar..."
- "Generating AI voiceover..."
- "Stitching video elements..."
- "Adding captions and effects..."

### VideoPreview Component
Real-time video player with 9:16 aspect ratio for TikTok/Reels.

**Location**: `/components/VideoPreview.tsx`

## API Routes

### POST /api/generate-script
Generates UGC-style script using GPT-4.

**Request**:
```json
{
  "productName": "EcoBottle Pro",
  "targetAudience": "Eco-conscious millennials",
  "mainBenefit": "Reduce plastic waste by 90%"
}
```

**Response**:
```json
{
  "script": {
    "hook": "Stop! Are you still buying plastic bottles?",
    "body": "I switched to EcoBottle Pro 3 months ago...",
    "cta": "Get yours at ecobottle.com - 20% off today!"
  },
  "requestId": "req_abc123"
}
```

### GET /api/health
Health check endpoint for monitoring.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-16T22:00:00.000Z",
  "version": "0.1.0",
  "environment": "production",
  "services": {
    "supabase": true,
    "openai": true,
    "elevenlabs": true,
    "videoRender": true
  }
}
```

### Other Endpoints
- `POST /api/generate-video` - Orchestrates video generation
- `GET/POST /api/credits` - Manage user credits
- `GET/POST /api/ads` - Retrieve and create ad history

## Credit System

InstantUGC uses a credit-based pricing model to manage API costs:

- **1 Credit** = 1 Generated Video
- Free tier: 10 credits
- Pro tier: 100 credits/month
- Enterprise: Unlimited

Each video generation consumes:
- OpenAI GPT-4 API call (~$0.03)
- ElevenLabs voiceover (~$0.10)
- Shotstack video render (~$0.50)
- **Total**: ~$0.63 per video

## Performance Optimization

- **Async Processing**: Video generation happens in background
- **Webhook Notifications**: Services notify when jobs complete
- **CDN Integration**: Videos stored on CDN for fast delivery
- **Edge Functions**: API routes can run on edge network
- **Database Indexing**: Optimized queries with proper indexes

## Security

- ✅ API keys in environment variables
- ✅ Row-level security in Supabase
- ✅ Rate limiting on API routes
- ✅ Input validation and sanitization
- ✅ Secure video URLs with expiration
- ✅ Next.js 15.0.8 - Patched security vulnerabilities

## Monitoring

### Health Check
Monitor your deployment at: `https://your-app.vercel.app/api/health`

### Vercel Analytics
Built-in analytics available in Vercel dashboard.

### Error Tracking
Consider integrating:
- Sentry for error monitoring
- LogRocket for session replay
- Vercel Logs for debugging

## Future Enhancements

- [ ] Real TikTok API integration for direct publishing
- [ ] Meta Ads Manager API integration
- [ ] A/B testing for multiple script variations
- [ ] Custom avatar upload
- [ ] Background music library
- [ ] Video editing timeline
- [ ] Analytics dashboard
- [ ] Team collaboration features
- [ ] White-label options

## Cost Management

The platform includes several features to manage API costs:

1. **Credit System**: Users pay per generation
2. **Rate Limiting**: Prevent abuse
3. **Caching**: Cache common scripts and assets
4. **Queue Management**: Process jobs efficiently
5. **Webhook Optimization**: Avoid polling for job status

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support:
- 📧 Email: support@instantugc.com
- 🐛 Issues: [GitHub Issues](https://github.com/princebabe/Instant-UGC/issues)
- 📚 Docs: Check [DEPLOYMENT.md](./DEPLOYMENT.md) and [ARCHITECTURE.md](./ARCHITECTURE.md)

## Acknowledgments

- OpenAI for GPT-4 API
- ElevenLabs for voice synthesis
- Shotstack for video rendering
- Supabase for database and auth
- Vercel for hosting platform

---

Built with ❤️ using Next.js, TypeScript, and AI

**Ready to deploy?** Click the "Deploy with Vercel" button at the top! 🚀
