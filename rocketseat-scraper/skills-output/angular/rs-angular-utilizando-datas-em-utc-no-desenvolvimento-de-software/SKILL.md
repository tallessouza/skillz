---
name: rs-angular-datas-utc-desenvolvimento
description: "Enforces UTC date storage and metadata practices when designing databases, APIs, or systems that handle dates. Use when user asks to 'save dates', 'store timestamps', 'design a database schema with dates', 'handle timezones', or 'convert dates between regions'. Applies rules: always store in UTC, save IANA timezone, save offset, save user locale as metadata. Make sure to use this skill whenever creating systems that persist dates, even for local-only apps. Not for date formatting in templates, DatePipe usage, or UI display logic."
---

# Armazenamento de Datas em UTC

> Salve datas em UTC com metadados de contexto (região, offset, idioma) para garantir integridade e flexibilidade de conversão.

## Rules

1. **Salve sempre em UTC** — `new Date().toISOString()` gera uma data com `Z` no final, sem fuso aplicado, porque uma data sem offset é íntegra e convertível para qualquer região
2. **Salve a região IANA junto** — `America/Sao_Paulo`, `Asia/Tokyo`, porque sem a região você não sabe de onde veio a data e não consegue reconstruir o contexto
3. **Salve o offset da região** — `-03:00`, `+09:00`, porque permite aplicar o deslocamento diretamente sem lookup adicional
4. **Salve o idioma do usuário** — `pt-BR`, `en-US`, porque metadados de locale permitem formatação e comunicação correta (emails, notificações)
5. **Nunca salve data com fuso já aplicado sem identificar o fuso** — uma data `2024-03-15 14:30:00` sem offset é ambígua, porque você não sabe se é UTC, -3, +9

## How to write

### Schema de banco de dados

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY,
  -- Data em UTC, sem fuso aplicado
  purchased_at TIMESTAMPTZ NOT NULL,
  -- Metadados de contexto
  user_timezone TEXT NOT NULL,      -- 'America/Sao_Paulo' (IANA)
  user_offset TEXT NOT NULL,        -- '-03:00'
  user_locale TEXT NOT NULL         -- 'pt-BR'
);
```

### Capturando metadados no frontend

```typescript
// Data em UTC
const purchasedAt = new Date().toISOString()
// "2024-03-15T10:20:40.000Z"

// Região IANA do usuário
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
// "America/Sao_Paulo"

// Idioma do navegador
const userLocale = navigator.language
// "pt-BR"
```

## Example

**Before (banco de dados ruim — sem contexto):**
```
purchased_at: "2024-03-15 14:30:00"
```
Problema: qual região? Qual offset? Impossível converter com segurança.

**After (banco de dados com UTC + metadados):**
```
purchased_at: "2024-03-15T17:30:00.000Z"
user_timezone: "America/Sao_Paulo"
user_offset: "-03:00"
user_locale: "pt-BR"
```
Agora posso converter para qualquer fuso: pego UTC, aplico +9 para Japão → `2024-03-16T02:30:00+09:00`.

## Heuristics

| Situação | Faça |
|----------|------|
| Sistema 100% local (um país) | Salve em UTC mesmo assim — você não sabe como o sistema vai evoluir |
| Precisa mostrar data na região do usuário | Converta UTC + offset no frontend |
| Precisa mostrar data em outra região | UTC + offset da região alvo |
| Tem apenas a região IANA e precisa do offset | Use `Intl.DateTimeFormat` com `timeZoneName: 'longOffset'` para extrair |
| Precisa enviar email/notificação ao usuário | Use o locale salvo para formatar no idioma correto |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Salvar `"2024-03-15 14:30:00"` sem offset | Salvar `"2024-03-15T17:30:00.000Z"` (UTC) |
| Salvar data com fuso aplicado sem dizer qual | Salvar UTC + campo separado com timezone IANA |
| Converter fuso manualmente com `+3` ou `-9` hardcoded | Usar a região IANA e APIs de internacionalização |
| Assumir que o sistema nunca será global | Salvar em UTC desde o início |
| Salvar apenas a data sem metadados | Salvar UTC + timezone + offset + locale |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
