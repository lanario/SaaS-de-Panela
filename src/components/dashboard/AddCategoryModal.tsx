"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { createEventCategory } from "@/app/actions/event-categories";

interface AddCategoryModalProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddCategoryModal({
  eventId,
  open,
  onOpenChange,
  onSuccess,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Digite o nome da categoria.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await createEventCategory(eventId, trimmed);
      if (result.ok) {
        setName("");
        onOpenChange(false);
        onSuccess?.();
      } else {
        setError(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setName("");
      setError(null);
    }
    onOpenChange(newOpen);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
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
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
            <Dialog.Title className="text-lg font-bold text-gray-800 mb-1">
              Adicionar categoria
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mb-4">
              Crie categorias para organizar os itens da lista (ex: Cozinha, Eletrodomésticos).
            </Dialog.Description>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="category-name" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Nome da categoria
                </Label>
                <input
                  id="category-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Decoração"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2" role="alert">
                  {error}
                </p>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  disabled={isSubmitting}
                  className="flex-1 h-10 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-10 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Adicionando…" : "Adicionar"}
                </button>
              </div>
            </form>
            </motion.div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
