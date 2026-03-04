import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicList } from "@/components/lista/PublicList";
import type { Event, GiftItem } from "@/types/database";

/** Parâmetro da URL: pode ser short_id (8 caracteres 0-9a-z) ou slug legado. */
const SHORT_ID_REGEX = /^[0-9a-z]{8}$/;

interface PageProps {
  params: { slug: string };
}

export default async function ListaPage({ params }: PageProps) {
  const param = params.slug;
  const supabase = await createClient();

  const isShortId = SHORT_ID_REGEX.test(param);

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq(isShortId ? "short_id" : "slug", param)
    .maybeSingle();

  if (eventError || !event) {
    notFound();
  }

  // URL antiga por slug: redireciona para a URL canônica com short_id
  if (!isShortId && event.short_id) {
    redirect(`/lista/${event.short_id}`);
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
