"use server";

import { sql } from "./server-db";

export type LeadState = { status: "idle" | "ok" | "error"; message?: string };

/** Quote-form submission → site_leads. The website's whole job is producing these rows. */
export async function submitLead(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const slug = String(formData.get("slug") ?? "").slice(0, 100);
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 40);
  const service = String(formData.get("service") ?? "").slice(0, 120);
  const message = String(formData.get("message") ?? "").trim().slice(0, 2000);
  // Honeypot field: bots fill it, humans never see it.
  if (formData.get("company")) return { status: "ok" };

  if (!name || !phone) {
    return { status: "error", message: "Please add your name and phone number." };
  }

  try {
    await sql`
      insert into site_leads (slug, name, phone, service, message)
      values (${slug}, ${name}, ${phone}, ${service || null}, ${message || null})`;
    return { status: "ok" };
  } catch {
    return { status: "error", message: "Something went wrong — please call us instead." };
  }
}
