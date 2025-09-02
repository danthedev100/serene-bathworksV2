// app/product/[slug]/pdp-client.tsx
'use client'
import { useMemo, useState } from 'react'
import { VariantPills } from '@/components/shop/VariantPills'
import QuantityStepper from '@/components/shop/QuantityStepper'
import AddToCartButton from '@/components/shop/AddToCartButton'

export default function PDPClient({ product, sizes, scents }:{ product:any; sizes:string[]; scents:string[] }) {
  const [size, setSize] = useState<string>()
  const [scent, setScent] = useState<string>()
  const [qty, setQty] = useState(1)

  const selected = useMemo(
    () => product.variants.find((v:any) => v.size === size && v.scent === scent && v.active),
    [size, scent, product]
  )

  return (
    <main className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <img src={(selected?.image) || product.images?.[0]} alt={product.name} className="w-full rounded-lg"/>
      </div>
      <div>
        <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
        <p className="text-muted-foreground mb-4">Choose your size and scent</p>

        <div className="space-y-6">
          <div>
            <div className="mb-2 text-sm font-medium">Size</div>
            <VariantPills options={sizes} value={size} onChange={setSize} />
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">Scent</div>
            <VariantPills options={scents} value={scent} onChange={setScent} />
          </div>
          <div className="flex items-center gap-4">
            <QuantityStepper value={qty} setValue={setQty} />
            <div className="text-xl font-semibold">
              {selected ? `R ${(selected.priceCents/100).toFixed(2)}` : '—'}
            </div>
          </div>

          {selected ? (
            selected.stock > 0 ? (
              <AddToCartButton variant={selected} product={product} qty={qty} />
            ) : (
              <div className="text-red-600">Out of stock</div>
            )
          ) : (
            <div className="text-sm text-muted-foreground">Select size and scent</div>
          )}

          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
