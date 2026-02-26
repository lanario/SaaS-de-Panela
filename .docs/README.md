# Documentação — Sistema Chá de Panela (SaaS)

## Conteúdo

| Documento | Descrição |
|-----------|-----------|
| [PLANEJAMENTO-FASES.md](./PLANEJAMENTO-FASES.md) | Planejamento em fases: fundação, auth, eventos, lista pública, compra/PIX, dashboard, UX e SaaS |
| [MODELO-DADOS.md](./MODELO-DADOS.md) | Schema do banco (Supabase), entidades e relações |

## Ordem sugerida de leitura

1. **PLANEJAMENTO-FASES.md** — para entender as fases e critérios de conclusão.
2. **MODELO-DADOS.md** — ao implementar Fase 2 e seguintes, para criar tabelas e RLS.

## Template de referência

O layout e fluxos de UI seguem o arquivo:

- `template/Chá de Panela - Dashboard Template.jsx`

Ele define: estrutura dos itens (nome, link, preço, categoria, status, comprador), modais de “Adicionar Presente” e “Pix”, cards de presentes, filtro por categoria, barra de progresso e visão admin em tabela.
