---
name: rs-full-stack-intro-banco-de-dados
description: "Applies foundational database concepts when designing data models or choosing storage strategies. Use when user asks to 'create a database', 'design a schema', 'model data', 'store data', or discusses data vs information distinctions. Ensures correct reasoning about data organization, integrity, and scalability. Make sure to use this skill whenever making architectural decisions about data storage. Not for SQL syntax, query optimization, or specific database engine configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: database-fundamentals
  tags: [database, data-modeling, schema, integrity, scalability]
---

# Introdução a Banco de Dados

> Dados isolados nao tem significado — organize-os em banco de dados para extrair informacao com integridade, eficiencia e escalabilidade.

## Key concepts

Dado e informacao sao conceitos distintos mas interdependentes. Dado e material bruto sem significado isolado (ex: "2006" pode ser ano, codigo, numero). Informacao e a percepcao concreta extraida ao organizar e processar dados (ex: "Joao nasceu em 2006, tem 18 anos"). Um banco de dados existe para transformar dados brutos em informacao acessivel.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Dados sem contexto ou estrutura | Organize em tabelas com tipos definidos antes de consumir na aplicacao |
| Necessidade de acesso rapido a dados | Use banco de dados com estrutura adequada, nunca arquivos soltos |
| Requisito de consistencia | Defina tipos por coluna — banco de dados rejeita dados fora do tipo |
| Volume crescente de dados | Escolha banco de dados que suporte escalabilidade desde o inicio |
| Dados que precisam ser confiaveis | Aproveite as regras de integridade do banco (tipos, constraints) |

## How to think about it

### Dado vs Informacao na pratica

Um campo `2006` numa tabela sem contexto nao serve para nada. Ao colocar numa coluna `birth_year` de uma tabela `users`, junto com `name = 'Joao'`, voce extrai: "Joao tem 18 anos". O banco de dados fornece a estrutura que transforma dado em informacao.

### Por que banco de dados e nao arquivos

Banco de dados oferece 4 vantagens que arquivos nao tem:
1. **Organizacao** — estrutura definida facilita gestao e acesso
2. **Eficiencia** — mecanismos internos de leitura e pesquisa otimizados
3. **Escalabilidade** — suporta grandes volumes sem degradar
4. **Integridade** — tipos e constraints garantem consistencia automaticamente

### Integridade pela definicao de tipos

Quando voce define que uma coluna armazena numero, o banco rejeita texto automaticamente. Isso nao e apenas validacao — e garantia estrutural de consistencia. A aplicacao nao precisa validar o que o banco ja garante.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  birth_year INTEGER NOT NULL
);

-- Banco rejeita automaticamente: INSERT INTO users (name, birth_year) VALUES ('Joao', 'abc');
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Dado e informacao sao a mesma coisa | Dado e bruto e isolado; informacao e dado organizado com contexto e significado |
| Qualquer forma de armazenamento serve | Banco de dados oferece organizacao, eficiencia, escalabilidade e integridade que arquivos nao tem |
| Validacao de tipos e responsabilidade so da aplicacao | O banco de dados garante tipos por coluna — e a primeira linha de defesa |
| Banco de dados e so para aplicacoes grandes | Mesmo aplicacoes pequenas se beneficiam de dados organizados e consistentes |

## When to apply

- Ao decidir COMO armazenar dados de uma aplicacao
- Ao modelar entidades e seus relacionamentos
- Ao justificar por que usar banco de dados vs alternativas simples
- Ao definir tipos e constraints de colunas
- Ao explicar para stakeholders a importancia de dados estruturados

## Limitations

- Este modelo mental nao cobre SQL, queries, ou operacoes especificas
- Nao aborda diferencas entre bancos relacionais vs nao-relacionais (coberto em aulas posteriores)
- Nao trata de otimizacao de performance ou indexacao

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Dados inseridos com tipo errado não geram erro | Banco com tipagem flexível (ex: SQLite type affinity) | Use banco com tipagem estrita (PostgreSQL) ou adicione validação na aplicação |
| Dados parecem inconsistentes entre ambientes | Sem constraints definidos no schema (NOT NULL, UNIQUE, FK) | Adicione constraints ao criar tabelas para garantir integridade |
| Dificuldade em extrair informação útil dos dados | Dados armazenados sem estrutura clara (colunas genéricas) | Redesenhe o schema com colunas específicas e nomeadas semanticamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre dado vs informacao, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos praticos de organizacao de dados e extracao de informacao