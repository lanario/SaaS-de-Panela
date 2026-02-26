import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicList } from "@/components/lista/PublicList";
import type { Event, GiftItem } from "@/types/database";

interface PageProps {
  params: { slug: string };
}

export default async function ListaPage({ params }: PageProps) {
  const { slug } = params;

  const supabase = await createClient();

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (eventError || !event) {
    notFound();
  }

  const { data: items } = await supabase
    .from("gift_items")
    .select("*")
    .eq("event_id", event.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const total = (items ?? []).reduce((acc, i) => acc + Number(i.price), 0);
  const comprados = (items ?? []).filter((i) => i.status === "comprado").reduce((acc, i) => acc + Number(i.price), 0);
  const disponiveis = (items ?? []).filter((i) => i.status === "disponivel").length;
  const compradosCount = (items ?? []).filter((i) => i.status === "comprado").length;

  return (
    <PublicList
      event={event as Event}
      items={(items ?? []) as GiftItem[]}
      stats={{
        total,
        comprados,
        compradosCount,
        disponiveis,
        totalCount: items?.length ?? 0,
      }}
    />
  );
}
