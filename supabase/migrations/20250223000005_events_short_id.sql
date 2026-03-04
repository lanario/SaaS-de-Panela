-- short_id: identificador único na URL da lista (diferencia casais com mesmo slug)
-- slug deixa de ser UNIQUE para permitir mesmo nome para eventos diferentes

-- 1. Adicionar coluna short_id (nullable para preencher existentes)
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS short_id text;

-- 2. Preencher short_id para eventos existentes (8 caracteres hex únicos)
DO $$
DECLARE
  r record;
  new_id text;
  done int;
BEGIN
  FOR r IN SELECT id FROM public.events WHERE short_id IS NULL
  LOOP
    done := 0;
    WHILE done = 0 LOOP
      new_id := substr(encode(gen_random_bytes(4), 'hex'), 1, 8);
      BEGIN
        UPDATE public.events SET short_id = new_id WHERE id = r.id;
        done := 1;
      EXCEPTION WHEN unique_violation THEN
        NULL; -- tenta outro id
      END;
    END LOOP;
  END LOOP;
END $$;

-- 3. Garantir que todos tenham short_id e tornar NOT NULL + UNIQUE
UPDATE public.events SET short_id = substr(md5(id::text), 1, 8) WHERE short_id IS NULL;
ALTER TABLE public.events ALTER COLUMN short_id SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_short_id ON public.events(short_id);

-- 4. Remover UNIQUE do slug (slug pode repetir; short_id identifica o evento)
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_slug_key;

-- 5. Trigger: gerar short_id em novos inserts se não informado
CREATE OR REPLACE FUNCTION public.set_event_short_id()
RETURNS trigger AS $$
DECLARE
  new_id text;
  done int := 0;
BEGIN
  IF NEW.short_id IS NULL OR NEW.short_id = '' THEN
    WHILE done = 0 LOOP
      new_id := substr(encode(gen_random_bytes(4), 'hex'), 1, 8);
      IF NOT EXISTS (SELECT 1 FROM public.events WHERE short_id = new_id) THEN
        NEW.short_id := new_id;
        done := 1;
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_event_short_id_trigger ON public.events;
CREATE TRIGGER set_event_short_id_trigger
  BEFORE INSERT ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_event_short_id();
