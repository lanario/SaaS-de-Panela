import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EventsList } from "@/components/dashboard/EventsList";
import type { EventWithStats, EventStats } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-red-100 text-red-600">
        Erro ao carregar eventos: {error.message}
      </div>
    );
  }

  const list = events ?? [];
  const eventIds = list.map((e) => e.id);

  const statsByEvent: Record<string, EventStats> = {};
  list.forEach((e) => {
    statsByEvent[e.id] = { totalItems: 0, boughtCount: 0, totalRaised: 0 };
  });

  if (eventIds.length > 0) {
    const { data: items } = await supabase
      .from("gift_items")
      .select("event_id, status, price")
      .in("event_id", eventIds);

    items?.forEach((item) => {
      const s = statsByEvent[item.event_id];
      if (!s) return;
      s.totalItems += 1;
      if (item.status === "comprado") {
        s.boughtCount += 1;
        s.totalRaised += Number(item.price);
      }
    });
  }

  const eventsWithStats: EventWithStats[] = list.map((e) => ({
    ...e,
    ...statsByEvent[e.id],
  }));

  return <EventsList events={eventsWithStats} />;
}
