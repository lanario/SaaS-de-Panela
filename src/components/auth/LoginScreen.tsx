"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiCheck, FiGift, FiShield, FiUsers } from "react-icons/fi";
import { AuthAnimatedDots } from "./AuthAnimatedDots";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const panelItem = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

interface LoginScreenProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  backLink?: React.ReactNode;
}

const features = [
  { icon: FiGift, text: "Listas de presentes organizadas" },
  { icon: FiUsers, text: "Compartilhe com convidados" },
  { icon: FiShield, text: "Controle e privacidade" },
];

/**
 * Layout de tela de login/registro com fundo animado (estilo Aura), layout split e entradas em sequência.
 * Paleta Presentix: fundo branco, detalhes em rosa escuro; texto escuro em fundos claros.
 */
export function LoginScreen({
  title,
  description,
  children,
  footer,
  backLink,
}: LoginScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 md:py-12 relative overflow-hidden bg-white">
      {/* Orbs animados – rosa visível (CSS keyframes em globals.css) */}
      <div
        className="auth-bg-orb auth-bg-orb-1 w-[min(85vw,560px)] h-[min(85vw,560px)] bg-presentix-300/70"
        style={{ top: "5%", left: "-10%", animationDelay: "0s" }}
        aria-hidden
      />
      <div
        className="auth-bg-orb auth-bg-orb-2 w-[min(75vw,460px)] h-[min(75vw,460px)] bg-presentix-400/50"
        style={{ bottom: "5%", right: "-8%", animationDelay: "-5s" }}
        aria-hidden
      />
      <div
        className="auth-bg-orb auth-bg-orb-3 w-[min(60vw,320px)] h-[min(60vw,320px)] bg-presentix-200/80"
        style={{ top: "50%", left: "50%", marginLeft: "-min(30vw,160px)", marginTop: "-min(30vw,160px)" }}
        aria-hidden
      />
      <AuthAnimatedDots />

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
        {/* Coluna esquerda: formulário – entra da esquerda */}
        <motion.div
          className="flex flex-col items-center md:items-end"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-presentix-900/10 border border-gray-100 p-8"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={item}>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                  {title}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {description}
                </p>
              </motion.div>
              <motion.div variants={item}>{children}</motion.div>
              {footer && <motion.div variants={item}>{footer}</motion.div>}
            </motion.div>
          </motion.div>
          {backLink && (
            <motion.p
              className="text-center text-xs text-gray-400 mt-6 w-full max-w-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              {backLink}
            </motion.p>
          )}
        </motion.div>

        {/* Coluna direita: painel “Presentix” – entra da direita (só em desktop) */}
        <motion.div
          className="hidden md:flex flex-col justify-center px-4 lg:px-8"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-100 p-8 shadow-xl shadow-gray-200/50"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={panelItem} className="flex items-center gap-2 mb-2">
              <Image
                src="/presentix_logo.png"
                alt="Presentix"
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl object-contain"
              />
              <span className="text-lg font-bold text-gray-800">Presentix</span>
            </motion.div>
            <motion.p variants={panelItem} className="text-gray-600 text-sm mb-6">
              Junte-se a quem já organiza listas de presentes com facilidade.
            </motion.p>
            <ul className="space-y-3">
              {features.map((f, i) => (
                <motion.li
                  key={f.text}
                  variants={panelItem}
                  className="flex items-center gap-2 text-gray-700 text-sm"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-presentix-100 text-presentix-700 shrink-0">
                    <FiCheck className="text-sm" />
                  </span>
                  {f.text}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
