import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { barionClient } from '@/lib/barion/client'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const paymentId = searchParams.get('paymentId')

  if (!paymentId) {
    return NextResponse.redirect(new URL('/checkout/error?message=Missing payment ID', request.url))
  }

  try {
    const paymentState = await barionClient.getPaymentState(paymentId)
    
    const supabase = await createClient()
    
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', paymentState.PaymentRequestId)
      .single()

    if (!order) {
      return NextResponse.redirect(new URL('/checkout/error?message=Order not found', request.url))
    }

    if (paymentState.Status === 'Succeeded') {
      return NextResponse.redirect(new URL(`/checkout/success?orderId=${order.id}`, request.url))
    } else if (paymentState.Status === 'Failed' || paymentState.Status === 'Canceled') {
      return NextResponse.redirect(new URL(`/checkout/error?orderId=${order.id}&status=${paymentState.Status}`, request.url))
    } else {
      return NextResponse.redirect(new URL(`/checkout/pending?orderId=${order.id}`, request.url))
    }
  } catch (error) {
    console.error('Barion callback error:', error)
    return NextResponse.redirect(new URL('/checkout/error?message=Payment verification failed', request.url))
  }
}
