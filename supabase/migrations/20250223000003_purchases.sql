-- Tabela purchases (registro de compra/reserva)
CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_item_id uuid NOT NULL REFERENCES public.gift_items(id) ON DELETE CASCADE,
  buyer_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  buyer_name text,
  payment_type text NOT NULL DEFAULT 'link' CHECK (payment_type IN ('link', 'pix')),
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado')),
  amount decimal(10,2) NOT NULL,
  proof_url text,
  confirmed_at timestamptz,
  confirm_token text UNIQUE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_purchases_gift_item_id ON public.purchases(gift_item_id);
CREATE INDEX IF NOT EXISTS idx_purchases_confirm_token ON public.purchases(confirm_token);

-- Função para gerar token de confirmação
CREATE OR REPLACE FUNCTION public.gen_confirm_token()
RETURNS text AS $$
  SELECT encode(gen_random_bytes(24), 'base64url');
$$ LANGUAGE sql;

-- RLS purchases
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode inserir (convidado reserva com nome)
CREATE POLICY "Inserir purchase"
  ON public.purchases FOR INSERT
  WITH CHECK (true);

-- Dono do evento pode ver todas as compras do evento
CREATE POLICY "Dono vê purchases do evento"
  ON public.purchases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.gift_items gi
      JOIN public.events e ON e.id = gi.event_id
      WHERE gi.id = purchases.gift_item_id
      AND e.owner_id = auth.uid()
    )
  );

-- Comprador pode ver própria compra (por token ou buyer_user_id)
CREATE POLICY "Comprador vê própria purchase"
  ON public.purchases FOR SELECT
  USING (buyer_user_id = auth.uid());

-- Funções públicas para confirmação sem login (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_purchase_by_token(p_token text)
RETURNS TABLE (
  id uuid,
  gift_item_id uuid,
  buyer_name text,
  payment_type text,
  status text,
  amount decimal,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, gift_item_id, buyer_name, payment_type, status, amount, created_at
  FROM public.purchases
  WHERE confirm_token = p_token
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.confirm_purchase_by_token(p_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_purchase public.purchases%ROWTYPE;
BEGIN
  SELECT * INTO v_purchase
  FROM public.purchases
  WHERE confirm_token = p_token
  AND status = 'pendente'
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  UPDATE public.purchases
  SET status = 'confirmado', confirmed_at = now()
  WHERE id = v_purchase.id;

  UPDATE public.gift_items
  SET status = 'comprado',
      buyer_name = COALESCE(v_purchase.buyer_name, buyer_name),
      updated_at = now()
  WHERE id = v_purchase.gift_item_id;

  RETURN true;
END;
$$;

-- Permitir chamada anônima (página de confirmação pública)
GRANT EXECUTE ON FUNCTION public.get_purchase_by_token(text) TO anon;
GRANT EXECUTE ON FUNCTION public.confirm_purchase_by_token(text) TO anon;

-- Dono pode atualizar (confirmar PIX, etc)
CREATE POLICY "Dono atualiza purchases"
  ON public.purchases FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.gift_items gi
      JOIN public.events e ON e.id = gi.event_id
      WHERE gi.id = purchases.gift_item_id
      AND e.owner_id = auth.uid()
    )
  );
