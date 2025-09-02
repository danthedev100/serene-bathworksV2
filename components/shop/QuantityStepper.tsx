// components/shop/QuantityStepper.tsx
'use client'
export default function QuantityStepper({ value, setValue }:{ value:number; setValue:(n:number)=>void }) {
  return (
    <div className="inline-flex items-center border rounded">
      <button onClick={()=>setValue(Math.max(1, value-1))} className="px-3 py-2">-</button>
      <div className="px-4 select-none">{value}</div>
      <button onClick={()=>setValue(value+1)} className="px-3 py-2">+</button>
    </div>
  )
}
