"use client";

import { motion } from "framer-motion";
import { FiCalendar, FiDollarSign, FiGift } from "react-icons/fi";

interface DashboardStatsProps {
  /** Quantidade de eventos ativos (do usuário). */
  activeEventsCount: number;
  /** Soma do valor arrecadado (R$) em todos os eventos. */
  totalRaised: number;
  /** Soma de presentes já comprados em todos os eventos. */
  giftsReceivedCount: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

/**
 * Três cards de resumo no topo do dashboard: eventos ativos, valor arrecadado e presentes recebidos.
 */
export function DashboardStats({
  activeEventsCount,
  totalRaised,
  giftsReceivedCount,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Eventos ativos",
      value: activeEventsCount,
      icon: FiCalendar,
      color: "text-sage-500",
      bgGlow: "shadow-[0_0_30px_-8px_rgba(107,138,90,0.35)]",
    },
    {
      label: "Valor arrecadado",
      value: `R$ ${totalRaised.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: FiDollarSign,
      color: "text-terracotta-500",
      bgGlow: "shadow-[0_0_30px_-8px_rgba(184,92,58,0.3)]",
    },
    {
      label: "Presentes recebidos",
      value: giftsReceivedCount,
      icon: FiGift,
      color: "text-serenity-400",
      bgGlow: "shadow-[0_0_30px_-8px_rgba(122,155,184,0.35)]",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={item}
          className="relative rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className={`inline-flex p-2 rounded-xl bg-white/80 ${stat.bgGlow}`}>
            <stat.icon className={`text-xl ${stat.color}`} aria-hidden />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-800 tabular-nums">
            {stat.value}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
