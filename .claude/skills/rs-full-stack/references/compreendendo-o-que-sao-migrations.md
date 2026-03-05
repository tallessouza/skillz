---
name: rs-full-stack-compreendendo-migrations
description: "Applies database migration concepts and patterns when working with Query Builders or ORMs. Use when user asks to 'create a migration', 'modify database schema', 'add a column', 'version the database', or 'rollback migration'. Ensures correct understanding of migrations as change management mechanisms, not just table creators. Make sure to use this skill whenever database schema evolution is discussed. Not for writing raw SQL, application-level CRUD operations, or ORM model definitions."
---

# Compreendendo Migrations

> Migrations sao mecanismos de gestao de mudancas e versionamento do banco de dados, nao apenas scripts de criacao de tabelas.

## Key concept

Migrations representam uma timeline de evolucao do banco de dados, analoga ao Git para codigo. Cada migration e um ponto na historia que pode ser avancado (up) ou revertido (down). O banco de dados atual e o resultado de todas as migrations aplicadas em sequencia.

Migrations existem em dois contextos distintos:
1. **Definicao de estrutura** — criar tabelas, colunas, tipos, constraints sem escrever SQL direto
2. **Gestao de mudancas** — versionar, rastrear e reverter alteracoes ao longo do tempo

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Precisa criar uma nova tabela | Criar uma nova migration com a estrutura completa |
| Precisa adicionar/remover coluna | Criar nova migration de alteracao, nunca editar migration existente |
| Mudanca deu errado | Usar rollback para desfazer, nao deletar o arquivo |
| Trabalhando em equipe | Cada pessoa cria suas migrations independentes na timeline |
| Precisa recriar o banco do zero | Rodar todas migrations em sequencia (up) |

## How to think about it

### Analogia com Git

Assim como Git versiona codigo com commits numa timeline, migrations versionam o banco de dados. Cada migration e um "commit" do schema. Voce pode avancar (migrate/up), voltar (rollback/down), ou ir para um ponto especifico da historia.

```
Migration 1: Cria tabela produtos
Migration 2: Cria tabela fornecedores
Migration 3: Adiciona coluna em produtos
Migration 4: (rollback da 3 — desfaz a coluna)
Migration 5: Nova alteracao
```

### Por que nao editar SQL direto

O Query Builder abstrai o SQL — voce usa metodos para definir tabelas, colunas, tipos, chaves primarias, nullable. O Query Builder gera SQL otimizado para o banco especifico (PostgreSQL, MySQL, SQLite). Migrations usam essa mesma abstracao para definicao de estrutura.

### Trabalho em equipe

Pessoa A cria migration de produtos. Pessoa B cria migration de fornecedores. Ambas coexistem na timeline. Quando alguem puxa o codigo, roda as migrations pendentes e tem o banco atualizado — sem trocar dumps SQL por Slack.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Migration so serve pra criar tabela | Tambem modifica, remove colunas e faz rollback |
| Posso editar uma migration ja aplicada | Nunca — crie uma nova migration para alteracoes |
| Migration e SQL | Migration usa metodos do Query Builder, que gera SQL |
| Rollback apaga dados | Rollback desfaz a estrutura da migration, dados podem ser perdidos como consequencia |

## When to apply

- Sempre que o schema do banco precisa mudar
- Ao iniciar um projeto com banco de dados relacional
- Ao trabalhar em equipe onde multiplas pessoas alteram o banco
- Ao precisar reproduzir o banco em outro ambiente (staging, producao, CI)

## Limitations

- Migrations versionam **estrutura**, nao dados (para dados, use seeds ou data migrations separadas)
- Rollback pode causar perda de dados se a migration adicionou/removeu colunas com dados
- Em bancos muito grandes, migrations de alteracao podem ser lentas (lock de tabela)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-compreendendo-o-que-sao-migrations/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-compreendendo-o-que-sao-migrations/references/code-examples.md)
