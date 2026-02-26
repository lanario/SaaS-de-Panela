# Modelo de Dados — Sistema Chá de Panela

Resumo das tabelas Supabase (PostgreSQL) e relações para implementação.

---

## Diagrama (texto)

```
auth.users (Supabase)
    │
    └── profiles (1:1)
            │
            └── events (1:N)  "listas de chá"
                    │
                    ├── gift_items (1:N)  "presentes"
                    │         │
                    │         └── purchases (1:N)  "quem comprou / PIX"
                    │
                    └── (pix_key no event)
```

---

## Tabelas

### `profiles`

| Coluna       | Tipo      | Descrição                    |
|-------------|-----------|------------------------------|
| id          | uuid (PK) | = auth.uid()                  |
| full_name   | text      | Nome do usuário              |
| avatar_url  | text      | URL do avatar (opcional)      |
| created_at  | timestamptz | |
| updated_at  | timestamptz | |

---

### `events`

| Coluna       | Tipo      | Descrição                    |
|-------------|-----------|------------------------------|
| id          | uuid (PK) | default gen_random_uuid()    |
| owner_id    | uuid (FK → profiles) | Dono da lista |
| title       | text      | Ex.: "Ana & Pedro"           |
| slug        | text (UNIQUE) | URL: /lista/[slug]       |
| event_date  | date      | Data do chá                  |
| pix_key     | text      | Chave PIX (opcional)         |
| pix_key_type| text      | cpf \| email \| phone \| random |
| created_at  | timestamptz | |
| updated_at  | timestamptz | |

---

### `gift_items`

| Coluna       | Tipo      | Descrição                    |
|-------------|-----------|------------------------------|
| id          | uuid (PK) | |
| event_id    | uuid (FK → events) | |
| name        | text      | Nome do produto              |
| product_url | text      | Link do produto              |
| price       | decimal(10,2) | Valor em R$              |
| category    | text      | Ex.: Cozinha, Eletrodomésticos |
| image_url   | text      | Opcional                     |
| status      | text      | disponivel \| reservado \| comprado |
| sort_order  | int       | Ordenação na lista           |
| created_at  | timestamptz | |
| updated_at  | timestamptz | |

Exibição do comprador: derivada da última `purchase` confirmada do item (buyer_name ou profile do buyer_user_id).

---

### `purchases`

| Coluna         | Tipo      | Descrição                    |
|----------------|-----------|------------------------------|
| id             | uuid (PK) | |
| gift_item_id   | uuid (FK → gift_items) | |
| buyer_user_id  | uuid (FK → profiles, nullable) | Se logado |
| buyer_name     | text      | Nome do comprador (convidado) |
| payment_type   | text      | link \| pix                  |
| status         | text      | pendente \| confirmado       |
| amount         | decimal(10,2) | Valor pago/referência   |
| proof_url      | text      | Opcional: comprovante PIX    |
| confirmed_at   | timestamptz | Quando foi confirmado     |
| created_at     | timestamptz | |

---

## RLS (resumo)

- **profiles:** SELECT/UPDATE onde id = auth.uid().
- **events:** SELECT/INSERT/UPDATE/DELETE onde owner_id = auth.uid(); SELECT pública por slug para página da lista.
- **gift_items:** SELECT para itens do evento (público na lista); INSERT/UPDATE/DELETE onde evento.owner_id = auth.uid().
- **purchases:** INSERT por qualquer um (convidado com nome ou user); SELECT/UPDATE pelo dono do evento ou pelo próprio comprador (buyer_user_id = auth.uid()); regras conforme política desejada (ex.: só dono confirma PIX).

---

## Enums sugeridos (ou check constraint)

- `gift_items.status`: 'disponivel', 'reservado', 'comprado'
- `purchases.payment_type`: 'link', 'pix'
- `purchases.status`: 'pendente', 'confirmado'
- `events.pix_key_type`: 'cpf', 'email', 'phone', 'random'

Implementação pode usar `CHECK` nas colunas ou tabelas de enum no PostgreSQL.
