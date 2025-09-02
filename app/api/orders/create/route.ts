// app/api/orders/create/route.ts
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeTotals } from '@/lib/pricing'
import crypto from 'node:crypto'

export async function POST(req: NextRequest) {
  const { email, name, phone, addressLine1, addressLine2, city, postalCode, items } = await req.json()

  const variantIds = items.map((i:any) => i.variantId)
  const variants = await prisma.variant.findMany({
    where: { id: { in: variantIds } },
    select: { id: true, priceCents: true, stock: true }
  })
  const map = new Map(variants.map(v => [v.id, v]))

  for (const it of items) {
    const v = map.get(it.variantId)
    if (!v) return NextResponse.json({ error: 'Variant not found' }, { status: 400 })
    if (v.stock < it.qty) return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    it.priceCents = v.priceCents // authoritative price
  }

  const totals = computeTotals(items)

  const order = await prisma.order.create({
    data: {
      status: 'PENDING',
      email, name, phone, addressLine1, addressLine2, city, postalCode,
      subtotalCents: totals.subtotalCents,
      shippingCents: totals.shippingCents,
      totalCents: totals.totalCents,
      items: {
        create: items.map((i:any) => ({
          variantId: i.variantId, qty: i.qty, priceCentsAtSale: i.priceCents
        }))
      }
    }
  })

  const html = buildPayfastFormHTML({
    orderId: order.id, amountCents: order.totalCents, email
  })

  return NextResponse.json({ orderId: order.id, html })
}

function buildSignature(data: Record<string,string>, passphrase?: string) {
  const pairs = Object.keys(data).sort()
    .map(k => `${k}=${encodeURIComponent(data[k]).replace(/%20/g,'+')}`)
    .join('&') + (passphrase ? `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g,'+')}` : '')
  return crypto.createHash('md5').update(pairs).digest('hex')
}

function buildPayfastFormHTML({ orderId, amountCents, email }:{ orderId:string; amountCents:number; email:string }) {
  const endpoint = process.env.PAYFAST_MODE === 'production'
    ? 'https://www.payfast.co.za/eng/process'
    : 'https://sandbox.payfast.co.za/eng/process'

  const data: Record<string,string> = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID!,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY!,
    return_url: process.env.PAYFAST_RETURN_URL!,
    cancel_url: process.env.PAYFAST_CANCEL_URL!,
    notify_url: process.env.PAYFAST_NOTIFY_URL!,
    m_payment_id: orderId,
    amount: (amountCents/100).toFixed(2),
    item_name: 'Serene Bathworks Order',
    email_address: email,
    email_confirmation: '1',
    confirmation_address: email,
    currency: 'ZAR',
  }
  const signature = buildSignature(data, process.env.PAYFAST_PASSPHRASE)
  const inputs = Object.entries({ ...data, signature })
    .map(([k,v]) => `<input type="hidden" name="${k}" value="${v}">`).join('')

  return `<!doctype html><html><body>
    <p>Redirecting to Payfast…</p>
    <form id="pf" method="post" action="${endpoint}">${inputs}</form>
    <script>document.getElementById('pf').submit()</script>
  </body></html>`
}
