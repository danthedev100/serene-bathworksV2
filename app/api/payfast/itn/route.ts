// app/api/payfast/itn/route.ts
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { prisma } from '@/lib/prisma'

function buildSig(obj:Record<string,string>, passphrase?:string){
  const keys = Object.keys(obj).filter(k => k !== 'signature').sort()
  const base = keys.map(k => `${k}=${encodeURIComponent(obj[k]).replace(/%20/g,'+')}`).join('&')
  const str = passphrase ? `${base}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g,'+')}` : base
  return crypto.createHash('md5').update(str).digest('hex')
}

export async function POST(req: NextRequest){
  const body = await req.text()
  const params = Object.fromEntries(new URLSearchParams(body)) as Record<string,string>

  const expected = buildSig(params, process.env.PAYFAST_PASSPHRASE || undefined)
  if (expected !== params['signature']) return NextResponse.json({ error: 'Bad signature' }, { status: 400 })
  if (params['merchant_id'] !== process.env.PAYFAST_MERCHANT_ID) return NextResponse.json({ error: 'Bad merchant' }, { status: 400 })

  const orderId = params['m_payment_id']
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: { include: { variant: true } } } })
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const amount = parseFloat(params['amount'] || '0')
  if (Math.round(amount * 100) !== order.totalCents) return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })

  if (order.status !== 'PAID') {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID', pfPaymentId: params['pf_payment_id'] || 'unknown', pfSignature: params['signature'], pfRaw: params as any }
      }),
      ...order.items.map(i => prisma.variant.update({ where: { id: i.variantId }, data: { stock: { decrement: i.qty } } }))
    ])
  }

  return NextResponse.json({ ok: true })
}
