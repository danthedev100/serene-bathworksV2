// app/checkout/page.tsx
'use client'
import { useState } from 'react'
import { useCart } from '@/lib/cart'
import { Button } from '@/components/ui/button'

export default function CheckoutPage() {
  const { items /*, clear */ } = useCart()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [addressLine1, setA1] = useState('')
  const [addressLine2, setA2] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPC] = useState('')
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    setLoading(true)
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          phone,
          addressLine1,
          addressLine2,
          city,
          postalCode,
          items,
        }),
      })
      const { html } = await res.json()
      const w = window.open('', '_self')
      w!.document.write(html)
      w!.document.close()
      // Optionally clear the cart on return page after success
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <input
            className="w-full rounded border p-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded border p-2"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded border p-2"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="w-full rounded border p-2"
            placeholder="Address line 1"
            value={addressLine1}
            onChange={(e) => setA1(e.target.value)}
          />
          <input
            className="w-full rounded border p-2"
            placeholder="Address line 2 (optional)"
            value={addressLine2}
            onChange={(e) => setA2(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="rounded border p-2"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              className="rounded border p-2"
              placeholder="Postal code"
              value={postalCode}
              onChange={(e) => setPC(e.target.value)}
            />
          </div>
        </div>
        <div className="h-fit space-y-2 rounded border p-4">
          <p className="text-muted-foreground text-sm">Totals will be verified server-side.</p>
          <Button disabled={loading || items.length === 0} onClick={handlePay} className="w-full">
            Pay with Payfast
          </Button>
        </div>
      </div>
    </main>
  )
}
