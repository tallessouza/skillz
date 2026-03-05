---
name: rs-angular-fusos-horarios-utc
description: "Enforces UTC-first date handling patterns when working with JavaScript/Angular dates and timezones. Use when user asks to 'store dates', 'format dates', 'handle timezones', 'create a date field', 'work with DatePipe', or any date manipulation task. Applies rules: always store in UTC, always include timezone indicator, use toISOString for generation, convert to local only at display layer. Make sure to use this skill whenever generating code that creates, stores, or displays dates. Not for calendar UI components, date picker styling, or cron/scheduling logic."
---

# Fusos Horarios e Datas em UTC

> Armazene datas em UTC sem deslocamento e converta para a regiao do usuario apenas na camada de exibicao.

## Conceito central

UTC (Coordinated Universal Time) e o fuso zero — sem deslocamento de horario. No JavaScript, uma data com `Z` no final indica UTC. Isso permite converter para qualquer regiao de forma previsivel.

## Rules

1. **Sempre armazene em UTC** — `new Date().toISOString()` gera `2025-11-25T14:30:00.000Z`, porque uma data sem offset e convertivel para qualquer regiao
2. **Sempre inclua indicador de timezone** — nunca armazene `2025-11-25T14:30:00` sem o `Z` ou offset, porque sem indicador nao se sabe a qual regiao a data pertence
3. **Converta para local apenas na exibicao** — o banco armazena UTC, o frontend formata com offset do usuario, porque misturar conversoes no backend cria bugs silenciosos
4. **Use `toISOString()` para gerar datas** — `new Date().toISOString()` retorna ISO 8601 com `Z`, porque e o formato padrao sem ambiguidade
5. **Entenda o Z** — o `Z` (Zulu Time) significa offset zero, sem deslocamento, porque e o sinonimo ISO/militar para UTC

## Como funciona

### Gerando data UTC no JavaScript
```typescript
// Gera data no formato ISO 8601 com Z (UTC, sem offset)
const now = new Date().toISOString();
// "2025-11-25T14:30:00.000Z"
```

### Anatomia de uma data ISO 8601
```
2025-11-25T14:30:00.000Z
│         │            │
│         │            └─ Z = UTC (offset zero)
│         └─ T = separador data/hora
└─ Data no formato YYYY-MM-DD
```

### Offsets a partir do UTC
```typescript
// UTC-3 (Sao Paulo): hora base menos 3 horas
// UTC+9 (Toquio): hora base mais 9 horas
// Se UTC = 14:30, Sao Paulo = 11:30, Toquio = 23:30
```

## Example

**Before (data ambigua — sem indicador de timezone):**
```typescript
// Qual regiao? Sao Paulo? Canada? Japao? Impossivel saber
const date = "2025-11-25T14:30:00";
saveToDatabase(date); // Bug: interpretacao depende do servidor
```

**After (data UTC explicita):**
```typescript
// Z indica UTC — data global sem ambiguidade
const date = new Date().toISOString(); // "2025-11-25T14:30:00.000Z"
saveToDatabase(date); // Correto: converte para local apenas no display
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Salvando data no banco de dados | Sempre em UTC com `Z` ou `+00:00` |
| Exibindo data para o usuario | Converta para timezone local no frontend |
| Recebendo data de uma API | Verifique se tem indicador de timezone |
| Comparando duas datas | Converta ambas para UTC antes de comparar |
| Sistema global (multi-regiao) | UTC no armazenamento e obrigatorio |
| Sistema local (regiao unica) | Ainda prefira UTC — facilita migracao futura |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `"2025-11-25T14:30:00"` (sem Z) | `"2025-11-25T14:30:00.000Z"` |
| Armazenar com offset no banco | Armazenar em UTC, converter no display |
| `new Date().toString()` para persistir | `new Date().toISOString()` |
| Converter timezone no backend para exibir | Retornar UTC, frontend converte |
| Assumir timezone do servidor | Sempre explicitar UTC |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
