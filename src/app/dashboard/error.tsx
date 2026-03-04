"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";
  const message = error?.message ?? "Erro desconhecido";

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50/80 p-8 text-center shadow-sm">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
          <FiAlertCircle className="text-2xl" aria-hidden />
        </span>
        <h2 className="text-lg font-semibold text-red-900 mb-2">
          Algo deu errado
        </h2>
        <p className="text-sm text-red-700 mb-4">
          Ocorreu um erro ao carregar esta página. Tente novamente ou volte ao início.
        </p>
        {isDev && (
          <p className="text-xs font-mono text-red-800 mb-6 text-left break-words bg-red-100/80 rounded-lg p-3">
            {message}
          </p>
        )}
        {!isDev && <div className="mb-6" />}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center h-11 px-5 rounded-xl text-sm font-semibold bg-presentix-700 text-white hover:bg-presentix-800 transition-colors"
          >
            Tentar novamente
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-11 px-5 rounded-xl text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Ir ao dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
