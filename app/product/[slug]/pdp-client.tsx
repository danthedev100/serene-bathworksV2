"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useCart } from "@/app/providers/cart-provider"

type PDPClientProps = {
  product: {
    id: string
    name: string
    description: string | null
    variants: {
      id: string
      label: string
      size?: string | null
      priceZAR: number
      stock: number
      whatsappSku?: string | null
      scentNotes?: string | null
      tags: string[]
      imageUrl: string
      active: boolean
    }[]
  }
}

export default function PDPClient({ product }: PDPClientProps) {
  const [selected, setSelected] = useState(product.variants[0] ?? null)
  const [ripple, setRipple] = useState(false)
  const { addItem } = useCart()

  const triggerRipple = () => {
    setRipple(true)
    setTimeout(() => setRipple(false), 400)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="grid gap-6 md:grid-cols-2"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-md shadow-[#ceb560]/20">
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="h-full w-full"
              >
                <Image
                  src={selected.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover rounded-2xl"
                  priority
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.p
              key={selected.id + "-price"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold text-[#82704d]"
            >
              R {selected.priceZAR}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => (
            <motion.button
              key={v.id}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              disabled={v.stock === 0}
              onClick={() => setSelected(v)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm font-medium transition-colors",
                v.stock === 0 && "opacity-50 cursor-not-allowed line-through",
                selected?.id === v.id
                  ? "bg-[#ceb560] text-white border-[#ceb560]"
                  : "bg-[#faefed] text-[#82704d] border-[#82704d]/20"
              )}
            >
              {v.label} {v.size && `(${v.size})`}
            </motion.button>
          ))}
        </div>

        {selected?.stock === 0 ? (
          <p className="text-red-600">Out of stock</p>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              triggerRipple()
              if (selected) {
                addItem({
                  variantId: selected.id,
                  name: product.name,
                  label: selected.label,
                  size: selected.size,
                  priceZAR: selected.priceZAR,
                  qty: 1,
                  imageUrl: selected.imageUrl,
                })
              }
            }}
            className="relative overflow-hidden bg[#82704d] text-white px-6 py-3 rounded-2xl shadow-md shadow-[#ceb560]/20 w-fit"
            style={{ background: "#82704d" }}
          >
            Add to Cart
            <AnimatePresence>
              {ripple && (
                <motion.span
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 bg-white/30 rounded-full"
                />
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
