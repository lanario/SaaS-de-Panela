"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { createGiftItem, updateGiftItem } from "@/app/actions/gift-items";
import { getImageFromProductUrl } from "@/app/actions/fetch-product-image";
import type { Event, GiftItem } from "@/types/database";

interface GiftFormModalProps {
  event: Event;
  /** Quando definido, o modal abre em modo edição. */
  item?: GiftItem | null;
  /** Sugestões de categoria (padrão + já usadas no evento). O usuário pode digitar uma nova. */
  suggestedCategories?: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function GiftFormModal({
  event,
  item,
  suggestedCategories = [],
  open,
  onOpenChange,
  onSuccess,
}: GiftFormModalProps) {
  const [state, formAction] = useFormState(item ? updateGiftItem : createGiftItem, null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const productUrlRef = useRef<HTMLInputElement>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  const onSuccessRef = useRef(onSuccess);
  onOpenChangeRef.current = onOpenChange;
  onSuccessRef.current = onSuccess;

  const isEdit = Boolean(item);

  useEffect(() => {
    if (state && !state.error) {
      onOpenChangeRef.current(false);
      onSuccessRef.current?.();
    }
  }, [state]);

  useEffect(() => {
    if (open) {
      setImageUrl(item?.image_url ?? "");
      setImageError(null);
    }
  }, [open, item?.image_url, item?.id]);

  async function handleFetchImage() {
    const url = productUrlRef.current?.value?.trim();
    if (!url) {
      setImageError("Preencha o link do produto primeiro.");
      return;
    }
    setImageLoading(true);
    setImageError(null);
    try {
      const result = await getImageFromProductUrl(url);
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
      } else {
        setImageError(result.error ?? "Imagem não encontrada.");
      }
    } catch {
      setImageError("Erro ao buscar imagem.");
    } finally {
      setImageLoading(false);
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
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-dvh items-center justify-center p-4 py-8">
            <motion.div
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 max-h-[85vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
          <Dialog.Title className="text-lg font-bold text-gray-800 mb-1">
            {isEdit ? "Editar Presente 🎁" : "Adicionar Presente 🎁"}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-6">
            {isEdit
              ? "Altere os dados do item e salve."
              : "Adicione um item à lista de presentes."}
          </Dialog.Description>
          <form key={item?.id ?? "new"} action={formAction} className="space-y-4">
            <input type="hidden" name="event_id" value={event.id} readOnly />
            {item && <input type="hidden" name="gift_item_id" value={item.id} readOnly />}
            <div>
              <Label htmlFor="name" className="text-xs font-semibold text-gray-500 uppercase">
                Nome do Produto
              </Label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ex: Jogo de Panelas..."
                required
                defaultValue={item?.name}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-presentix-300"
              />
            </div>
            <div>
              <Label htmlFor="product_url" className="text-xs font-semibold text-gray-500 uppercase">
                Link do Produto
              </Label>
              <input
                ref={productUrlRef}
                id="product_url"
                name="product_url"
                type="url"
                placeholder="https://..."
                required
                defaultValue={item?.product_url}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-presentix-300"
              />
            </div>
            <div>
              <Label htmlFor="image_url" className="text-xs font-semibold text-gray-500 uppercase">
                URL da imagem (opcional)
              </Label>
              <div className="mt-1 flex gap-2">
                <input
                  id="image_url"
                  name="image_url"
                  type="url"
                  placeholder="Preencha o link acima e clique em Buscar, ou cole aqui"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-presentix-300"
                />
                <button
                  type="button"
                  onClick={handleFetchImage}
                  disabled={imageLoading}
                  className="shrink-0 px-3 py-2 text-sm font-semibold rounded-lg bg-presentix-100 text-presentix-800 hover:bg-presentix-200 transition disabled:opacity-50"
                >
                  {imageLoading ? "Buscando…" : "Buscar"}
                </button>
              </div>
              {imageError && (
                <p className="mt-1 text-xs text-amber-600" role="alert">
                  {imageError}
                </p>
              )}
              <p className="mt-0.5 text-xs text-gray-400">
                Clique em &quot;Buscar&quot; para preencher com a imagem do link, ou cole o link da foto.
              </p>
            </div>
            <div>
              <Label htmlFor="price" className="text-xs font-semibold text-gray-500 uppercase">
                Valor (R$)
              </Label>
              <input
                id="price"
                name="price"
                type="text"
                placeholder="0,00"
                required
                inputMode="decimal"
                defaultValue={item ? String(Number(item.price)) : undefined}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-presentix-300"
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-xs font-semibold text-gray-500 uppercase">
                Categoria
              </Label>
              <input
                id="category"
                name="category"
                list="category-list"
                type="text"
                placeholder="Ex: Cozinha, Eletrodomésticos ou digite uma nova"
                defaultValue={item?.category ?? ""}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-presentix-300"
                autoComplete="off"
              />
              <datalist id="category-list">
                {suggestedCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              <p className="mt-0.5 text-xs text-gray-400">
                Escolha uma sugestão ou digite o nome da categoria (ex: Decoração, Banheiro).
              </p>
            </div>
            <fieldset className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
              <legend className="text-xs font-semibold text-gray-500 uppercase">
                Opções na lista pública
              </legend>
              <p className="text-xs text-gray-400 -mt-1">
                Escolha o que os convidados podem fazer com este presente.
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="hidden"
                  name="allow_product_link"
                  value="off"
                />
                <input
                  type="checkbox"
                  name="allow_product_link"
                  value="on"
                  defaultChecked={item?.allow_product_link !== false}
                  className="rounded border-gray-300 text-presentix-600 focus:ring-presentix-300"
                />
                <span className="text-sm text-gray-700">Exibir link do produto (Comprar)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="hidden" name="allow_pix" value="off" />
                <input
                  type="checkbox"
                  name="allow_pix"
                  value="on"
                  defaultChecked={item?.allow_pix !== false}
                  className="rounded border-gray-300 text-presentix-600 focus:ring-presentix-300"
                />
                <span className="text-sm text-gray-700">Permitir pagamento por PIX</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="hidden" name="allow_reserve" value="off" />
                <input
                  type="checkbox"
                  name="allow_reserve"
                  value="on"
                  defaultChecked={item?.allow_reserve !== false}
                  className="rounded border-gray-300 text-presentix-600 focus:ring-presentix-300"
                />
                <span className="text-sm text-gray-700">Permitir reservar o presente</span>
              </label>
            </fieldset>
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
                className="flex-1 bg-presentix-700 text-white py-2 rounded-xl text-sm font-semibold hover:bg-presentix-800 transition"
              >
                {isEdit ? "Salvar" : "Adicionar"}
              </button>
            </div>
          </form>
            </motion.div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
