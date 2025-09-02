"use client";
import * as React from "react";
import { submitContact } from "./actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Palette } from "@/lib/palette";

export default function ContactPage() {
  const [status, setStatus] = React.useState<"idle"|"sending"|"ok"|"err">("idle");
  const [err, setErr] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending"); setErr(null);
    const fd = new FormData(e.currentTarget);
    const res = await submitContact(fd);
    if (res?.ok) setStatus("ok"); else { setStatus("err"); setErr(res?.error || "Something went wrong."); }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12 bg-white rounded-2xl shadow"
         style={{ border:`1px solid ${Palette.gold}` }}>
      <h1 className="font-serif text-3xl mb-6" style={{ color: Palette.text }}>Contact Us</h1>
      {status==="ok" ? (
        <div className="p-4 rounded" style={{ background: Palette.pinkBg, color: Palette.text }}>
          Thanks! We’ve received your message and will get back to you soon.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1" style={{ color: Palette.text }}>Name*</label>
            <Input name="name" required />
          </div>
          <div>
            <label className="block mb-1" style={{ color: Palette.text }}>Email*</label>
            <Input type="email" name="email" required />
          </div>
          <div>
            <label className="block mb-1" style={{ color: Palette.text }}>Phone</label>
            <Input name="phone" />
          </div>
          <div>
            <label className="block mb-1" style={{ color: Palette.text }}>Subject*</label>
            <Input name="subject" required />
          </div>
          <div>
            <label className="block mb-1" style={{ color: Palette.text }}>Message*</label>
            <Textarea name="message" rows={6} required />
          </div>

          {status==="err" && (
            <div className="text-sm" style={{ color: "crimson" }}>{err}</div>
          )}

          <Button type="submit" disabled={status==="sending"}
                  style={{ background: Palette.text, color: Palette.pinkBg }}>
            {status==="sending" ? "Sending…" : "Send message"}
          </Button>
        </form>
      )}
    </div>
  );
}
