-- Opções por presente: o dono escolhe se exibe link, PIX e reserva (cada um editável)
ALTER TABLE public.gift_items
  ADD COLUMN IF NOT EXISTS allow_product_link boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_pix boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_reserve boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.gift_items.allow_product_link IS 'Exibir botão/link do produto na lista pública';
COMMENT ON COLUMN public.gift_items.allow_pix IS 'Permitir pagamento por PIX neste item';
COMMENT ON COLUMN public.gift_items.allow_reserve IS 'Permitir reservar este presente';
