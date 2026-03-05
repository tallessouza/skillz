---
name: rs-full-stack-banco-de-dados-relacional
description: "Applies relational database concepts when designing schemas, creating tables, or modeling data. Use when user asks to 'create a table', 'design a schema', 'model data', 'set up database', or 'define entities'. Enforces one-subject-per-table, plural naming, proper primary keys, and column type separation. Make sure to use this skill whenever creating or reviewing database table structures. Not for query optimization, indexing strategies, or ORM configuration."
---

# Banco de Dados Relacional

> Organize dados em tabelas bem estruturadas onde cada tabela guarda dados de um unico assunto, com registros unicos garantidos por chaves primarias.

## Key concept

Banco de dados relacional organiza dados em tabelas com linhas (registros/tuplas) e colunas (campos/atributos). O nome "relacional" vem do fato de tabelas poderem se relacionar entre si atraves de chaves comuns (primarias e estrangeiras). A analogia mais direta: uma tabela funciona como uma planilha Excel — linhas na horizontal, colunas na vertical — mas com regras rigidas de tipagem e unicidade.

## Rules

1. **Uma tabela = um assunto** — nunca misture produtos, clientes e usuarios na mesma tabela, porque vira uma bagunca impossivel de manter e consultar
2. **Nomes de tabelas no plural** — `products`, `users`, `categories`, porque uma tabela guarda varios registros daquele assunto
3. **Cada coluna guarda um unico tipo de dado** — inteiros na coluna de ID, texto na coluna de titulo, decimal na coluna de nota, porque misturar tipos quebra consultas e validacoes
4. **Toda tabela precisa de chave primaria** — o banco garante unicidade automaticamente, impedindo registros duplicados e permitindo identificar cada registro de forma exclusiva
5. **Linhas sao registros completos** — uma linha horizontal contem todos os campos de uma unica entidade (ID + titulo + nota + data)

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Dados de assuntos diferentes na mesma tabela | Separe em tabelas distintas, uma por assunto |
| Tabela sem coluna de identificacao unica | Adicione uma coluna `id` com PRIMARY KEY |
| Nome de tabela no singular (`product`) | Renomeie para plural (`products`) |
| Coluna misturando tipos (texto e numero) | Separe em colunas tipadas corretamente |
| Necessidade de deletar/atualizar registro especifico | Use o identificador unico (chave primaria) |

## How to think about it

### Estrutura de uma tabela

```
tabela: products (plural, um assunto)
├── colunas (vertical): id | title | rating | created_at
└── registros (horizontal):
    ├── linha 1: 1 | "Produto A" | 9.8 | 2024-01-01
    └── linha 2: 2 | "Produto B" | 9.5 | 2024-01-02
```

Colunas definem TIPOS de dados. Linhas compoem REGISTROS completos.

### Por que chave primaria importa

Sem chave primaria, se voce tentar deletar "Produto A" e existirem dois registros com titulo identico, nao ha como diferenciar qual deletar. A chave primaria (ID) garante que cada registro e unico — o banco rejeita insercoes duplicadas automaticamente.

### Hierarquia: Banco > Tabelas > Colunas > Registros

```
banco_de_dados
├── tabela_a (products)
│   ├── colunas: id, name, price
│   └── registros: (1, "Camiseta", 4990), (2, "Bone", 2990)
├── tabela_b (users)
│   ├── colunas: id, name, email
│   └── registros: (1, "Joao", "joao@email.com")
└── tabela_c (categories)
    ├── colunas: id, name
    └── registros: (1, "Roupas"), (2, "Acessorios")
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Posso colocar tudo numa tabela so | Cada tabela deve ter um unico assunto para manter organizacao e performance |
| Coluna com nome `id` ja garante unicidade | Apenas definir PRIMARY KEY na coluna faz o banco impedir duplicatas |
| Banco relacional = banco com relacoes entre tabelas | O nome vem da teoria matematica de relacoes, mas na pratica sim, tabelas se relacionam via chaves |

## Anti-patterns

| Nunca faca | Faca assim |
|-----------|------------|
| Tabela `data` com produtos, usuarios e categorias juntos | Tabelas separadas: `products`, `users`, `categories` |
| Tabela no singular: `product` | Plural: `products` |
| Tabela sem PRIMARY KEY | Sempre defina `id` como PRIMARY KEY |
| Coluna que mistura texto e numeros | Uma coluna por tipo de dado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre estrutura relacional, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos de criacao de tabelas e estruturas expandidos