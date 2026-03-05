---
name: rs-angular-padroes-de-datas
description: "Applies correct date format selection (ISO 8601 vs Unix Timestamp) when working with dates in JavaScript/TypeScript/Angular. Use when user asks to 'format a date', 'compare dates', 'store dates', 'parse timestamps', or 'convert date formats'. Ensures ISO 8601 for readability and Unix Timestamp for comparisons. Make sure to use this skill whenever generating code that handles date creation, storage, or display. Not for date pipe formatting, locale-specific display, or timezone conversion logic."
---

# Padrões de Datas: ISO 8601 vs Unix Timestamp

> Escolha o formato de data pelo caso de uso: ISO 8601 para leitura e armazenamento, Unix Timestamp para comparações numéricas.

## Key concept

Existem dois padrões fundamentais de representação de datas que todo desenvolvedor encontra:

1. **ISO 8601** — string universal no formato `YYYY-MM-DDTHH:mm:ss.sssZ`, legível por humanos e máquinas
2. **Unix Timestamp (Epoch Time)** — número que conta segundos ou milissegundos desde 1 de janeiro de 1970 00:00:00 UTC

## Decision framework

| Quando você precisa | Use | Porque |
|---------------------|-----|--------|
| Armazenar data em banco/API | ISO 8601 | Legível, universal, inclui timezone |
| Exibir data para o usuário | ISO 8601 (como fonte) | Fácil converter para qualquer formato de display |
| Comparar se data A > data B | Unix Timestamp | Comparação numérica simples: `a > b` |
| Calcular diferença entre datas | Unix Timestamp | Subtração direta em ms |
| Serializar em JSON | ISO 8601 | Padrão JSON, legível em logs |
| Ordenar datas | Unix Timestamp | Ordenação numérica nativa |

## How to generate each format

### ISO 8601
```typescript
const isoDate = new Date().toISOString();
// "2024-11-14T15:30:45.123Z"
// YYYY = ano, MM = mês, DD = dia
// T = separador de tempo
// HH:mm:ss.sss = hora, minutos, segundos, milissegundos
// Z = UTC (sem offset de timezone)
```

### Unix Timestamp
```typescript
// Em milissegundos
const timestampMs = new Date().getTime();
// 1731591045123

// Alternativa equivalente
const timestampMs2 = Date.now();
// 1731591045123
```

## Heuristics

| Situação | Faça |
|----------|------|
| Recebeu número grande de uma API | É Unix Timestamp — converta com `new Date(timestamp)` |
| Recebeu string com T e Z | É ISO 8601 — parse direto com `new Date(isoString)` |
| Precisa armazenar no backend | Envie ISO 8601 |
| Precisa ordenar lista por data | Converta para timestamp, compare numericamente |
| Viu número como `1731591045` (10 dígitos) | Unix em segundos — multiplique por 1000 para ms |
| Viu número como `1731591045123` (13 dígitos) | Unix em milissegundos — use direto no `new Date()` |

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Os primeiros dígitos do timestamp são o ano | Não, é um contador contínuo desde 1970 — `1731...` não é ano 1731 |
| Unix Timestamp sempre é em segundos | JavaScript usa milissegundos por padrão (`getTime()`, `Date.now()`) |
| ISO 8601 sem Z está em UTC | Sem Z significa hora local — o Z indica explicitamente UTC |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Comparar datas como strings ISO | Converta para timestamp: `dateA.getTime() > dateB.getTime()` |
| Armazenar timestamp para exibição | Armazene ISO 8601, converta para display no frontend |
| Assumir que todo timestamp é ms | Verifique o número de dígitos: 10 = segundos, 13 = milissegundos |
| `new Date(unixSeconds)` direto | `new Date(unixSeconds * 1000)` — JS espera milissegundos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
