"use server";

import { sql } from "./server-db";

export type Tier = "build" | "skip" | "discuss";

export async function saveTier(placeId: string, tier: Tier) {
  await sql`
    insert into human_calibration (place_id, tier)
    values (${placeId}, ${tier})
    on conflict (place_id) do update
      set tier = excluded.tier, updated_at = now()`;
}

export async function saveVoiceNote(placeId: string, note: string) {
  const trimmed = note.trim().slice(0, 8000);
  await sql`
    insert into human_calibration (place_id, voice_note)
    values (${placeId}, ${trimmed || null})
    on conflict (place_id) do update
      set voice_note = excluded.voice_note, updated_at = now()`;
}
