"use client";

import Link from "next/link";
import Image from "next/image";
import { FiGift, FiList, FiUsers, FiArrowRight, FiInfo } from "react-icons/fi";
import { HeroBokehBackground } from "./HeroBokehBackground";
import { HeroWavesBackground } from "./HeroWavesBackground";

const heroIcons = [
  { Icon: FiGift, label: "Listas de presentes" },
  { Icon: FiList, label: "Organização" },
  { Icon: FiUsers, label: "Compartilhar" },
];

/**
 * Hero em tela cheia: tema branco com rosa (igual à tela de login),
 * duas colunas (título + ícones | CTA + descrição), personalidade Presentix.
 */
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <HeroBokehBackground />
      <HeroWavesBackground />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Coluna esquerda: label, título, ícones */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <Image
              src="/presentix_logo.png"
              alt="Presentix"
              width={48}
              height={48}
              className="h-10 w-auto md:h-12 object-contain"
              priority
            />
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Presentix
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight tracking-tight">
            Listas de{" "}
            <span className="text-presentix-600">Presentes</span>
            <br />
            Inteligentes
          </h1>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
            {heroIcons.map(({ Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm"
                title={label}
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-presentix-400 text-presentix-600">
                  <Icon className="text-xl" />
                </span>
                <span className="text-xs text-gray-600 hidden sm:block">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna direita: CTA */}
        <div className="text-center lg:text-left max-w-lg mx-auto lg:mx-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Solução moderna
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Organize seus eventos e presentes
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
            Crie listas de presentes, compartilhe com convidados e tenha controle total.
            Ideal para casamentos, aniversários e datas especiais—tudo em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center sm:items-stretch">
            <span className="gradient-beam-wrap">
              <Link
                href="/registro"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-presentix-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-presentix-900/20 hover:bg-presentix-700 transition-colors"
              >
                Começar
                <FiArrowRight className="text-lg" />
              </Link>
            </span>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <FiInfo className="text-lg" />
              Já tenho conta
            </Link>
          </div>
          <p className="mt-10 text-xs text-gray-500 flex items-center justify-center lg:justify-start gap-1.5">
            <FiGift className="text-presentix-500" />
            Listas de presentes com privacidade e controle
          </p>
        </div>
      </div>

      <p className="absolute bottom-6 left-0 right-0 text-center text-xs text-gray-500">
        Powered by Infinity Lines
      </p>
    </section>
  );
}
