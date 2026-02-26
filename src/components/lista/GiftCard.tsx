"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import Image from "next/image";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { QRCodeSVG } from "qrcode.react";
import { STATUS_CONFIG } from "@/types/database";
import { ReserveModal } from "./ReserveModal";
import { generatePixPayload } from "@/app/actions/pix";
import { reserveByPix } from "@/app/actions/purchases";
import type { GiftItem } from "@/types/database";
import type { Event } from "@/types/database";

interface GiftCardProps {
  item: GiftItem;
  event: Event;
}

const PLACEHOLDER_IMAGE = "https://placehold.co/200x200/e4e4e7/71717a?text=Sem+imagem";

/** Domínios permitidos para next/Image (otimizado). Para outros, usamos <img>. */
const NEXT_IMAGE_ALLOWED_HOSTS = ["placehold.co", "supabase.co", "supabase.in"];

function isNextImageAllowed(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return NEXT_IMAGE_ALLOWED_HOSTS.some((h) => host === h || host.endsWith("." + h));
  } catch {
    return false;
  }
}

export function GiftCard({ item, event }: GiftCardProps) {
  const [pixOpen, setPixOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const config = STATUS_CONFIG[item.status];
  const isAvailable = item.status === "disponivel";
  const price = Number(item.price);

  const imageUrl = item.image_url && !imageError ? item.image_url : null;
  const useNextImage = imageUrl && isNextImageAllowed(imageUrl);
  const showPlaceholder = !imageUrl || imageError;

  return (
    <>
      <motion.div
        className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-shadow ${!isAvailable ? "opacity-70" : ""}`}
        whileHover={isAvailable ? { boxShadow: "0 10px 40px -12px rgba(0,0,0,0.15)" } : undefined}
      >
        <div className="relative">
          <div className="w-full h-40 relative bg-gray-100">
            {useNextImage ? (
              <Image
                src={imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            ) : showPlaceholder ? (
              <Image
                src={PLACEHOLDER_IMAGE}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            ) : (
              <img
                src={item.image_url!}
                alt={item.name}
                className="object-cover w-full h-full"
                onError={() => setImageError(true)}
              />
            )}
            <span
              className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${config.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </span>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <span className="text-xs text-primary-500 font-semibold uppercase mb-1">
            {item.category}
          </span>
          <h4 className="font-semibold text-gray-800 text-sm mb-1 leading-tight">{item.name}</h4>
          <p className="text-xl font-bold text-gray-900 mb-1">
            R$ {price.toFixed(2)}
          </p>
          {item.buyer_name && (
            <p className="text-xs text-gray-400 mb-3">por {item.buyer_name}</p>
          )}
          {!item.buyer_name && <div className="mb-3" />}
          <div className="mt-auto flex flex-wrap gap-2">
            {isAvailable ? (
              <>
                <a
                  href={item.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[80px] bg-primary-500 text-white text-xs font-semibold py-2 rounded-xl text-center hover:bg-primary-600 transition"
                >
                  🛒 Comprar
                </a>
                <button
                  type="button"
                  onClick={() => setReserveOpen(true)}
                  className="flex-1 min-w-[80px] border border-primary-300 text-primary-600 text-xs font-semibold py-2 rounded-xl hover:bg-primary-100 transition"
                  aria-label={`Reservar ${item.name}`}
                >
                  📌 Reservar
                </button>
                <button
                  type="button"
                  onClick={() => setPixOpen(true)}
                  className="flex-1 min-w-[80px] border border-primary-300 text-primary-600 text-xs font-semibold py-2 rounded-xl hover:bg-primary-100 transition"
                  aria-label={`Pagar com PIX: ${item.name}`}
                >
                  💸 Pix
                </button>
              </>
            ) : (
              <div className="flex-1 bg-gray-100 text-gray-400 text-xs font-semibold py-2 rounded-xl text-center cursor-not-allowed">
                {item.status === "reservado" ? "⏳ Reservado" : "✅ Já comprado"}
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <ReserveModal
        item={item}
        event={event}
        open={reserveOpen}
        onOpenChange={setReserveOpen}
      />
      <PixModal
        item={item}
        event={event}
        open={pixOpen}
        onOpenChange={setPixOpen}
      />
    </>
  );
}

interface PixModalProps {
  item: GiftItem;
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function PixModal({ item, event, open, onOpenChange }: PixModalProps) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [pixPayload, setPixPayload] = useState<string | null>(null);
  const [pixPayloadError, setPixPayloadError] = useState<string | null>(null);
  const [state, formAction] = useFormState(reserveByPix, null);
  const price = Number(item.price);
  const pixKey = event.pix_key ?? "—";

  useEffect(() => {
    if (open && event.pix_key && price > 0) {
      setPixPayload(null);
      setPixPayloadError(null);
      generatePixPayload({
        pixKey: event.pix_key,
        receiverName: event.title.slice(0, 25),
        amount: price,
        description: item.name.slice(0, 72),
      }).then((result) => {
        if ("payload" in result) {
          setPixPayload(result.payload);
        } else {
          setPixPayloadError(result.error);
        }
      });
    }
  }, [open, event.pix_key, event.title, price, item.name]);

  function handleCopyKey() {
    if (event.pix_key) {
      navigator.clipboard.writeText(event.pix_key);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  }

  function handleCopyPayload() {
    if (pixPayload) {
      navigator.clipboard.writeText(pixPayload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
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
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-bold text-gray-800">
              Enviar via Pix 💸
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
              >
                ×
              </button>
            </Dialog.Close>
          </div>
          <div className="bg-primary-100 rounded-xl p-4 mb-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Presente escolhido</p>
            <p className="font-semibold text-gray-800">{item.name}</p>
            <p className="text-2xl font-bold text-primary-600 mt-2">R$ {price.toFixed(2)}</p>
          </div>
          {event.pix_key ? (
            <>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-500 mb-1">Chave Pix</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-semibold text-gray-800 truncate">
                    {pixKey}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="flex-shrink-0 text-xs bg-primary-500 text-white px-3 py-1 rounded-lg hover:bg-primary-600 transition"
                  >
                    {copiedKey ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
              {pixPayloadError && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 mb-4">
                  {pixPayloadError}
                </p>
              )}
              {pixPayload && (
                <div className="bg-white rounded-xl p-4 mb-4 flex flex-col items-center border border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">QR Code PIX (Copia e Cola)</p>
                  <QRCodeSVG value={pixPayload} size={160} level="M" />
                  <button
                    type="button"
                    onClick={handleCopyPayload}
                    className="mt-3 text-xs bg-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 transition"
                  >
                    {copiedPayload ? "Código copiado!" : "Copiar código PIX"}
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-400 text-center mb-4">
                Após o pagamento, o organizador pode marcar como comprado ou você pode registrar abaixo.
              </p>
              <form action={formAction} className="space-y-3 border-t border-gray-100 pt-4">
                <input type="hidden" name="gift_item_id" value={item.id} readOnly />
                <input type="hidden" name="event_slug" value={event.slug} readOnly />
                <div>
                  <Label htmlFor="pix_buyer_name" className="text-xs font-semibold text-gray-500 uppercase">
                    Seu nome (para registrar que vai pagar por PIX)
                  </Label>
                  <input
                    id="pix_buyer_name"
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
                {state && !state.error && (
                  <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
                    Registrado! O organizador confirmará ao receber o PIX.
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-primary-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-primary-600 transition"
                >
                  Vou pagar por PIX
                </button>
              </form>
            </>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              O organizador ainda não configurou a chave PIX. Entre em contato para mais informações.
            </p>
          )}
            </motion.div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
