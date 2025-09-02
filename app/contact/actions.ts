"use server";
import { prisma } from "@/lib/prisma";

export async function submitContact(formData: FormData) {
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const phone = String(formData.get("phone") || "");
  const subject = String(formData.get("subject") || "");
  const message = String(formData.get("message") || "");

  if (!name || !email || !subject || !message) {
    return { ok:false, error:"Please fill in all required fields." };
  }

  await prisma.contactMessage.create({ data: { name, email, phone, subject, message } });
  return { ok:true };
}
