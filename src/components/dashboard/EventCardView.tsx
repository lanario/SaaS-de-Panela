"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiExternalLink, FiSettings, FiGift, FiDollarSign } from "react-icons/fi";
import { EventFormModal } from "./EventFormModal";
import { DeleteEventDialog } from "./DeleteEventDialog";
import { parseLocalDate } from "@/lib/date";
import type { EventWithStats } from "@/types/database";

const COVER_GRADIENT =
  "linear-gradient(135deg, rgba(232,243,252,0.95) 0%, rgba(249,236,234,0.9) 50%, rgba(241,245,249,0.95) 100%)";

function formatDate(dateStr: string | null): string {
  const d = parseLocalDate(dateStr);
  if (!d) return "—";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

interface EventCardViewProps {
  event: EventWithStats;
  listUrl: string;
  progressPercent: number;
  daysLeft: number | null;
  badgeClass: string;
  badgeLabel: string;
  editOpen: boolean;
  setEditOpen: (v: boolean) => void;
  deleteOpen: boolean;
  setDeleteOpen: (v: boolean) => void;
  onEditSuccess: () => void;
  onDeleted: () => void;
}

export function EventCardView({
  event,
  listUrl,
  progressPercent,
  daysLeft,
  badgeClass,
  badgeLabel,
  editOpen,
  setEditOpen,
  deleteOpen,
  setDeleteOpen,
  onEditSuccess,
  onDeleted,
}: EventCardViewProps) {
  return (
    <div className="contents">
      <motion.article
        className="group relative rounded-2xl overflow-hidden border border-white/60 bg-white/70 backdrop-blur-md shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 20px 40px -12px rgba(107, 138, 90, 0.2), 0 0 0 1px rgba(255,255,255,0.8)",
        }}
      >
        <div
          className="h-32 w-full bg-cover bg-center"
          style={{ background: COVER_GRADIENT }}
          aria-hidden
        />
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg font-semibold text-gray-800 line-clamp-2 flex-1">
              {event.title}
            </h3>
            {daysLeft !== null && (
              <span className={"shrink-0 text-xs font-semibold px-2 py-1 rounded-full " + badgeClass}>
                {badgeLabel}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{formatDate(event.event_date)}</p>
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <FiGift className="text-serenity-400 shrink-0" aria-hidden />
              {event.boughtCount}/{event.totalItems} presentes
            </span>
            <span className="flex items-center gap-1">
              <FiDollarSign className="text-terracotta-400 shrink-0" aria-hidden />
              {"R$ " +
                event.totalRaised.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progresso da lista</span>
              <span className="font-semibold text-sage-500">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-500"
                initial={{ width: 0 }}
                animate={{ width: progressPercent + "%" }}
                transition={{ duration: 0.5, delay: 0.15 }}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 opacity-80 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
            <Link
              href={listUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold bg-sage-500 text-white hover:bg-sage-600 transition-colors shadow-sm"
            >
              <FiExternalLink className="shrink-0" /> Ver lista
            </Link>
            <Link
              href={"/dashboard/eventos/" + event.id}
              className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold border border-sage-300 text-sage-600 hover:bg-sage-50 transition-colors"
            >
              <FiSettings className="shrink-0" /> Gerenciar
            </Link>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-gray-200 text-gray-600 hover:bg-primary-100 hover:text-primary-600 hover:border-primary-200 transition-colors"
              aria-label="Editar evento"
            >
              <FiEdit2 className="text-sm" />
            </button>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
              aria-label="Excluir evento"
            >
              <FiTrash2 className="text-sm" />
            </button>
          </div>
        </div>
      </motion.article>
      <EventFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        event={event}
        onSuccess={onEditSuccess}
      />
      <DeleteEventDialog
        event={event}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={onDeleted}
      />
    </div>
  );
}
