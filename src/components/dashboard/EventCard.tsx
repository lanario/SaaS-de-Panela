"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toaster";
import { parseLocalDate } from "@/lib/date";
import { EventCardView } from "./EventCardView";
import type { EventWithStats } from "@/types/database";

interface EventCardProps {
  event: EventWithStats;
}

function daysUntil(dateStr: string | null): number | null {
  const d = parseLocalDate(dateStr);
  if (!d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function EventCard({ event }: EventCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const totalItems = Number(event.totalItems) ?? 0;
  const boughtCount = Number(event.boughtCount) ?? 0;
  const listUrl = "/lista/" + (event.short_id ?? event.slug ?? "");
  const progressPercent =
    totalItems > 0 ? Math.round((boughtCount / totalItems) * 100) : 0;
  const daysLeft = daysUntil(event.event_date ?? null);

  const handleEditSuccess = () => {
    toast({ title: "Evento atualizado!", variant: "success" });
    router.refresh();
  };
  const handleDeleted = () => {
    toast({ title: "Evento excluído.", variant: "default" });
    router.refresh();
  };

  const badgeClass =
    daysLeft === null
      ? ""
      : daysLeft < 0
        ? "bg-gray-100 text-gray-600"
        : daysLeft <= 7
          ? "bg-presentix-200 text-presentix-800"
          : "bg-presentix-100 text-presentix-700";
  const badgeLabel =
    daysLeft === null ? "" : daysLeft < 0 ? "Encerrado" : daysLeft === 0 ? "Hoje" : "Faltam " + daysLeft + " dias";

  return (
    <EventCardView
      event={{ ...event, totalItems, boughtCount, totalRaised: Number(event.totalRaised) ?? 0 }}
      listUrl={listUrl}
      progressPercent={progressPercent}
      daysLeft={daysLeft}
      badgeClass={badgeClass}
      badgeLabel={badgeLabel}
      editOpen={editOpen}
      setEditOpen={setEditOpen}
      deleteOpen={deleteOpen}
      setDeleteOpen={setDeleteOpen}
      onEditSuccess={handleEditSuccess}
      onDeleted={handleDeleted}
    />
  );
}
