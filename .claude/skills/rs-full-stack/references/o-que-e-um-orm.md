---
name: rs-full-stack-o-que-e-um-orm
description: "Applies ORM concepts and decision frameworks when designing database access layers. Use when user asks to 'connect to database', 'create a model', 'choose between ORM and query builder', 'setup Prisma/Drizzle/TypeORM', or 'map tables to objects'. Make sure to use this skill whenever deciding on database abstraction strategy or explaining ORM vs query builder tradeoffs. Not for writing raw SQL, database administration, or schema migration commands."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: banco-de-dados
  tags: [orm, banco-de-dados, prisma, mapeamento, query-builder]
---

# ORM — Object Relational Mapper

> Manipule dados do banco como objetos na linguagem de programacao — o ORM converte entre objetos e tabelas automaticamente.

## Key concept

ORM (Object Relational Mapper — Mapeador Objeto Relacional) e uma ferramenta que faz o meio de campo entre objetos na aplicacao e tabelas no banco de dados relacional. Em vez de escrever SQL diretamente, voce manipula objetos na sua linguagem de programacao e o ORM gera o SQL correspondente. O nome vem exatamente disso: mapeia **objetos** para **relacoes** (tabelas).

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Precisa de CRUD simples com multiplas entidades relacionadas | ORM — menos codigo, mais produtividade |
| Precisa de queries complexas com controle fino de performance | Query Builder — mais controle sobre o SQL gerado |
| Projeto pode mudar de banco de dados no futuro | ORM — troca apenas a configuracao, sem reescrever codigo |
| Precisa escrever SQL customizado em pontos especificos | Query Builder — permite SQL direto quando necessario |
| Time prioriza velocidade de desenvolvimento e manutencao | ORM — simplifica leitura, escrita e manutencao |

## How to think about it

### O mapeamento objeto-tabela

```typescript
// No codigo (objeto)
const user = { id: 12, name: "Rodrigo", email: "rodrigo@email.com" }

// No banco (tabela users)
// | id | name    | email              |
// | 12 | Rodrigo | rodrigo@email.com  |

// O ORM converte automaticamente entre essas duas representacoes
```

O ORM esta no meio: aplicacao ↔ ORM ↔ banco de dados. Voce nunca escreve SQL — manipula objetos e o ORM traduz.

### ORM vs Query Builder

**ORM** — nivel de abstracao MAIOR:
- Tabelas viram classes/objetos
- Voce opera com objetos, ORM gera SQL
- Menos controle, mais produtividade

**Query Builder** — nivel de abstracao MENOR:
- Ajuda a construir SQL usando a linguagem de programacao
- Permite tambem SQL direto quando necessario
- Mais controle, mais trabalho na construcao das queries

Ambos servem o mesmo proposito: manipular dados no banco sem SQL puro. A diferenca e o **nivel de abstracao**.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| ORM elimina necessidade de entender SQL | ORM gera SQL — entender SQL ajuda a debugar e otimizar |
| Query Builder e inferior ao ORM | Sao ferramentas diferentes; query builder da mais controle |
| ORM serve para qualquer cenario | Queries muito complexas podem ser mais claras com query builder ou SQL direto |
| Trocar de banco com ORM e so mudar config | Na pratica, features especificas de cada banco podem exigir ajustes |

## When to apply

- Ao iniciar um projeto e escolher a estrategia de acesso a dados
- Ao avaliar Prisma (ORM) vs Drizzle (query builder) vs Knex (query builder)
- Ao explicar para alguem a diferenca entre abordagens de banco de dados
- Ao decidir se um projeto precisa de mais controle ou mais produtividade

## Limitations

- ORM adiciona overhead de abstracao — queries geradas podem ser menos eficientes
- Para operacoes bulk ou queries analiticas complexas, SQL direto pode ser necessario
- O mapeamento objeto-relacional tem impedance mismatch (nem tudo mapeia 1:1)

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| ORM gera query lenta (N+1) | Relacionamentos carregados sem eager loading | Use `include` ou `join` para carregar relacionamentos junto |
| Erro ao trocar de banco (Postgres para MySQL) | Features especificas do banco no codigo | Revise queries que usam funcoes exclusivas do banco anterior |
| Modelo nao reflete colunas do banco | Schema do ORM desatualizado | Execute migration ou sincronize o schema com o banco |
| Tipos do ORM nao batem com os dados | Mapeamento de tipos incorreto | Verifique o mapeamento de tipos na configuracao do ORM |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-o-que-e-um-orm/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-o-que-e-um-orm/references/code-examples.md)
