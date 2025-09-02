"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Palette } from "@/lib/palette";

type Pill = { id: string; label: string; disabled?: boolean };

export function VariantPills({
  variants, activeId, onChange,
}: { variants: Pill[]; activeId: string; onChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {variants.map((v) => {
        const active = v.id === activeId;
        return (
          <Button
            key={v.id}
            type="button"
            variant={active ? "default" : "outline"}
            disabled={!!v.disabled}
            onClick={() => !v.disabled && onChange(v.id)}
            className={`rounded-full px-4 ${v.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{
              background: active ? Palette.text : "transparent",
              color: active ? Palette.pinkBg : Palette.text,
              borderColor: Palette.text,
              textDecoration: v.disabled ? "line-through" : "none",
            }}
          >
            {v.label}
          </Button>
        );
      })}
    </div>
  );
}
