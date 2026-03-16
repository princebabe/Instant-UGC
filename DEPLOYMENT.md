# Deployment Guide - InstantUGC

This guide will help you deploy InstantUGC as a real working website on Vercel.

## Prerequisites

Before deploying, ensure you have:

1. ✅ GitHub account
2. ✅ Vercel account (free tier available at [vercel.com](https://vercel.com))
3. ✅ Supabase account (free tier at [supabase.com](https://supabase.com))
4. ✅ OpenAI API key (from [platform.openai.com](https://platform.openai.com))
5. ✅ ElevenLabs API key (optional, from [elevenlabs.io](https://elevenlabs.io))
6. ✅ Shotstack API key (optional, from [shotstack.io](https://shotstack.io))

## Step 1: Set Up Supabase Database

1. **Create a new Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose an organization and project name
   - Set a secure database password
   - Select a region close to your users

2. **Run the database setup:**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy the entire contents of `DATABASE_SCHEMA.md`
   - Paste and execute the SQL script
   - Verify all tables were created successfully

3. **Get your Supabase credentials:**
   - Go to Project Settings → API
   - Copy `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - Copy `anon/public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Step 2: Get API Keys

### OpenAI API Key (Required)
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy and save the key securely
4. Add credits to your account

### ElevenLabs API Key (Optional)
1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Sign up or log in
3. Go to Profile → API Key
4. Copy your API key

### Shotstack API Key (Optional)
1. Go to [shotstack.io](https://shotstack.io)
2. Sign up for an account
3. Get your API key from the dashboard

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Import your repository:**
   ```
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select this repository
   - Click "Import"
   ```

2. **Configure environment variables:**
   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL = your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
   OPENAI_API_KEY = your_openai_api_key
   ELEVENLABS_API_KEY = your_elevenlabs_api_key (optional)
   VIDEO_RENDER_API_KEY = your_shotstack_api_key (optional)
   VIDEO_RENDER_API_URL = https://api.shotstack.io/v1
   NEXT_PUBLIC_APP_URL = https://your-app-name.vercel.app
   ```

3. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `https://your-app-name.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set environment variables:**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add OPENAI_API_KEY
   vercel env add ELEVENLABS_API_KEY
   vercel env add VIDEO_RENDER_API_KEY
   vercel env add VIDEO_RENDER_API_URL
   vercel env add NEXT_PUBLIC_APP_URL
   ```

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## Step 4: Post-Deployment Configuration

### Update NEXT_PUBLIC_APP_URL

1. After deployment, update the `NEXT_PUBLIC_APP_URL` environment variable
2. Set it to your actual Vercel URL (e.g., `https://instant-ugc.vercel.app`)
3. Redeploy for changes to take effect

### Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions
5. Update `NEXT_PUBLIC_APP_URL` to match your custom domain

## Step 5: Test Your Deployment

1. **Visit your deployed site:**
   - Go to your Vercel URL
   - You should see the InstantUGC homepage

2. **Test the application:**
   - Fill in the product details form
   - Click "Generate Viral Ad"
   - Verify script generation works (requires OpenAI API key)

3. **Check the API routes:**
   - Test `/api/generate-script` endpoint
   - Verify database connectivity (if configured)

## Monitoring and Maintenance

### Vercel Analytics (Optional)

Enable Vercel Analytics for traffic insights:
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

// In the return statement, add:
<Analytics />
```

### Error Monitoring

Consider adding error monitoring:
- [Sentry](https://sentry.io) for error tracking
- Vercel's built-in logs for debugging

### Cost Management

**Important:** Monitor your API usage to avoid unexpected costs:

1. **OpenAI:**
   - Set usage limits in OpenAI dashboard
   - Monitor token consumption
   - Estimated: $0.03 per video generation

2. **ElevenLabs:**
   - Check character limits
   - Estimated: $0.10 per voiceover

3. **Shotstack:**
   - Monitor render minutes
   - Estimated: $0.50 per video

**Total estimated cost: ~$0.63 per generated video**

Consider implementing:
- Rate limiting per user
- Maximum daily generations
- Payment integration for credit purchases

## Troubleshooting

### Build Failures

If the build fails:

1. **Check build logs in Vercel:**
   - Look for specific error messages
   - Common issues: missing dependencies, environment variables

2. **Verify environment variables:**
   - All required variables are set
   - No typos in variable names
   - Values are correct

3. **Test locally:**
   ```bash
   npm run build
   ```

### API Errors

If API calls fail:

1. **Check API keys:**
   - Verify all API keys are valid
   - Check API key permissions
   - Ensure billing is active

2. **Check logs:**
   - View Vercel function logs
   - Check for specific error messages

3. **Test endpoints:**
   ```bash
   curl https://your-app.vercel.app/api/generate-script \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"productName":"Test","targetAudience":"Everyone","mainBenefit":"Great product"}'
   ```

### Database Connection Issues

If database queries fail:

1. **Verify Supabase credentials:**
   - Check URL and key are correct
   - Verify project is active

2. **Check RLS policies:**
   - Ensure Row Level Security policies allow access
   - Test queries in Supabase SQL editor

3. **Review connection logs:**
   - Check Vercel function logs
   - Look for connection errors

## Security Best Practices

1. ✅ **Never commit `.env` files** - Already in `.gitignore`
2. ✅ **Use environment variables** - Set in Vercel dashboard
3. ✅ **Enable HTTPS** - Automatic on Vercel
4. ✅ **Implement rate limiting** - Prevent API abuse
5. ✅ **Monitor API usage** - Set up alerts for unusual activity
6. ✅ **Regular security updates** - Keep dependencies updated

## Scaling Considerations

As your application grows:

1. **Upgrade Vercel plan:**
   - Pro plan for custom domains
   - Enterprise for advanced features

2. **Optimize database:**
   - Add indexes for frequently queried fields
   - Implement caching for common queries

3. **Add CDN for videos:**
   - Use Cloudflare or similar
   - Reduce bandwidth costs

4. **Implement queue system:**
   - Use background jobs for video generation
   - Reduce timeout issues

## Support

If you encounter issues:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review [Next.js deployment docs](https://nextjs.org/docs/deployment)
3. Open an issue on GitHub
4. Contact support@instantugc.com

## Quick Reference

**Required Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

**Optional Environment Variables:**
- `ELEVENLABS_API_KEY`
- `VIDEO_RENDER_API_KEY`
- `VIDEO_RENDER_API_URL`

**Useful Commands:**
```bash
# Local development
npm run dev

# Build for production
npm run build

# Test production build locally
npm run start

# Deploy to Vercel
vercel --prod

# View logs
vercel logs
```

---

**Congratulations!** Your InstantUGC application is now deployed and accessible to users worldwide! 🎉
