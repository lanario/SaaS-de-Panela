"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { EventCategory } from "@/types/database";

/**
 * Lista categorias do evento (para o dono).
 */
export async function getEventCategories(eventId: string): Promise<EventCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_categories")
    .select("*")
    .eq("event_id", eventId)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("getEventCategories", error);
    return [];
  }
  return (data ?? []) as EventCategory[];
}

/**
 * Cria uma nova categoria para o evento. Só o dono do evento pode criar.
 */
export async function createEventCategory(
  eventId: string,
  name: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = name?.trim();
  if (!trimmed) {
    return { ok: false, error: "Nome da categoria é obrigatório." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Não autorizado." };
  }

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .eq("owner_id", user.id)
    .single();

  if (!event) {
    return { ok: false, error: "Evento não encontrado." };
  }

  const { error } = await supabase.from("event_categories").insert({
    event_id: eventId,
    name: trimmed,
    sort_order: 0,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Já existe uma categoria com esse nome." };
    }
    console.error("createEventCategory", error);
    return { ok: false, error: error.message };
  }

  revalidatePath(`/dashboard/eventos/${eventId}`);
  return { ok: true };
}
