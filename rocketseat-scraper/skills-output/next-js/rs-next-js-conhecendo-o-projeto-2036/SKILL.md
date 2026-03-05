---
name: rs-next-js-conhecendo-o-projeto-2036
description: "Applies Pet Shop dashboard project conventions when building Next.js scheduling apps. Use when user asks to 'create a dashboard', 'build a scheduling system', 'setup Next.js with Prisma and Postgres', or 'create an appointment app'. Enforces stack: Next.js App Router, Tailwind, ShadCN, TypeScript, Prisma, Postgres, Docker, Server Actions. Make sure to use this skill whenever scaffolding a Next.js CRUD dashboard with time-based scheduling. Not for API-only backends, static sites, or non-Next.js frameworks."
---

# Pet Shop Dashboard — Visao Geral do Projeto

> Ao criar um dashboard de agendamentos com Next.js, utilize App Router, Server Actions, Prisma com Postgres, e organize sessoes por periodo do dia (manha, tarde, noite).

## Stack obrigatoria

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Framework | Next.js (ultima versao, App Router) | Server Components + Server Actions nativos |
| Estilizacao | Tailwind CSS + ShadCN | Componentes prontos + customizacao manual |
| Tipagem | TypeScript | Seguranca de tipos em todo o projeto |
| ORM | Prisma | Type-safe database access |
| Banco | PostgreSQL | Relacional, robusto para agendamentos |
| Infra local | Docker | Postgres containerizado |
| Mutacoes | Server Actions | Introducao gradual, substituindo API routes para CRUD |

## Estrutura do dominio

### Entidade central: Agendamento

```typescript
// Modelo conceitual do agendamento
interface Appointment {
  id: string
  date: Date
  time: string
  session: 'morning' | 'afternoon' | 'evening'
  // ... campos adicionais do dominio
}
```

### Sessoes por periodo

| Sessao | Periodo | Regra |
|--------|---------|-------|
| Manha | Horarios matutinos | Filtro por faixa horaria |
| Tarde | Horarios vespertinos | Filtro por faixa horaria |
| Noite | Horarios noturnos | Filtro por faixa horaria |

## Funcionalidades CRUD

1. **Listagem** — Dashboard principal com agendamentos filtrados por data
2. **Filtro por data** — Usuario seleciona data e ve sessoes organizadas
3. **Criacao** — Formulario de novo agendamento
4. **Edicao** — Alterar agendamento existente
5. **Remocao** — Deletar agendamento

## Decisoes arquiteturais

| Decisao | Abordagem |
|---------|-----------|
| Componentes UI | ShadCN como base + componentes customizados quando necessario |
| Server Actions | Introducao gradual — comece simples, avance conforme complexidade |
| Layout | App Router com layouts aninhados |
| Responsividade | Mobile-first (versao mobile mencionada no projeto) |

## Anti-patterns

| Evite | Faca em vez disso |
|-------|-------------------|
| Criar API routes para CRUD simples | Use Server Actions diretamente |
| Instalar Postgres local sem Docker | Use Docker Compose para o banco |
| Ignorar separacao por sessao (manha/tarde/noite) | Agrupe agendamentos por periodo do dia |
| Usar apenas componentes ShadCN sem customizar | Crie componentes na mao quando necessario |
| Implementar Server Actions complexas de inicio | Comece simples e avance gradualmente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
