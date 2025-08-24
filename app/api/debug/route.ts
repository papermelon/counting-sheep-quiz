import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check debug token
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const debugToken = process.env.DEBUG_TOKEN

    if (!debugToken || token !== debugToken) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        error: 'Missing Supabase credentials',
        supabaseUrl: !!supabaseUrl,
        supabaseAnonKey: !!supabaseAnonKey
      }, { status: 500 })
    }

             const supabase = createClient(supabaseUrl, supabaseAnonKey, {
           auth: {
             persistSession: false
           },
           global: {
             fetch: fetch.bind(globalThis)
           }
         })

             // Test basic connectivity first
         let connectivityTest = false
         try {
           const response = await fetch(`${supabaseUrl}/rest/v1/`, {
             headers: {
               'apikey': supabaseAnonKey,
               'Authorization': `Bearer ${supabaseAnonKey}`
             }
           })
           connectivityTest = response.ok
         } catch (connectError) {
           console.error('Connectivity test failed:', connectError)
         }

         // Test database query
         let dbOk = false
         let sample: any[] = []
         let dbError: any = null

         try {
           const { data, error } = await supabase
             .from('quizzes')
             .select('slug, max_score')
             .limit(3)

           if (error) {
             throw error
           }

           dbOk = true
           sample = data || []
         } catch (error) {
           dbOk = false
           dbError = error
           console.error('Database error:', error)
           console.error('Error details:', {
             message: (error as any)?.message,
             stack: (error as any)?.stack,
             name: (error as any)?.name
           })
         }

         // Return debug information
         return NextResponse.json({
           baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
           appName: process.env.NEXT_PUBLIC_APP_NAME,
           supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
           anonKeyPresent: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
           serviceRolePresent: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
           connectivityTest,
           dbOk,
           sample,
           error: dbOk ? null : (dbError as any)?.message || 'Unknown database error'
         }, {
           headers: {
             'Content-Type': 'application/json'
           }
         })

  } catch (error) {
    console.error('Debug route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
