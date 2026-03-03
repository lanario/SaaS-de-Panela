"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Cor das ondas (rosa Presentix) – visível em fundo branco */
const WAVE_COLOR = "157, 23, 77";

interface WaveConfig {
  baseY: number; // 0–1, fração da altura
  amplitude: number;
  frequency: number;
  phase0: number;
  lineWidth: number;
  alpha: number;
  speed: number;
}

/**
 * Fundo animado com ondas senoidais fluidas (estilo Aura/signup).
 * Várias linhas onduladas deslizam horizontalmente; fundo permanece branco.
 * Respeita prefers-reduced-motion.
 */
export function AuthAnimatedDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const sizeRef = useRef({ width: 0, height: 0 });
  const [reducedMotion] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const wavesRef = useRef<WaveConfig[]>([
    { baseY: 0.72, amplitude: 28, frequency: 0.018, phase0: 0, lineWidth: 1.2, alpha: 0.14, speed: 0.00065 },
    { baseY: 0.78, amplitude: 42, frequency: 0.014, phase0: 2, lineWidth: 1, alpha: 0.1, speed: -0.00055 },
    { baseY: 0.85, amplitude: 35, frequency: 0.016, phase0: 4, lineWidth: 1.1, alpha: 0.12, speed: 0.0005 },
    { baseY: 0.65, amplitude: 22, frequency: 0.02, phase0: 1, lineWidth: 0.9, alpha: 0.08, speed: -0.0007 },
    { baseY: 0.92, amplitude: 38, frequency: 0.012, phase0: 3, lineWidth: 1, alpha: 0.09, speed: 0.0006 },
    { baseY: 0.58, amplitude: 18, frequency: 0.022, phase0: 5, lineWidth: 0.8, alpha: 0.06, speed: 0.00045 },
  ]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, t: number) => {
      ctx.clearRect(0, 0, width, height);
      const waves = wavesRef.current;
      const motion = reducedMotion ? 0 : t;

      for (let w = 0; w < waves.length; w++) {
        const wave = waves[w];
        const y0 = wave.baseY * height;
        const phase = wave.phase0 + motion * wave.speed;
        ctx.beginPath();
        const steps = Math.min(120, Math.ceil(width / 4));
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * (width + 80) - 40;
          const y = y0 + wave.amplitude * Math.sin(x * wave.frequency + phase);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const alpha = reducedMotion ? wave.alpha : wave.alpha * (0.92 + 0.08 * Math.sin(t * 0.0008 + wave.phase0));
        ctx.strokeStyle = `rgba(${WAVE_COLOR}, ${alpha})`;
        ctx.lineWidth = wave.lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }
    },
    [reducedMotion]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const context: CanvasRenderingContext2D = ctx;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { width, height };
    };

    resize();
    window.addEventListener("resize", resize);

    let start: number | null = null;
    function loop(now: number) {
      if (start === null) start = now;
      const t = now - start;
      draw(context, sizeRef.current.width, sizeRef.current.height, t);
      animationRef.current = requestAnimationFrame(loop);
    }
    animationRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
      style={{ background: "transparent" }}
    />
  );
}
