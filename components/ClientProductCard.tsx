"use client";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { VariantPills } from "@/components/VariantPills";
import { Palette } from "@/lib/palette";
import type { Product, Variant } from "@prisma/client";

function isUnavailable(v?: Variant) {
  if (!v) return false;
  return !v.active || v.stock <= 0;
}

export default function ClientProductCard({ product }: { product: Product & { variants: Variant[] } }) {
  const [activeId, setActiveId] = React.useState(product.variants[0]?.id ?? "");
  const current = product.variants.find(v => v.id === activeId) ?? product.variants[0];
  const unavailable = isUnavailable(current);

  return (
    <div className="rounded-2xl shadow-lg overflow-hidden p-6 flex flex-col md:flex-row gap-8 bg-white"
         style={{ border: `1px solid ${Palette.gold}` }}>
      <div className="basis-1/2 flex items-center justify-center">
        <div className="relative w-[420px] h-[300px]">
          <Image
            key={current?.imageUrl}
            src={current?.imageUrl || "/images/placeholder.png"}
            alt={current?.label || product.name}
            fill
            sizes="(max-width: 768px) 90vw, 420px"
            className={`object-contain ${unavailable ? "grayscale" : ""}`}
            priority
          />
          {unavailable && (
            <div className="absolute inset-0 grid place-items-center">
              <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: Palette.text, color: Palette.pinkBg }}>
                Out of stock
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="basis-1/2">
        <h3 className="font-serif text-2xl" style={{ color: Palette.text }}>{product.name}</h3>
        {product.description && <p className="mt-2" style={{ color: Palette.text }}>{product.description}</p>}

        <VariantPills
          variants={product.variants.map(v => ({
            id: v.id, label: v.label, disabled: isUnavailable(v),
          }))}
          activeId={activeId}
          onChange={setActiveId}
        />

        <div className="mt-6 flex items-center gap-3">
          <Button
            disabled={unavailable}
            className="px-5 py-2 rounded-xl font-medium"
            style={{ background: Palette.gold, color: Palette.pinkBg }}
          >
            {unavailable ? "Unavailable" : "Add to Cart"}
          </Button>
          <Button variant="outline" className="px-5 py-2 rounded-xl font-medium"
                  style={{ borderColor: Palette.text, color: Palette.text }}>
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
