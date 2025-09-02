// lib/pricing.ts
export function computeTotals(items: { priceCents:number; qty:number }[]){
  const subtotal = items.reduce((s,i)=> s + i.priceCents * i.qty, 0)
  const free = Number(process.env.FREE_SHIPPING_THRESHOLD_CENTS || 60000)
  const ship = subtotal >= free ? 0 : Number(process.env.FLAT_SHIPPING_CENTS || 6900)
  return { subtotalCents: subtotal, shippingCents: ship, totalCents: subtotal + ship }
}
