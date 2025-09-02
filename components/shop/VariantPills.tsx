// components/shop/VariantPills.tsx
'use client'
import { cn } from '@/lib/utils'

export function VariantPills({
  options,
  value,
  onChange,
  disabled = [],
}: {
  options: string[]
  value?: string
  onChange: (v: string) => void
  disabled?: string[]
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isDisabled = disabled.includes(opt)
        return (
          <button
            key={opt}
            disabled={isDisabled}
            onClick={() => onChange(opt)}
            className={cn(
              'rounded border px-3 py-1',
              isDisabled && 'cursor-not-allowed opacity-40',
              value === opt ? 'bg-black text-white' : 'bg-white',
            )}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
