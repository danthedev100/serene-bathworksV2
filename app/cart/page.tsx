"use client"

import Image from "next/image"
import { useCart } from "@/app/providers/cart-provider"

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart()

  if (items.length === 0) {
    return <div className="p-6">Your cart is empty 🛒</div>
  }

  const total = items.reduce((sum, i) => sum + i.priceZAR * i.qty, 0)

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      {items.map((item) => (
        <div key={item.variantId} className="flex items-center justify-between border-b py-3">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-lg overflow-hidden">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
            </div>
            <div>
              <p className="font-medium">{item.name} — {item.label}</p>
              {item.size && <p className="text-sm text-gray-600">{item.size}</p>}
              <p className="text-sm">Qty: {item.qty}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <p className="font-bold">R {item.priceZAR * item.qty}</p>
            <button className="text-red-600 hover:underline" onClick={() => removeItem(item.variantId)}>
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between pt-4">
        <p className="text-lg font-semibold">Total: R {total}</p>
        <button className="bg-[#82704d] text-white px-4 py-2 rounded" onClick={clearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  )
}
