-- Categorias por evento (o dono define as categorias para organizar os presentes)
CREATE TABLE IF NOT EXISTS public.event_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_categories_event_id ON public.event_categories(event_id);

-- Nome único por evento (case-insensitive)
CREATE UNIQUE INDEX idx_event_categories_event_name_lower
  ON public.event_categories (event_id, lower(trim(name)));

COMMENT ON TABLE public.event_categories IS 'Categorias customizadas por evento para organizar itens da lista.';

-- RLS
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dono gerencia categorias do evento"
  ON public.event_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_categories.event_id
      AND events.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_categories.event_id
      AND events.owner_id = auth.uid()
    )
  );

-- Leitura pública (para exibir filtros na lista pública)
CREATE POLICY "Leitura pública de categorias"
  ON public.event_categories FOR SELECT
  USING (true);
