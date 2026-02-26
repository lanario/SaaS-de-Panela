# Chá de Panela — SaaS

Sistema de listas de presentes para chá de panela e chá de casa nova. Next.js 14, TypeScript, Supabase, TailwindCSS.

## Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)

## Configuração

1. **Clone/abra o projeto** e instale as dependências:

   ```bash
   npm install
   ```

2. **Supabase:** crie um projeto em [supabase.com/dashboard](https://supabase.com/dashboard).

3. **Variáveis de ambiente:** copie o exemplo e preencha com as credenciais do seu projeto:

   ```bash
   cp .env.local.example .env.local
   ```

   Edite `.env.local`:

   - `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto (Settings → API)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — chave anon/public

4. **Auth no Supabase:** em Authentication → Providers, deixe **Email** habilitado (padrão). Opcional: em URL Configuration, adicione sua URL de redirect (ex.: `http://localhost:3000`).

5. **Schema do banco:** no Supabase, vá em SQL Editor e execute, **nesta ordem**, o conteúdo de:
   - `supabase/migrations/20250223000001_profiles_events.sql` (tabelas `profiles` e `events`, trigger, RLS)
   - `supabase/migrations/20250223000002_gift_items.sql` (tabela `gift_items`, RLS)
   - `supabase/migrations/20250223000003_purchases.sql` (tabela `purchases`, funções de confirmação, RLS)

## Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

- **Página inicial:** links para Entrar e Criar conta.
- **Login / Registro / Recuperar senha:** em `/login`, `/registro`, `/recuperar-senha`.
- **Dashboard:** após login, em `/dashboard` (protegido). Cada evento tem "Ver lista" (pública) e "Gerenciar" (adicionar presentes, alterar status).
- **Lista pública:** `/lista/[slug]` — stats, barra de progresso, filtro por categoria, cards com Comprar, Reservar e Pix.
- **Confirmação:** `/confirmar-compra/[token]` — link enviado após reservar; convidado clica em "Já comprei" para confirmar.

## Build

```bash
npm run build
npm start
```

## Fases concluídas

**Fase 1**
- Next.js 14 (App Router), TypeScript, TailwindCSS, ESLint
- Cliente Supabase (browser + server) e middleware de sessão
- Páginas de autenticação: login, registro, recuperar senha
- Middleware protegendo `/dashboard`
- Layout raiz (tema rose) e layout do dashboard com menu e logout

**Fase 2**
- Tabelas `profiles` e `events` (migration em `supabase/migrations/`)
- Trigger para criar perfil ao registrar usuário
- RLS em profiles e events
- Dashboard com listagem de eventos
- Criar, editar e excluir eventos (com confirmação)
- Slug único para URL pública (`/lista/[slug]`)

**Fase 3**
- Tabela `gift_items` (nome, link, preço, categoria, status, buyer_name)
- Página pública `/lista/[slug]` — stats, barra de progresso, filtro por categoria, cards de presentes (Comprar + Pix)
- Dashboard `/dashboard/eventos/[id]` — adicionar, editar status, excluir presentes
- Modal PIX básico (chave, valor; QR Code na Fase 5)

**Fase 4**
- Tabela `purchases` (gift_item_id, buyer_name, payment_type, status, confirm_token)
- Fluxo Reservar: modal com nome → cria purchase + marca item como reservado
- Link de confirmação `/confirmar-compra/[token]` — convidado clica "Já comprei" → purchase e item atualizados
- Funções RPC `get_purchase_by_token` e `confirm_purchase_by_token` (acesso público)
- Dono continua podendo alterar status e comprador manualmente no painel

**Fase 5**
- Formulário de edição do evento: campos **Chave PIX** e **Tipo** (CPF, e-mail, celular, chave aleatória)
- Modal PIX na lista pública: QR Code (payload PIX Copia e Cola via `gpix`), botão copiar chave e copiar código PIX
- Botão **"Vou pagar por PIX"**: convidado informa nome → cria `purchase` (payment_type=pix, status=pendente) e marca item como reservado
- Painel do evento: bloco **Pagamentos PIX pendentes** com botão **Confirmar PIX** (atualiza purchase e item para comprado)
- Dependências: `gpix`, `qrcode.react`

**Fase 6**
- **Resumo financeiro** no topo do painel do evento: Total da lista, Comprado, Restante, % e itens comprados
- **Gráficos (Recharts):** pizza de progresso (valor comprado vs restante) e barras horizontais de itens comprados por categoria
- **Filtros** na tabela: por status (Todos, Disponível, Reservado, Comprado) e por categoria (Todos + categorias), com Radix Select
- Tabela de itens com mensagem quando não há itens ou quando os filtros não retornam resultados

Próximo passo: **Fase 7** — UX, animações e otimização. Ver [.docs/PLANEJAMENTO-FASES.md](.docs/PLANEJAMENTO-FASES.md).
