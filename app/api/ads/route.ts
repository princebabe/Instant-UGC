import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      // Return mock data if Supabase is not configured
      return NextResponse.json({
        ads: [],
        total: 0,
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
    const { data, error, count } = await supabase
      .from('ads')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({
      ads: data,
      total: count,
    })
  } catch (error: any) {
    console.error('Ads fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch ads' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const adData = await request.json()

    if (!isSupabaseConfigured()) {
      // Return mock response if Supabase is not configured
      return NextResponse.json({
        id: `ad_${Date.now()}`,
        ...adData,
        status: 'pending',
        createdAt: new Date().toISOString(),
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
    const { data, error } = await supabase
      .from('ads')
      .insert({
        user_id: userId,
        ...adData,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Ad creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create ad' },
      { status: 500 }
    )
  }
}
