"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

function generateConfirmToken(): string {
  return randomBytes(24).toString("base64url");
}
import { createClient } from "@/lib/supabase/server";

export interface ReserveFormState {
  error?: string;
  confirmToken?: string;
}

/**
 * Reserva um item (convidado informa nome; cria purchase e marca item como reservado).
 */
export async function reserveItem(
  _prev: ReserveFormState | null,
  formData: FormData
): Promise<ReserveFormState> {
  const giftItemId = formData.get("gift_item_id") as string | null;
  const buyerName = (formData.get("buyer_name") as string | null)?.trim();
  const eventSlug = formData.get("event_slug") as string | null;

  if (!giftItemId || !buyerName) {
    return { error: "Informe seu nome." };
  }

  const supabase = await createClient();

  const { data: item, error: itemError } = await supabase
    .from("gift_items")
    .select("id, price, event_id, status")
    .eq("id", giftItemId)
    .single();

  if (itemError || !item) {
    return { error: "Item não encontrado." };
  }

  if (item.status !== "disponivel") {
    return { error: "Este item já foi reservado ou comprado." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const token = generateConfirmToken();

  const { error: insertError } = await supabase.from("purchases").insert({
    gift_item_id: giftItemId,
    buyer_user_id: user?.id ?? null,
    buyer_name: buyerName,
    payment_type: "link",
    status: "pendente",
    amount: Number(item.price),
    confirm_token: token,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  const { error: updateError } = await supabase
    .from("gift_items")
    .update({
      status: "reservado",
      buyer_name: buyerName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", giftItemId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/lista/${eventSlug ?? ""}`);
  return { confirmToken: token };
}

/**
 * Registra intenção de pagamento por PIX (cria purchase e marca item como reservado).
 */
export async function reserveByPix(
  _prev: ReserveFormState | null,
  formData: FormData
): Promise<ReserveFormState> {
  const giftItemId = formData.get("gift_item_id") as string | null;
  const buyerName = (formData.get("buyer_name") as string | null)?.trim();
  const eventSlug = formData.get("event_slug") as string | null;

  if (!giftItemId || !buyerName) {
    return { error: "Informe seu nome." };
  }

  const supabase = await createClient();

  const { data: item, error: itemError } = await supabase
    .from("gift_items")
    .select("id, price, event_id, status")
    .eq("id", giftItemId)
    .single();

  if (itemError || !item) {
    return { error: "Item não encontrado." };
  }

  if (item.status !== "disponivel") {
    return { error: "Este item já foi reservado ou comprado." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error: insertError } = await supabase.from("purchases").insert({
    gift_item_id: giftItemId,
    buyer_user_id: user?.id ?? null,
    buyer_name: buyerName,
    payment_type: "pix",
    status: "pendente",
    amount: Number(item.price),
  });

  if (insertError) {
    return { error: insertError.message };
  }

  const { error: updateError } = await supabase
    .from("gift_items")
    .update({
      status: "reservado",
      buyer_name: buyerName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", giftItemId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/lista/${eventSlug ?? ""}`);
  revalidatePath("/dashboard/eventos/[id]", "page");
  return {};
}

/**
 * Confirma compra por token (página pública).
 */
export async function confirmPurchaseByToken(token: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("confirm_purchase_by_token", {
    p_token: token,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data) {
    return { ok: false, error: "Link inválido ou compra já confirmada." };
  }

  return { ok: true };
}

/**
 * Dono confirma uma compra PIX (atualiza purchase e gift_item para comprado).
 */
export async function confirmPixPurchase(
  purchaseId: string,
  eventId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Não autorizado." };
  }

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .eq("owner_id", user.id)
    .single();

  if (!event) {
    return { error: "Evento não encontrado." };
  }

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, gift_item_id, buyer_name")
    .eq("id", purchaseId)
    .eq("payment_type", "pix")
    .single();

  if (!purchase) {
    return { error: "Compra não encontrada." };
  }

  const { data: item } = await supabase
    .from("gift_items")
    .select("event_id")
    .eq("id", purchase.gift_item_id)
    .single();

  if (!item || item.event_id !== eventId) {
    return { error: "Item não pertence a este evento." };
  }

  const { error: updatePurchaseError } = await supabase
    .from("purchases")
    .update({ status: "confirmado", confirmed_at: new Date().toISOString() })
    .eq("id", purchaseId);

  if (updatePurchaseError) {
    return { error: updatePurchaseError.message };
  }

  const { error: updateItemError } = await supabase
    .from("gift_items")
    .update({
      status: "comprado",
      buyer_name: purchase.buyer_name,
      updated_at: new Date().toISOString(),
    })
    .eq("id", purchase.gift_item_id);

  if (updateItemError) {
    return { error: updateItemError.message };
  }

  const { data: ev } = await supabase
    .from("events")
    .select("slug")
    .eq("id", eventId)
    .single();
  if (ev?.slug) {
    revalidatePath(`/lista/${ev.slug}`);
  }
  revalidatePath(`/dashboard/eventos/${eventId}`);
  return {};
}
