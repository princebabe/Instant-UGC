import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { productName, targetAudience, mainBenefit } = await request.json()

    if (!productName || !targetAudience || !mainBenefit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const openai = getOpenAIClient()

    // Generate UGC-style script using GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert UGC video ad scriptwriter. Create high-converting TikTok/Reels style scripts that follow the Hook-Body-CTA structure. Keep it conversational, authentic, and engaging. The script should feel like a real person talking, not a corporate ad.`,
        },
        {
          role: 'user',
          content: `Create a UGC video ad script for:
Product: ${productName}
Target Audience: ${targetAudience}
Main Benefit: ${mainBenefit}

Generate a script with three parts:
1. HOOK (3-5 seconds): An attention-grabbing opening that stops the scroll
2. BODY (15-20 seconds): Explain the benefit in a relatable, authentic way
3. CTA (3-5 seconds): Clear call-to-action

Keep the total script under 30 seconds when spoken. Use casual language, contractions, and make it feel personal.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    })

    const scriptText = completion.choices[0].message.content || ''

    // Parse the script into sections
    const hookMatch = scriptText.match(/HOOK[:\s]+(.*?)(?=BODY|$)/is)
    const bodyMatch = scriptText.match(/BODY[:\s]+(.*?)(?=CTA|$)/is)
    const ctaMatch = scriptText.match(/CTA[:\s]+(.*?)$/is)

    const script = {
      hook: hookMatch ? hookMatch[1].trim() : '',
      body: bodyMatch ? bodyMatch[1].trim() : '',
      cta: ctaMatch ? ctaMatch[1].trim() : '',
    }

    // If parsing failed, try to split the script into roughly equal parts
    if (!script.hook || !script.body || !script.cta) {
      const sentences = scriptText.split(/[.!?]+/).filter(s => s.trim())
      const third = Math.floor(sentences.length / 3)
      script.hook = sentences.slice(0, third).join('. ') + '.'
      script.body = sentences.slice(third, third * 2).join('. ') + '.'
      script.cta = sentences.slice(third * 2).join('. ') + '.'
    }

    return NextResponse.json({
      script,
      requestId: completion.id,
    })
  } catch (error: any) {
    console.error('Script generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate script' },
      { status: 500 }
    )
  }
}
