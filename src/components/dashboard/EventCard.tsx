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

  const listUrl = "/lista/" + event.slug;
  const progressPercent =
    event.totalItems > 0 ? Math.round((event.boughtCount / event.totalItems) * 100) : 0;
  const daysLeft = daysUntil(event.event_date);

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
        ? "bg-gray-100 text-gray-500"
        : daysLeft <= 7
          ? "bg-terracotta-200 text-terracotta-500"
          : "bg-sage-100 text-sage-500";
  const badgeLabel =
    daysLeft === null ? "" : daysLeft < 0 ? "Encerrado" : daysLeft === 0 ? "Hoje" : "Faltam " + daysLeft + " dias";

  return (
    <EventCardView
      event={event}
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
