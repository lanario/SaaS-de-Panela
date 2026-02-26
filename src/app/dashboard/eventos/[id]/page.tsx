import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { EventItemsManager } from "@/components/dashboard/EventItemsManager";
import { getEventCategories } from "@/app/actions/event-categories";
import type { Event, GiftItem } from "@/types/database";

interface PageProps {
  params: { id: string };
}

export default async function EventoPage({ params }: PageProps) {
  const { id: eventId } = params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .eq("owner_id", user.id)
    .single();

  if (eventError || !event) {
    notFound();
  }

  const { data: items } = await supabase
    .from("gift_items")
    .select("*")
    .eq("event_id", eventId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const itemIds = (items ?? []).map((i) => i.id);
  const { data: pendingPixPurchases } =
    itemIds.length > 0
      ? await supabase
          .from("purchases")
          .select("id, gift_item_id, buyer_name, amount, created_at")
          .eq("payment_type", "pix")
          .eq("status", "pendente")
          .in("gift_item_id", itemIds)
          .order("created_at", { ascending: false })
      : { data: [] };

  const eventCategories = await getEventCategories(eventId);
  const itemsWithNames = new Map((items ?? []).map((i) => [i.id, i.name]));
  const eventItems = (items ?? []) as GiftItem[];
  const totalValue = eventItems.reduce((acc, i) => acc + Number(i.price), 0);
  const compradoValue = eventItems
    .filter((i) => i.status === "comprado")
    .reduce((acc, i) => acc + Number(i.price), 0);
  const compradoCount = eventItems.filter((i) => i.status === "comprado").length;
  const disponivelCount = eventItems.filter((i) => i.status === "disponivel").length;

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-4"
      >
        <FiArrowLeft /> Voltar
      </Link>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
          <p className="text-sm text-gray-500">
            Gerenciar presentes • <Link href={`/lista/${event.slug}`} className="text-primary-600 hover:underline" target="_blank">Ver lista pública</Link>
          </p>
        </div>
      </div>
      <EventItemsManager
        event={event as Event}
        eventCategories={eventCategories}
        items={eventItems}
        stats={{
          totalValue,
          compradoValue,
          totalItems: eventItems.length,
          compradoCount,
          disponivelCount,
        }}
        pendingPixPurchases={(pendingPixPurchases ?? []).map((p) => ({
          id: p.id,
          gift_item_id: p.gift_item_id,
          item_name: itemsWithNames.get(p.gift_item_id) ?? "",
          buyer_name: p.buyer_name,
          amount: Number(p.amount),
          created_at: p.created_at,
        }))}
      />
    </div>
  );
}
