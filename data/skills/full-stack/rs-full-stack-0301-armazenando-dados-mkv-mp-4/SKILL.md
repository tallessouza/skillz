---
name: rs-full-stack-armazenando-dados
description: "Applies data storage strategy selection when building Node.js applications. Use when user asks to 'store data', 'save data', 'persist data', 'choose database vs file', or 'create a JSON file for storage'. Guides decision between in-memory, file-based (JSON), and database storage based on persistence needs. Make sure to use this skill whenever the user needs to decide where to store application data in Node.js. Not for database schema design, SQL queries, or ORM configuration."
---

# Armazenamento de Dados no Node.js

> Escolha a estrategia de armazenamento baseada na necessidade de persistencia: memoria para testes, arquivo para dados simples permanentes, banco de dados para producao.

## Key concept

Dados em memoria sao volateis — quando a aplicacao para, eles desaparecem. Para persistencia, use arquivos (JSON) ou bancos de dados. Arquivos JSON sao o passo intermediario entre memoria e banco de dados: simples, legíveis e permanentes.

## Decision framework

| Situacao | Estrategia | Razao |
|----------|-----------|-------|
| Testes ou dados temporarios | In-memory (array/Map) | Rapido, sem I/O, descartavel |
| Dados simples que precisam persistir | Arquivo JSON | Permanente, sem dependencia externa |
| Aplicacao em producao com dados complexos | Banco de dados | Queries, concorrencia, escalabilidade |
| Prototipo rapido antes de ter DB | Arquivo JSON | Permite trocar para DB depois |

## How to think about it

### In-Memory

```typescript
// Dados vivem apenas enquanto o processo roda
const users = []
users.push({ id: 1, name: 'João' })
// Se o servidor reiniciar, users volta a ser []
```

Usar quando: testes unitarios, cache temporario, dados que nao precisam sobreviver a um restart.

### Arquivo JSON

```typescript
import { readFile, writeFile } from 'node:fs/promises'

// Ler dados persistidos
const data = JSON.parse(await readFile('db.json', 'utf-8'))

// Salvar dados de volta
data.push({ id: 2, name: 'Maria' })
await writeFile('db.json', JSON.stringify(data, null, 2))
// Dados sobrevivem a reinicializacao
```

Usar quando: aplicacao simples, aprendizado, MVP sem banco de dados.

### Banco de Dados

Usar quando: aplicacao em producao, multiplos usuarios simultaneos, queries complexas.

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| In-memory e suficiente para tudo | Qualquer restart perde todos os dados |
| Precisa de banco de dados desde o inicio | Arquivo JSON funciona perfeitamente para aprender e prototipar |
| Arquivo JSON nao e armazenamento "real" | E permanente — dados sobrevivem a reinicializacao da aplicacao |

## When to apply

- Inicio de qualquer projeto Node.js que manipula dados
- Ao decidir entre persistencia temporaria vs permanente
- Ao prototipar antes de configurar um banco de dados
- Ao escrever testes que precisam de dados mock

## Limitations

- Arquivo JSON nao suporta acesso concorrente seguro (multiplos processos escrevendo)
- Para dados grandes ou queries complexas, arquivo JSON se torna impraticavel
- Em producao, banco de dados e quase sempre a escolha correta

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre volatilidade, trade-offs e quando migrar de arquivo para banco
- [code-examples.md](references/code-examples.md) — Exemplos completos de CRUD com arquivo JSON no Node.js