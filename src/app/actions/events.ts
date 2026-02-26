"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";
import type { Event } from "@/types/database";

export interface EventFormState {
  error?: string;
}

/**
 * Converte string de data para YYYY-MM-DD (esperado pelo banco).
 * Aceita: YYYY-MM-DD, ou DD MM AA / DD/MM/AA (ano 2 dígitos = 20xx).
 */
function normalizeEventDate(value: string | null): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const parts = raw.split(/[\s/.-]+/).filter(Boolean);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    let year = parts[2];
    if (year.length === 2) year = "20" + year;
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      return `${year}-${month}-${day}`;
    }
  }
  return null;
}

/**
 * Cria novo evento (chá de panela).
 */
export async function createEvent(
  _prev: EventFormState | null,
  formData: FormData
): Promise<EventFormState> {
  const title = (formData.get("title") as string | null)?.trim();
  const slugInput = (formData.get("slug") as string | null)?.trim();
  const eventDateRaw = (formData.get("event_date") as string | null) || null;
  const eventDate = normalizeEventDate(eventDateRaw);

  if (!title) {
    return { error: "Informe o título do evento." };
  }

  const slug = slugInput ? slugify(slugInput) : slugify(title);

  if (!slug) {
    return { error: "O slug gerado é inválido. Tente outro título." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Você precisa estar logado." };
  }

  const { error } = await supabase.from("events").insert({
    owner_id: user.id,
    title,
    slug,
    event_date: eventDate,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Já existe um evento com esse slug. Escolha outro." };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return {};
}

/**
 * Atualiza evento existente.
 */
const PIX_KEY_TYPES = ["cpf", "email", "phone", "random"] as const;

export async function updateEvent(
  _prev: EventFormState | null,
  formData: FormData
): Promise<EventFormState> {
  const id = formData.get("id") as string | null;
  const title = (formData.get("title") as string | null)?.trim();
  const slugInput = (formData.get("slug") as string | null)?.trim();
  const eventDateRaw = (formData.get("event_date") as string | null) || null;
  const eventDate = normalizeEventDate(eventDateRaw);
  const pixKey = (formData.get("pix_key") as string | null)?.trim() || null;
  const pixKeyTypeRaw = formData.get("pix_key_type") as string | null;
  const pixKeyType =
    pixKeyTypeRaw && PIX_KEY_TYPES.includes(pixKeyTypeRaw as (typeof PIX_KEY_TYPES)[number])
      ? (pixKeyTypeRaw as (typeof PIX_KEY_TYPES)[number])
      : null;

  if (!id) {
    return { error: "ID do evento não informado." };
  }

  if (!title) {
    return { error: "Informe o título do evento." };
  }

  const slug = slugInput ? slugify(slugInput) : slugify(title);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Você precisa estar logado." };
  }

  const { error } = await supabase
    .from("events")
    .update({
      title,
      slug,
      event_date: eventDate,
      pix_key: pixKey,
      pix_key_type: pixKeyType,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Já existe um evento com esse slug. Escolha outro." };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return {};
}

/**
 * Exclui evento.
 */
export async function deleteEvent(id: string): Promise<EventFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Você precisa estar logado." };
  }

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return {};
}
