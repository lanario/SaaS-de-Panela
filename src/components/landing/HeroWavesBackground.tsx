"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Rosa mais escuro (presentix-700) para ondas visíveis e imersivas em fundo branco */
const WAVE_COLOR = "190, 24, 93";

interface WaveConfig {
  baseY: number;
  amplitude: number;
  frequency: number;
  phase0: number;
  lineWidth: number;
  alpha: number;
  speed: number;
}

/**
 * Ondas rosa em movimento para o fundo da hero (mais escuras para imersividade).
 * Respeita prefers-reduced-motion.
 */
export function HeroWavesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const sizeRef = useRef({ width: 0, height: 0 });
  const [reducedMotion] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const wavesRef = useRef<WaveConfig[]>([
    { baseY: 0.6, amplitude: 32, frequency: 0.016, phase0: 0, lineWidth: 1.4, alpha: 0.22, speed: 0.0007 },
    { baseY: 0.7, amplitude: 48, frequency: 0.012, phase0: 2, lineWidth: 1.2, alpha: 0.18, speed: -0.0006 },
    { baseY: 0.8, amplitude: 40, frequency: 0.014, phase0: 4, lineWidth: 1.25, alpha: 0.2, speed: 0.00055 },
    { baseY: 0.5, amplitude: 26, frequency: 0.02, phase0: 1, lineWidth: 1, alpha: 0.14, speed: -0.0008 },
    { baseY: 0.9, amplitude: 44, frequency: 0.011, phase0: 3, lineWidth: 1.1, alpha: 0.16, speed: 0.0006 },
    { baseY: 0.45, amplitude: 22, frequency: 0.022, phase0: 5, lineWidth: 0.95, alpha: 0.12, speed: 0.0005 },
    { baseY: 0.75, amplitude: 36, frequency: 0.015, phase0: 0.5, lineWidth: 1.15, alpha: 0.17, speed: -0.0005 },
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
        const steps = Math.min(140, Math.ceil(width / 3));
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * (width + 100) - 50;
          const y = y0 + wave.amplitude * Math.sin(x * wave.frequency + phase);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const alpha = reducedMotion ? wave.alpha : wave.alpha * (0.9 + 0.12 * Math.sin(t * 0.0009 + wave.phase0));
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
