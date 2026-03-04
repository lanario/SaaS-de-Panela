"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { GIFT_CATEGORIES } from "@/types/database";

export interface GiftItemFormState {
  error?: string;
}

/**
 * Cria novo item na lista de presentes.
 */
export async function createGiftItem(
  _prev: GiftItemFormState | null,
  formData: FormData
): Promise<GiftItemFormState> {
  const eventId = formData.get("event_id") as string | null;
  const name = (formData.get("name") as string | null)?.trim();
  const productUrl = (formData.get("product_url") as string | null)?.trim();
  const imageUrl = (formData.get("image_url") as string | null)?.trim() || null;
  const priceStr = formData.get("price") as string | null;
  const category = formData.get("category") as string | null;

  if (!eventId || !name || !priceStr) {
    return { error: "Preencha nome do produto e valor." };
  }

  if (imageUrl) {
    try {
      new URL(imageUrl);
    } catch {
      return { error: "URL da imagem inválida." };
    }
  }

  const price = parseFloat(priceStr.replace(",", "."));
  if (isNaN(price) || price <= 0) {
    return { error: "Valor inválido." };
  }

  const cat =
    (category && String(category).trim()) ||
    GIFT_CATEGORIES[0];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Você precisa estar logado." };
  }

  const { data: event } = await supabase
    .from("events")
    .select("id, short_id, slug")
    .eq("id", eventId)
    .eq("owner_id", user.id)
    .single();

  if (!event) {
    return { error: "Evento não encontrado ou você não tem permissão." };
  }

  const allowProductLink = formData.get("allow_product_link") === "on";
  const allowPix = formData.get("allow_pix") === "on";
  const allowReserve = formData.get("allow_reserve") === "on";

  const { error } = await supabase.from("gift_items").insert({
    event_id: eventId,
    name,
    product_url: productUrl || "",
    image_url: imageUrl,
    price,
    category: cat,
    status: "disponivel",
    allow_product_link: allowProductLink,
    allow_pix: allowPix,
    allow_reserve: allowReserve,
  });

  if (error) {
    return { error: error.message };
  }

  const listSegment = event.short_id ?? event.slug;
  revalidatePath(`/lista/${listSegment}`);
  revalidatePath(`/dashboard/eventos/${eventId}`);
  return {};
}

/**
 * Atualiza dados do presente (nome, link, imagem, valor, categoria).
 */
export async function updateGiftItem(
  _prev: GiftItemFormState | null,
  formData: FormData
): Promise<GiftItemFormState> {
  const giftItemId = formData.get("gift_item_id") as string | null;
  const eventId = formData.get("event_id") as string | null;
  const name = (formData.get("name") as string | null)?.trim();
  const productUrl = (formData.get("product_url") as string | null)?.trim();
  const imageUrl = (formData.get("image_url") as string | null)?.trim() || null;
  const priceStr = formData.get("price") as string | null;
  const category = formData.get("category") as string | null;
  const allowProductLink = formData.get("allow_product_link") === "on";
  const allowPix = formData.get("allow_pix") === "on";
  const allowReserve = formData.get("allow_reserve") === "on";

  if (!giftItemId || !eventId || !name || !priceStr) {
    return { error: "Preencha nome do produto e valor." };
  }

  if (imageUrl) {
    try {
      new URL(imageUrl);
    } catch {
      return { error: "URL da imagem inválida." };
    }
  }

  const price = parseFloat(priceStr.replace(",", "."));
  if (isNaN(price) || price <= 0) {
    return { error: "Valor inválido." };
  }

  const cat =
    (category && String(category).trim()) ||
    GIFT_CATEGORIES[0];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Você precisa estar logado." };
  }

  const { data: event } = await supabase
    .from("events")
    .select("id, short_id, slug")
    .eq("id", eventId)
    .eq("owner_id", user.id)
    .single();

  if (!event) {
    return { error: "Evento não encontrado ou você não tem permissão." };
  }

  const { error } = await supabase
    .from("gift_items")
    .update({
      name,
      product_url: productUrl || "",
      image_url: imageUrl,
      price,
      category: cat,
      allow_product_link: allowProductLink,
      allow_pix: allowPix,
      allow_reserve: allowReserve,
      updated_at: new Date().toISOString(),
    })
    .eq("id", giftItemId)
    .eq("event_id", eventId);

  if (error) {
    return { error: error.message };
  }

  const listSegment = event.short_id ?? event.slug;
  revalidatePath(`/lista/${listSegment}`);
  revalidatePath(`/dashboard/eventos/${eventId}`);
  return {};
}

/**
 * Atualiza status de um item.
 */
export async function updateGiftItemStatus(
  itemId: string,
  eventId: string,
  status: "disponivel" | "reservado" | "comprado",
  buyerName?: string | null
): Promise<GiftItemFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Você precisa estar logado." };
  }

  const { data: event } = await supabase
    .from("events")
    .select("id, short_id, slug")
    .eq("id", eventId)
    .eq("owner_id", user.id)
    .single();

  if (!event) {
    return { error: "Evento não encontrado ou você não tem permissão." };
  }

  const update: { status: string; buyer_name?: string | null } = { status };
  if (status === "comprado" && typeof buyerName === "string") {
    update.buyer_name = buyerName.trim() || null;
  } else if (status !== "comprado") {
    update.buyer_name = null;
  }

  const { error } = await supabase
    .from("gift_items")
    .update(update)
    .eq("id", itemId)
    .eq("event_id", eventId);

  if (error) {
    return { error: error.message };
  }

  const listSegment = event.short_id ?? event.slug;
  revalidatePath(`/lista/${listSegment}`);
  revalidatePath(`/dashboard/eventos/${eventId}`);
  return {};
}

/**
 * Exclui item da lista.
 */
export async function deleteGiftItem(itemId: string, eventId: string): Promise<GiftItemFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Você precisa estar logado." };
  }

  const { data: event } = await supabase
    .from("events")
    .select("id, short_id, slug")
    .eq("id", eventId)
    .eq("owner_id", user.id)
    .single();

  if (!event) {
    return { error: "Evento não encontrado ou você não tem permissão." };
  }

  const { error } = await supabase
    .from("gift_items")
    .delete()
    .eq("id", itemId)
    .eq("event_id", eventId);

  if (error) {
    return { error: error.message };
  }

  const listSegment = event.short_id ?? event.slug;
  revalidatePath(`/lista/${listSegment}`);
  revalidatePath(`/dashboard/eventos/${eventId}`);
  return {};
}
