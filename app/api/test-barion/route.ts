import { NextResponse } from 'next/server'
import { BARION_CONFIG } from '@/lib/barion/config'

export async function GET() {
  return NextResponse.json({
    configured: !!BARION_CONFIG.posKey,
    environment: BARION_CONFIG.environment,
    baseUrl: BARION_CONFIG.baseUrl,
    paymentUrl: BARION_CONFIG.paymentUrl,
    appUrl: BARION_CONFIG.appUrl,
    posKeyLength: BARION_CONFIG.posKey?.length || 0,
  })
}
