"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { EventCard } from "./EventCard";
import { EventFormModal } from "./EventFormModal";
import { DashboardStats } from "./DashboardStats";
import { useToast } from "@/components/ui/Toaster";
import type { EventWithStats } from "@/types/database";

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

interface EventsListProps {
  events: EventWithStats[];
}

export function EventsList({ events }: EventsListProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const totalRaised = events.reduce((acc, e) => acc + e.totalRaised, 0);
  const giftsReceived = events.reduce((acc, e) => acc + e.boughtCount, 0);

  function handleCreateSuccess() {
    toast({ title: "Evento criado!", variant: "success" });
    router.refresh();
  }

  return (
    <div className="min-h-[60vh]">
      {/* Header com stats */}
      <div className="mb-8">
        <DashboardStats
          activeEventsCount={events.length}
          totalRaised={totalRaised}
          giftsReceivedCount={giftsReceived}
        />
      </div>

      {/* Título e CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="font-serif text-2xl font-semibold text-gray-800">
          Meus eventos
        </h2>
        <motion.button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold bg-sage-500 text-white hover:bg-sage-600 transition-colors shadow-md shadow-sage-500/25 hover:shadow-lg hover:shadow-sage-500/30"
          aria-label="Criar novo evento"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiPlus className="text-lg shrink-0" /> Novo evento
        </motion.button>
      </div>

      {events.length === 0 ? (
        <motion.div
          className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md p-12 text-center shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-500 mb-6">Nenhum evento criado ainda.</p>
          <motion.button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold bg-sage-500 text-white hover:bg-sage-600 transition-colors shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiPlus className="text-lg" /> Criar primeiro evento
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          {events.map((event) => (
            <motion.div key={event.id} variants={cardVariants}>
              <EventCard event={event} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <EventFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
