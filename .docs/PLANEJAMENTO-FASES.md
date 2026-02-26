# Planejamento em Fases — Sistema Chá de Panela / Chá de Casa Nova (SaaS)

Sistema para listas de presentes (chá de panela / chá de casa nova) com login, listas por evento, compra com validação e opção de pagamento via PIX (QR Code). Baseado no template em `template/Chá de Panela - Dashboard Template.jsx`.

---

## Stack Técnica

| Tecnologia        | Uso principal                                      |
|-------------------|----------------------------------------------------|
| Next.js 14        | App Router, Server Components, Server Actions      |
| TypeScript        | Tipagem estática (sem `any`)                       |
| Supabase          | Auth, PostgreSQL, RLS, Storage (fotos)             |
| TailwindCSS       | Estilização, responsivo                            |
| Recharts          | Gráficos no dashboard (progresso, categorias)       |
| React Icons       | Ícones                                             |
| Framer Motion     | Animações de UI (modais, cards, listas)            |
| GSAP + ScrollTrigger | Animações de scroll e landing                    |
| Radix UI          | Componentes acessíveis (modais, selects, toasts)   |
| Sharp             | Otimização de imagens (thumbnails de produtos)     |

---

## Modelo de Dados (visão geral)

- **users** — Supabase Auth (perfil: nome, avatar opcional).
- **events** — Um “chá” por evento: nome do casal/evento, data, slug público, id do dono, chave PIX (opcional).
- **gift_items** — Itens da lista: event_id, nome, link, preço, categoria, imagem (URL ou upload), status (disponivel | reservado | comprado), ordenação.
- **purchases** — Registro de compra/PIX: gift_item_id, comprador (user_id ou nome convidado), tipo (link | pix), status (pendente | pago_confirmado), valor, comprovante opcional.

---

## Fase 1 — Fundação e Autenticação

**Objetivo:** Projeto Next.js 14 configurado, Supabase conectado e login/registro funcionando.

### Entregas

1. **Setup do projeto**
   - Next.js 14 (App Router), TypeScript, ESLint, TailwindCSS.
   - Dependências: `@supabase/supabase-js`, `@supabase/ssr`, `recharts`, `react-icons`, `framer-motion`, `gsap`, `@radix-ui/*` (Dialog, Select, DropdownMenu, etc.), `sharp`.

2. **Supabase**
   - Criar projeto no Supabase.
   - Variáveis de ambiente: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Cliente Supabase para browser e para Server Components/Server Actions.

3. **Autenticação**
   - Páginas: `/login`, `/registro`, `/recuperar-senha`.
   - Fluxo: email/senha (Supabase Auth).
   - Middleware: proteger rotas `/dashboard`, `/dashboard/*` e redirecionar não autenticados para `/login`.
   - Após login: redirecionar para `/dashboard`.

4. **Layout base**
   - Layout raiz com fontes e tema (ex.: rose/pink alinhado ao template).
   - Layout do dashboard: sidebar ou header com navegação e área de conteúdo.
   - Componente de “logout” no header/sidebar.

**Critério de conclusão:** Usuário consegue se registrar, fazer login e acessar uma área restrita (ex.: dashboard vazio).

---

## Fase 2 — Modelo de Dados e CRUD de Eventos

**Objetivo:** Schema no Supabase e telas para o usuário criar/editar seus eventos (listas de chá de panela).

### Entregas

1. **Schema Supabase (SQL)**
   - Tabela `profiles`: `id` (uuid, FK auth.users), `full_name`, `avatar_url`, `created_at`, `updated_at`.
   - Tabela `events`: `id` (uuid), `owner_id` (FK profiles), `title` (ex.: "Ana & Pedro"), `slug` (único, para URL pública), `event_date`, `pix_key` (opcional), `pix_key_type` (cpf, email, phone, random), `created_at`, `updated_at`.
   - Trigger para criar `profile` ao inserir usuário em `auth.users`.

2. **Row Level Security (RLS)**
   - `profiles`: usuário lê/atualiza apenas o próprio perfil.
   - `events`: usuário lê/atualiza/apaga apenas eventos onde `owner_id = auth.uid()`; leitura pública por `slug` (para página da lista).

3. **CRUD de eventos**
   - Página `/dashboard` listando eventos do usuário (cards ou tabela).
   - Criar evento: nome, data, slug (gerado ou editável com validação de unicidade).
   - Editar evento: mesmo formulário; opcionalmente já incluir campos para chave PIX (Fase 5 pode detalhar).
   - Excluir evento (com confirmação).

**Critério de conclusão:** Usuário logado cria, edita e vê seus eventos; eventos acessíveis apenas pelo dono na dashboard.

---

## Fase 3 — Lista Pública e Gestão de Presentes

**Objetivo:** Página pública da lista (por slug) e gestão de itens pelo dono, alinhada ao template.

### Entregas

1. **Tabela `gift_items`**
   - Campos: `id`, `event_id`, `name`, `product_url`, `price` (decimal), `category`, `image_url` (nullable), `status` (enum: disponivel, reservado, comprado), `sort_order`, `created_at`, `updated_at`.
   - RLS: dono do evento pode inserir/atualizar/apagar; qualquer um pode ler itens do evento (lista pública).

2. **Página pública `/lista/[slug]`**
   - Server Component: buscar evento por `slug` e itens com `status` e ordenação.
   - Se evento não existir: 404.
   - UI baseada no template: header com título do evento (ex.: "Lista de Presentes • Ana & Pedro"), stats (total de itens, comprados, disponíveis), barra de progresso (valor comprado vs total), filtro por categoria (Todos + categorias dos itens), grid de cards de presentes.
   - Cada card: imagem (placeholder ou `image_url`), categoria, nome, preço, status (badge), comprador (se houver), botões "Comprar" (link externo) e "Pix" (abre modal na Fase 5).

3. **Dashboard — gestão de itens**
   - Em `/dashboard/eventos/[id]` ou dentro do evento: seção “Presentes” com opção “Adicionar presente”.
   - Modal “Adicionar Presente” (como no template): Nome, Link do produto, Valor (R$), Categoria (select). Salvar via Server Action em `gift_items`.
   - Listagem em tabela (admin): produto, valor, categoria, status, comprador (quando houver). Permitir editar status manualmente (disponível / reservado / comprado) e, se necessário, comprador (para PIX confirmado manualmente).

4. **Categorias**
   - Lista fixa ou tabela `categories` por evento; no início pode ser lista fixa no front (ex.: Cozinha, Eletrodomésticos, Mesa Posta, Cama/Banho) como no template.

**Critério de conclusão:** Dono adiciona/edita itens; qualquer pessoa com o link `/lista/[slug]` vê a lista com stats, progresso e cards; botão “Comprar” abre o link do produto.

---

## Fase 4 — Reserva e Validação de Compra (Link)

**Objetivo:** Convidado pode reservar/item e marcar como “comprado” para validar; dono pode confirmar ou ajustar.

### Entregas

1. **Tabela `purchases`**
   - Campos: `id`, `gift_item_id`, `buyer_user_id` (nullable), `buyer_name` (para convidado sem conta), `payment_type` (link | pix), `status` (pendente | confirmado), `amount`, `confirmed_at`, `created_at`.
   - RLS: inserção para usuário autenticado ou “convidado” (por token/sessão limitada ou apenas nome); leitura/atualização conforme regras (dono vê tudo; comprador vê as próprias).

2. **Fluxo “Vou comprar pelo link”**
   - Na lista pública: ao clicar “Comprar”, opcionalmente antes ou depois mostrar “Reservar este item” (registra em `purchases` com status pendente e marca item como `reservado`).
   - Página ou modal “Confirmar compra”: convidado informa nome (e opcionalmente email); ao confirmar, cria `purchase` e atualiza `gift_item.status` para `reservado`.
   - Página “Marquei como comprado” (link enviado por email ou exibido após reservar): token único por `purchase` ou login. Botão “Já comprei” atualiza `purchase.status` para confirmado e `gift_item.status` para `comprado`, e preenche `buyer_name`/`buyer_user_id` no item para exibição.

3. **Validação pelo dono**
   - No painel admin do evento: para itens reservados ou com compra pendente, dono pode marcar manualmente como “Comprado” e opcionalmente informar nome do comprador (override).

**Critério de conclusão:** Convidado reserva item comprado por link; pode marcar como “já comprei”; dono vê comprador e pode alterar status manualmente.

---

## Fase 5 — PIX (Chave e QR Code)

**Objetivo:** Dono cadastra chave PIX do evento; na lista pública, convidado pode pagar via PIX (ver valor e QR/copia-e-cola) e registrar intenção de pagamento.

### Entregas

1. **Chave PIX no evento**
   - Campos já previstos em `events`: `pix_key`, `pix_key_type`. Formulário de edição do evento para preenchê-los (e exibir mascarado na lista pública se necessário).

2. **Modal PIX na lista pública (como no template)**
   - Ao clicar “Pix” no card: abrir modal (Radix Dialog) com nome do presente, valor (R$), chave PIX (ex.: celular) com botão “Copiar”, e QR Code estático para o valor do item (PIX Copia e Cola).
   - Geração de QR Code: usar lib (ex.: `qrcode.react` ou `qrcode`) com payload PIX (em formato BR Code / Copia e Cola). Payload pode ser gerado em Server Action a partir de chave + valor + descrição (nome do item).
   - Texto no modal: “Após o pagamento, o presente pode ser marcado como comprado pelo organizador ou você pode enviar comprovante.”

3. **Registro de intenção de pagamento por PIX**
   - No modal: botão “Já enviei o PIX” ou “Vou pagar por PIX” que cria registro em `purchases` com `payment_type = pix`, `status = pendente`, e opcionalmente marca item como `reservado` até confirmação.
   - Opcional: upload de comprovante (Supabase Storage) vinculado a `purchases` para o dono aprovar.

4. **Confirmação de PIX pelo dono**
   - No painel do evento: listar compras PIX pendentes; dono pode marcar como “Confirmado” (atualiza `purchase` e `gift_item.status` para comprado).

**Critério de conclusão:** Convidado vê valor e QR/copia-e-cola PIX por item; pode registrar que vai pagar/enviou PIX; dono confirma e item aparece como comprado.

---

## Fase 6 — Dashboard Admin e Gráficos

**Objetivo:** Painel completo para o dono com tabela de itens, ações e gráficos (Recharts).

### Entregas

1. **Painel do evento (admin)**
   - Visão consolidada: tabela de itens com produto, valor, categoria, status, comprador, ações (editar status, editar item, ver compra).
   - Filtros por status e categoria.
   - Uso de Radix para selects e diálogos.

2. **Gráficos (Recharts)**
   - Progresso da lista: valor comprado vs total (barra ou pizza).
   - Itens comprados por categoria (barra horizontal ou pizza).
   - Opcional: evolução no tempo (compras por dia/semana) se houver dados de `confirmed_at`.

3. **Resumo financeiro**
   - Total da lista, total comprado, total restante; exibição clara no topo do painel.

**Critério de conclusão:** Dono gerencia todos os itens e compras pelo painel e vê gráficos de progresso e categorias.

---

## Fase 7 — UX, Animações e Otimização de Imagens

**Objetivo:** Interface polida, acessível e performática, alinhada ao template visual.

### Entregas

1. **Framer Motion**
   - Animações em modais (abertura/fechamento), cards da lista (entrada em lista, hover).
   - Transições suaves entre views (lista vs admin).

2. **GSAP + ScrollTrigger**
   - Uso na landing ou na página pública (ex.: seção de boas-vindas, contador de itens) para efeitos no scroll; evitar excessos para manter performance.

3. **Radix UI**
   - Garantir que todos os modais, selects e dropdowns usem Radix (acessibilidade e teclado).
   - Toasts para feedback (ex.: “Presente adicionado”, “Status atualizado”).

4. **Sharp (imagens)**
   - Se houver upload de imagem do produto ou uso de `image_url`: rota de otimização (Next.js Image + Sharp) para thumbnails nos cards.
   - Fallback para placeholder quando não houver imagem (como no template).

5. **Responsividade e acessibilidade**
   - Layout responsivo (grid 2 colunas no mobile como no template, mais no desktop).
   - Contraste, foco e labels para leitores de tela.

**Critério de conclusão:** Animações discretas e consistentes; componentes acessíveis; imagens otimizadas onde aplicável.

---

## Fase 8 — SaaS e Multi-tenant (opcional)

**Objetivo:** Limites por plano e monetização, se desejado.

### Entregas (resumidas)

1. **Planos**
   - Ex.: Free (1 evento, até N itens), Pro (múltiplos eventos, itens ilimitados, PIX destacado).

2. **Contagem e limites**
   - Middleware ou Server Action: antes de criar evento/item, checar limite do perfil/plano.

3. **Billing (futuro)**
   - Integração com Stripe ou similar para plano pago; não obrigatório na primeira versão.

**Critério de conclusão:** Limites aplicados por plano; fluxo de upgrade preparado ou documentado.

---

## Ordem de Execução Recomendada

| Ordem | Fase                                      | Dependência principal     |
|-------|-------------------------------------------|---------------------------|
| 1     | Fase 1 — Fundação e Autenticação          | —                         |
| 2     | Fase 2 — Modelo de Dados e CRUD de Eventos| Fase 1                    |
| 3     | Fase 3 — Lista Pública e Gestão de Presentes | Fase 2                  |
| 4     | Fase 4 — Reserva e Validação de Compra    | Fase 3                    |
| 5     | Fase 5 — PIX (Chave e QR Code)            | Fase 3                    |
| 6     | Fase 6 — Dashboard Admin e Gráficos       | Fases 3, 4, 5             |
| 7     | Fase 7 — UX, Animações e Imagens          | Fases 1–6                 |
| 8     | Fase 8 — SaaS (opcional)                  | Fases 1–6                 |

---

## Referência Rápida — Template

- **Estrutura de item:** `id`, `name`, `link`, `image`, `price`, `category`, `status` (disponivel | reservado | comprado), `buyer`.
- **Categorias:** Todos, Cozinha, Eletrodomésticos, Mesa Posta, Cama/Banho.
- **UI:** Header com título e botões “Ver Lista” / “Gerenciar” e “Adicionar”; stats em 3 cards; barra de progresso; tabela admin; filtro por categoria; grid de cards com Comprar/Pix; modais Adicionar Presente e PIX (valor, chave, QR).

Este documento serve como guia passo a passo; cada fase pode ser quebrada em tarefas menores no backlog (issues/tasks) conforme a equipe for implementando.
