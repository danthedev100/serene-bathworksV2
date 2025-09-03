"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type CartItem = {
  variantId: string
  name: string
  label: string
  size?: string | null
  priceZAR: number
  qty: number
  imageUrl: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (item: CartItem) =>
    setItems(prev => {
      const existing = prev.find(i => i.variantId === item.variantId)
      if (existing) {
        return prev.map(i =>
          i.variantId === item.variantId ? { ...i, qty: i.qty + item.qty } : i
        )
      }
      return [...prev, item]
    })

  const removeItem = (variantId: string) =>
    setItems(prev => prev.filter(i => i.variantId !== variantId))

  const clearCart = () => setItems([])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
