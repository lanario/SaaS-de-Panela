"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { deleteEvent } from "@/app/actions/events";
import type { Event } from "@/types/database";
import { FiTrash2 } from "react-icons/fi";

interface DeleteEventDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteEventDialog({ event, open, onOpenChange, onDeleted }: DeleteEventDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await deleteEvent(event.id);
      onOpenChange(false);
      onDeleted?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
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
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600">
              <FiTrash2 className="text-xl" />
            </div>
            <div>
              <Dialog.Title className="text-lg font-bold text-gray-800">
                Excluir evento?
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500">
                Esta ação não pode ser desfeita.
              </Dialog.Description>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            O evento <strong>&quot;{event.title}&quot;</strong> e todos os dados associados serão
            removidos permanentemente.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
              className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
            >
              {isDeleting ? "Excluindo…" : "Sim, excluir"}
            </button>
          </div>
            </motion.div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
