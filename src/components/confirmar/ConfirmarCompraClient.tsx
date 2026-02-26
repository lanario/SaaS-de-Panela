"use client";

import { useState } from "react";
import { confirmPurchaseByToken } from "@/app/actions/purchases";

interface ConfirmarCompraClientProps {
  token: string;
  itemName: string;
  amount: number;
  buyerName: string;
}

export function ConfirmarCompraClient({
  token,
  itemName,
  amount,
  buyerName,
}: ConfirmarCompraClientProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleConfirm() {
    setStatus("loading");
    setErrorMsg("");
    const result = await confirmPurchaseByToken(token);
    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Erro ao confirmar.");
    }
  }

  if (status === "success") {
    return (
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center text-4xl text-green-600">
          ✓
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Compra confirmada!</h1>
        <p className="text-gray-500 text-sm mb-6">
          O organizador foi notificado. Obrigado pelo presente! 🎁
        </p>
        <a
          href="/"
          className="inline-block rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition"
        >
          Voltar ao início
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-xl font-bold text-gray-800 mb-2">Marquei como comprado</h1>
      <p className="text-sm text-gray-500 mb-6">
        Clique no botão abaixo para confirmar que você já comprou este presente.
      </p>
      <div className="bg-primary-100 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-600 font-medium">{itemName}</p>
        <p className="text-lg font-bold text-primary-600 mt-1">R$ {amount.toFixed(2)}</p>
        {buyerName && (
          <p className="text-xs text-gray-500 mt-1">por {buyerName}</p>
        )}
      </div>
      {errorMsg && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4" role="alert">
          {errorMsg}
        </p>
      )}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={status === "loading"}
        className="w-full bg-primary-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Confirmando…" : "Sim, já comprei"}
      </button>
    </div>
  );
}
