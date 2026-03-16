export interface User {
  id: string
  email: string
  fullName: string
  credits: number
  subscriptionTier: 'free' | 'pro' | 'enterprise'
  subscriptionStatus: 'active' | 'inactive' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface Ad {
  id: string
  userId: string
  productName: string
  targetAudience: string
  mainBenefit: string
  script: {
    hook: string
    body: string
    cta: string
  }
  avatarType: 'ai_avatar' | 'stock_footage'
  avatarId: string
  voiceoverUrl?: string
  videoUrl?: string
  thumbnailUrl?: string
  durationSeconds?: number
  videoFormat: string
  resolution: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  generationId?: string
  creditsUsed: number
  createdAt: string
  completedAt?: string
}

export interface Generation {
  id: string
  adId: string
  userId: string
  scriptGenerated: boolean
  voiceoverGenerated: boolean
  videoRendered: boolean
  errorMessage?: string
  retryCount: number
  openaiRequestId?: string
  elevenlabsRequestId?: string
  videoRenderJobId?: string
  startedAt: string
  scriptCompletedAt?: string
  voiceoverCompletedAt?: string
  videoCompletedAt?: string
  failedAt?: string
}

export interface CreditTransaction {
  id: string
  userId: string
  type: 'purchase' | 'usage' | 'refund' | 'bonus'
  amount: number
  balanceAfter: number
  adId?: string
  paymentIntentId?: string
  paymentAmountCents?: number
  description: string
  createdAt: string
}

export interface ExportHistory {
  id: string
  adId: string
  userId: string
  platform: 'tiktok' | 'meta' | 'download'
  exportStatus: 'pending' | 'success' | 'failed'
  platformAdId?: string
  platformResponse?: any
  createdAt: string
  completedAt?: string
}
