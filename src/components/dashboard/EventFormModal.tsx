"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { createEvent, updateEvent } from "@/app/actions/events";
import type { Event } from "@/types/database";

interface EventFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
  onSuccess?: () => void;
}

export function EventFormModal({ open, onOpenChange, event, onSuccess }: EventFormModalProps) {
  const isEdit = Boolean(event?.id);
  const action = isEdit ? updateEvent : createEvent;

  const [state, formAction] = useFormState(action, null);

  useEffect(() => {
    if (state && !state.error) {
      onOpenChange(false);
      onSuccess?.();
    }
  }, [state, onOpenChange, onSuccess]);

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
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 max-h-[85vh] overflow-y-auto flex flex-col"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
          <Dialog.Title className="text-lg font-bold text-gray-800 mb-1">
            {isEdit ? "Editar evento" : "Novo evento"}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-5">
            {isEdit ? "Atualize os dados do seu chá de panela." : "Crie sua lista de presentes."}
          </Dialog.Description>
          <form action={formAction} className="flex flex-col flex-1 min-h-0">
            {isEdit && <input type="hidden" name="id" value={event!.id} readOnly />}
            <div className="overflow-y-auto pr-1 space-y-5 flex-1">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Título
              </Label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={event?.title}
                placeholder="Ex: Ana & Pedro"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Slug (URL)
              </Label>
              <input
                id="slug"
                name="slug"
                type="text"
                defaultValue={event?.slug}
                placeholder="ana-pedro"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 leading-relaxed">
                Usado na URL: /lista/[slug]. Deixe em branco para gerar do título.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="event_date" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Data do evento
              </Label>
              <input
                id="event_date"
                name="event_date"
                type="date"
                defaultValue={event?.event_date ?? ""}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent [color-scheme:light]"
                lang="pt-BR"
              />
              <p className="text-xs text-gray-400 leading-relaxed">
                Formato: dia / mês / ano.
              </p>
            </div>
            {isEdit && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="pix_key" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Chave PIX
                  </Label>
                  <input
                    id="pix_key"
                    name="pix_key"
                    type="text"
                    defaultValue={event?.pix_key ?? ""}
                    placeholder="CPF, e-mail, celular ou chave aleatória"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Para receber pagamentos por PIX na lista de presentes.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pix_key_type" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Tipo da chave PIX
                  </Label>
                  <select
                    id="pix_key_type"
                    name="pix_key_type"
                    defaultValue={event?.pix_key_type ?? ""}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent bg-white"
                  >
                    <option value="">Selecione</option>
                    <option value="cpf">CPF</option>
                    <option value="email">E-mail</option>
                    <option value="phone">Celular</option>
                    <option value="random">Chave aleatória</option>
                  </select>
                </div>
              </>
            )}
            </div>
            {state?.error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-3 shrink-0" role="alert">
                {state.error}
              </p>
            )}
            <div className="flex gap-2 pt-4 shrink-0">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-10 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 h-10 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors"
              >
                {isEdit ? "Salvar" : "Criar"}
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
