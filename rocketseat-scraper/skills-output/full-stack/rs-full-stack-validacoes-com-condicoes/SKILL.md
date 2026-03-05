---
name: rs-full-stack-validacoes-com-condicoes
description: "Applies conditional validation patterns when writing API endpoint handlers in Node.js/Express. Use when user asks to 'validate request body', 'add input validation', 'check required fields', 'validate API data', or 'add field constraints'. Enforces per-field error messages, trim before length check, negative number guards, and motivates migration to schema validation. Make sure to use this skill whenever creating POST/PUT endpoints with body parsing. Not for schema-based validation (Zod/Joi), authentication, or database constraints."
---

# Validações com Condições

> Valide cada campo individualmente com mensagens específicas antes de evoluir para schema validation.

## Rules

1. **Uma validação por campo** — separe cada campo em seu próprio `if`, porque mensagens genéricas como "nome e preço são obrigatórios" não ajudam o usuário a saber o que corrigir
2. **Sempre aplique `trim()` antes de validar strings** — `"   "` não é input válido, porque espaços em branco passam silenciosamente pela checagem de truthiness
3. **Valide na ordem: presença → formato → regra de negócio** — primeiro checa se existe, depois tamanho mínimo, depois regex, porque cada etapa depende da anterior
4. **Números negativos são inválidos por padrão** — use `<= 0` para preços e quantidades, porque valores negativos corrompem cálculos downstream
5. **Retorne imediatamente no primeiro erro** — use `return` após cada `res.status(400)`, porque múltiplas respostas causam "headers already sent"
6. **Reconheça quando ifs acumulam demais** — mais de 4-5 blocos de validação manual é sinal para migrar para schema validation (Zod, Joi, Yup)

## How to write

### Validação individual por campo

```typescript
if (!name) {
  return res.status(400).json({ message: "Nome do produto é obrigatório." })
}

if (name.trim().length < 6) {
  return res.status(400).json({ message: "Nome do produto precisa ter pelo menos 6 caracteres." })
}

if (!price && price !== 0) {
  return res.status(400).json({ message: "Preço do produto é obrigatório." })
}

if (price <= 0) {
  return res.status(400).json({ message: "Preço do produto não pode ser menor ou igual a zero." })
}
```

## Example

**Before (mensagem genérica):**
```typescript
if (!name || !price) {
  return res.status(400).json({ message: "Nome e preço do produto são obrigatórios." })
}
```

**After (validações individuais com mensagens específicas):**
```typescript
if (!name) {
  return res.status(400).json({ message: "Nome do produto é obrigatório." })
}

if (name.trim().length < 6) {
  return res.status(400).json({ message: "Nome do produto precisa ter pelo menos 6 caracteres." })
}

if (price === undefined || price === null) {
  return res.status(400).json({ message: "Preço do produto é obrigatório." })
}

if (price <= 0) {
  return res.status(400).json({ message: "Preço do produto não pode ser menor ou igual a zero." })
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campo string obrigatório | Cheque falsy + trim |
| Campo numérico obrigatório | Cheque `undefined/null` separado de `<= 0` |
| Email, CPF, URL | Use regex ou migre para schema validation |
| Mais de 5 campos com regras | Migre para Zod/Joi/Yup |
| Validação reutilizada em múltiplas rotas | Extraia para middleware ou schema |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `if (!name \|\| !price)` com mensagem genérica | Um `if` por campo com mensagem específica |
| `if (name.length < 6)` sem trim | `if (name.trim().length < 6)` |
| `if (price < 0)` permitindo zero | `if (price <= 0)` para preços |
| Múltiplos `res.json()` sem `return` | `return res.status(400).json(...)` |
| 15 blocos de if em sequência | Schema validation com Zod/Joi |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre evolução de validações manuais para schema validation
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código da aula com variações