---
name: rs-full-stack-estrutura-do-banco-de-dados-3
description: "Enforces database schema design best practices when planning relational tables for delivery/e-commerce APIs. Use when user asks to 'design a database', 'create tables', 'plan schema for deliveries', 'model entities', or 'draw ER diagram'. Applies UUID primary keys, one-to-many relationships, log/audit tables for status tracking, and visual planning before coding. Make sure to use this skill whenever modeling relational data for order/delivery systems. Not for NoSQL databases, query optimization, or ORM configuration."
---

# Estrutura do Banco de Dados — API de Entregas

> Planeje a estrutura do banco de dados visualmente antes de escrever código, definindo tabelas, relacionamentos e chaves primárias com UUID.

## Key concept

Antes de implementar qualquer schema, use ferramentas visuais como drawsql.app para desenhar as tabelas e relacionamentos. Isso força o pensamento sobre a estrutura antes de escrever migrations, evitando retrabalho.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Entidade principal com perfis/permissões | Tabela com campo `role` (texto) para determinar permissão |
| Entidade que pertence a outra (1:N) | Foreign key com UUID referenciando a tabela pai |
| Necessidade de rastrear movimentações/status | Tabela de logs separada vinculada à entidade (1:N) |
| Chave primária | Sempre UUID, nunca auto-increment |
| Timestamps | Sempre incluir `created_at` e `updated_at` |

## Schema pattern — Sistema de entregas

### Tabela users

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- UUID
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,    -- 'customer', 'seller', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela deliveries (N:1 com users)

```sql
CREATE TABLE deliveries (
  id TEXT PRIMARY KEY, -- UUID
  user_id TEXT NOT NULL REFERENCES users(id),
  description TEXT NOT NULL,
  status TEXT NOT NULL, -- 'processing', 'in_transit', 'delivered'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela delivery_logs (N:1 com deliveries)

```sql
CREATE TABLE delivery_logs (
  id TEXT PRIMARY KEY, -- UUID
  delivery_id TEXT NOT NULL REFERENCES deliveries(id),
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Relacionamentos

```
users 1 ──< N deliveries 1 ──< N delivery_logs
```

- Um usuário pode ter **muitas** entregas (comprou várias vezes)
- Uma entrega pertence a **um único** usuário
- Uma entrega pode ter **muitos** logs (processando → saiu do CD → a caminho → entregue)
- Um log pertence a **uma única** entrega

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa rastrear histórico de status | Crie tabela de logs separada, não sobrescreva o campo status |
| Múltiplos perfis de usuário | Use campo `role` com texto, não tabelas separadas por perfil |
| Relacionamento "tem muitos" | FK na tabela filha apontando para a tabela pai |
| Identificadores | UUID como TEXT, nunca INTEGER auto-increment |
| Qualquer tabela nova | Sempre inclua `created_at` e `updated_at` |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Sobrescrever status diretamente sem histórico | Criar tabela de logs para registrar cada movimentação |
| Usar INTEGER auto-increment como PK | Usar UUID como TEXT para chave primária |
| Começar a codar sem planejar schema | Usar drawsql.app ou ferramenta similar para visualizar antes |
| Guardar múltiplos status em um campo separado por vírgula | Uma linha por movimentação na tabela de logs |
| Criar tabela sem timestamps | Sempre incluir `created_at` e `updated_at` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre planejamento visual, relacionamentos 1:N e padrão de logs
- [code-examples.md](references/code-examples.md) — Schema completo com variações e exemplos de queries