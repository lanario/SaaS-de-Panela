"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface BokehCircle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  phase: number;
  alpha: number;
  hue: "pink" | "gray";
}

/** Cores: rosa Presentix e cinza suave para bokeh em fundo escuro */
const PINK_RGB = "236, 72, 153"; // presentix-500
const GRAY_RGB = "148, 163, 184"; // slate-400

/**
 * Fundo hero com círculos bokeh animados (difusos, em tons de rosa e cinza).
 * Respeita prefers-reduced-motion.
 */
export function HeroBokehBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circlesRef = useRef<BokehCircle[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const animationRef = useRef<number>(0);
  const [reducedMotion] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const initCircles = useCallback((width: number, height: number): BokehCircle[] => {
    const count = 14 + Math.floor((width * height) / 180000);
    const circles: BokehCircle[] = [];
    for (let i = 0; i < count; i++) {
      circles.push({
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        x: 0,
        y: 0,
        radius: 60 + Math.random() * 140,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.04 + Math.random() * 0.12,
        hue: Math.random() > 0.5 ? "pink" : "gray",
      });
    }
    return circles;
  }, []);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, t: number) => {
      ctx.clearRect(0, 0, width, height);
      const circles = circlesRef.current;
      const motion = reducedMotion ? 0 : t * 0.00015;

      for (let i = 0; i < circles.length; i++) {
        const c = circles[i];
        c.x = c.baseX + 40 * Math.sin(c.phase + motion) + 20 * Math.cos(c.phase * 0.7 + motion * 1.2);
        c.y = c.baseY + 30 * Math.cos(c.phase * 0.8 + motion * 0.9);
        const pulse = reducedMotion ? 1 : 0.85 + 0.2 * Math.sin(t * 0.001 + c.phase);
        const r = c.radius * pulse;
        const rgb = c.hue === "pink" ? PINK_RGB : GRAY_RGB;
        const gradient = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
        gradient.addColorStop(0, `rgba(${rgb}, ${c.alpha * 0.9})`);
        gradient.addColorStop(0.5, `rgba(${rgb}, ${c.alpha * 0.4})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
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
      circlesRef.current = initCircles(width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    let start: number | null = null;
    function loop(now: number) {
      if (start === null) start = now;
      draw(context, sizeRef.current.width, sizeRef.current.height, now - start);
      animationRef.current = requestAnimationFrame(loop);
    }
    animationRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initCircles, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
      style={{ background: "transparent" }}
    />
  );
}
