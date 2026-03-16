import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      // Return mock data if Supabase is not configured
      return NextResponse.json({
        credits: 10,
        tier: 'free',
      })
    }

    // In production, get user from session
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('users')
      .select('credits, subscription_tier')
      .eq('id', userId)
      .single()

    if (error) throw error

    return NextResponse.json({
      credits: data.credits,
      tier: data.subscription_tier,
    })
  } catch (error: any) {
    console.error('Credits fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch credits' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { amount, type } = await request.json()

    if (!isSupabaseConfigured()) {
      // Return mock response if Supabase is not configured
      return NextResponse.json({
        success: true,
        newBalance: 10 + amount,
      })
    }

    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = getSupabaseClient()

    // Get current balance
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (fetchError) throw fetchError

    const newBalance = user.credits + amount

    // Update user credits
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: newBalance })
      .eq('id', userId)

    if (updateError) throw updateError

    // Record transaction
    await supabase.from('credit_transactions').insert({
      user_id: userId,
      type,
      amount,
      balance_after: newBalance,
      description: type === 'purchase' ? 'Credit purchase' : 'Credit usage',
    })

    return NextResponse.json({
      success: true,
      newBalance,
    })
  } catch (error: any) {
    console.error('Credits update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update credits' },
      { status: 500 }
    )
  }
}
