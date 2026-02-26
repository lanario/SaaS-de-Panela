"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { reserveItem, type ReserveFormState } from "@/app/actions/purchases";
import type { GiftItem } from "@/types/database";
import type { Event } from "@/types/database";

interface ReserveModalProps {
  item: GiftItem;
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReserveModal({ item, event, open, onOpenChange }: ReserveModalProps) {
  const [state, formAction] = useFormState(reserveItem, null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (state?.confirmToken) {
      setCopied(false);
    }
  }, [state?.confirmToken]);

  function handleCopyLink() {
    if (state?.confirmToken && typeof window !== "undefined") {
      const url = `${window.location.origin}/confirmar-compra/${state.confirmToken}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 max-h-[85vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
          {!state?.confirmToken ? (
            <>
              <Dialog.Title className="text-lg font-bold text-gray-800 mb-1">
                Reservar este item
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mb-6">
                Informe seu nome para reservar. Após comprar, use o link que enviaremos para marcar como comprado.
              </Dialog.Description>
              <form action={formAction} className="space-y-4">
                <input type="hidden" name="gift_item_id" value={item.id} readOnly />
                <input type="hidden" name="event_slug" value={event.slug} readOnly />
                <div>
                  <Label htmlFor="buyer_name" className="text-xs font-semibold text-gray-500 uppercase">
                    Seu nome
                  </Label>
                  <input
                    id="buyer_name"
                    name="buyer_name"
                    type="text"
                    placeholder="Ex: Ana Paula"
                    required
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                {state?.error && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2" role="alert">
                    {state.error}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-primary-600 transition"
                  >
                    Reservar
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center text-3xl">
                  ✓
                </div>
                <Dialog.Title className="text-lg font-bold text-gray-800 mb-2">
                  Item reservado!
                </Dialog.Title>
                <p className="text-sm text-gray-500 mb-4">
                  Ao comprar, clique no link abaixo para marcar como comprado.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 text-left">
                  <p className="text-xs text-gray-500 mb-2">Guarde este link:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs font-mono text-gray-800 truncate">
                      {typeof window !== "undefined" && `${window.location.origin}/confirmar-compra/${state.confirmToken}`}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex-shrink-0 text-xs bg-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 transition"
                    >
                      {copied ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                </div>
                <a
                  href={`/confirmar-compra/${state.confirmToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:underline"
                >
                  Abrir página de confirmação →
                </a>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-full border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
              >
                Fechar
              </button>
            </>
          )}
            </motion.div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
