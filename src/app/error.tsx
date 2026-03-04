"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";

/**
 * Error boundary na raiz da aplicação.
 * Captura exceções do cliente e exibe a mensagem real para facilitar debug
 * (especialmente após HMR ao salvar arquivos).
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";
  const message = error?.message ?? "Erro desconhecido";
  const stack = error?.stack;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-dots-pattern">
      <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 shadow-lg">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
          <FiAlertCircle className="text-2xl" aria-hidden />
        </span>
        <h1 className="text-xl font-semibold text-red-900 mb-2">
          Erro na aplicação
        </h1>
        <p className="text-sm text-red-700 mb-4">
          Ocorreu uma exceção no cliente. Veja os detalhes abaixo e o console do navegador (F12).
        </p>
        {isDev && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 text-left overflow-auto max-h-48">
            <p className="text-xs font-mono text-red-800 break-words mb-2">
              <strong>Mensagem:</strong> {message}
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-red-600 mb-2">
                <strong>Digest:</strong> {error.digest}
              </p>
            )}
            {stack && (
              <pre className="text-xs font-mono text-red-700 whitespace-pre-wrap break-words">
                {stack}
              </pre>
            )}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
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
