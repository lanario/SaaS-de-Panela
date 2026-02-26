-- Tabela gift_items (presentes da lista)
CREATE TABLE IF NOT EXISTS public.gift_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  product_url text NOT NULL,
  price decimal(10,2) NOT NULL,
  category text NOT NULL,
  image_url text,
  status text NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'comprado')),
  sort_order int DEFAULT 0,
  buyer_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gift_items_event_id ON public.gift_items(event_id);

-- RLS gift_items
ALTER TABLE public.gift_items ENABLE ROW LEVEL SECURITY;

-- Dono do evento pode inserir/atualizar/deletar
CREATE POLICY "Dono gerencia itens"
  ON public.gift_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = gift_items.event_id
      AND events.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = gift_items.event_id
      AND events.owner_id = auth.uid()
    )
  );

-- Qualquer um pode ler (lista pública)
CREATE POLICY "Leitura pública de itens"
  ON public.gift_items FOR SELECT
  USING (true);
