"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { GiftCard } from "./GiftCard";
import type { Event, GiftItem } from "@/types/database";

function useScrollAnimation() {
  const statsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGsap = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      if (statsRef.current) {
        const cards = statsRef.current.querySelectorAll(".stat-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
            scrollTrigger: {
              trigger: progressRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    };
    loadGsap();
  }, []);

  return { statsRef, progressRef };
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemMotion = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

interface PublicListProps {
  event: Event;
  items: GiftItem[];
  stats: {
    total: number;
    comprados: number;
    compradosCount: number;
    disponiveis: number;
    totalCount: number;
  };
}

export function PublicList({ event, items, stats }: PublicListProps) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { statsRef, progressRef } = useScrollAnimation();

  const categoriesFilter = [
    "Todos",
    ...Array.from(new Set(items.map((i) => i.category))).sort(),
  ];

  const filtered =
    activeCategory === "Todos"
      ? items
      : items.filter((i) => i.category === activeCategory);

  const progressPercent =
    stats.total > 0 ? Math.round((stats.comprados / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-primary-100 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <h1 className="text-lg font-bold text-primary-600">🍳 Lista de Presentes</h1>
          <p className="text-xs text-gray-400">{event.title}</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-3 gap-3 mb-6">
          <div className="stat-card bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-primary-500">{stats.totalCount}</p>
            <p className="text-xs text-gray-400 mt-1">Total de Itens</p>
          </div>
          <div className="stat-card bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-500">{stats.compradosCount}</p>
            <p className="text-xs text-gray-400 mt-1">Comprados</p>
          </div>
          <div className="stat-card bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-yellow-500">{stats.disponiveis}</p>
            <p className="text-xs text-gray-400 mt-1">Disponíveis</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div ref={progressRef} className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Progresso da Lista
            </span>
            <span className="text-sm font-bold text-primary-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-400 to-primary-500 h-3 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>R$ {stats.comprados.toFixed(2)} arrecadados</span>
            <span>Meta: R$ {stats.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {categoriesFilter.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap text-xs font-semibold px-4 py-2 rounded-full transition ${
                activeCategory === cat
                  ? "bg-primary-500 text-white shadow-sm"
                  : "bg-white text-gray-500 hover:bg-primary-100 border border-gray-100"
              }`}
              aria-pressed={activeCategory === cat}
              aria-label={`Filtrar por categoria: ${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gift Grid */}
        <motion.div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filtered.map((item) => (
            <motion.div key={item.id} variants={itemMotion}>
              <GiftCard item={item} event={event} />
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">
              {activeCategory === "Todos"
                ? "Nenhum presente na lista ainda."
                : `Nenhum item na categoria "${activeCategory}".`}
            </p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
