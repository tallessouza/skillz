---
name: rs-full-stack-shallow-freezing
description: "Applies Object.freeze() correctly when writing JavaScript/TypeScript code that needs immutable objects. Use when user asks to 'freeze an object', 'make object immutable', 'prevent object modification', or 'protect object properties'. Enforces awareness that Object.freeze() is shallow — nested objects remain mutable. Make sure to use this skill whenever generating code that freezes objects or discusses object immutability in JS/TS. Not for deep freezing solutions, structuredClone, or Immer/immutable libraries."
---

# Shallow Freezing com Object.freeze()

> Object.freeze() congela apenas o primeiro nivel do objeto — propriedades que sao objetos aninhados continuam mutaveis.

## Rules

1. **Use Object.freeze() para impedir modificacao de propriedades diretas** — `Object.freeze(config)` impede reatribuicao de `config.key`, porque JavaScript nao impoe restricoes a modificacao de objetos por padrao
2. **Nunca confie no freeze para objetos aninhados** — `Object.freeze(obj)` NAO congela `obj.nested.prop`, porque freeze faz shallow freezing (congelamento raso)
3. **Congele imediatamente apos a criacao** — chame `Object.freeze()` antes de qualquer codigo que possa mutar o objeto, porque mutacoes anteriores ao freeze nao sao revertidas
4. **Documente quando freeze e insuficiente** — se o objeto tem propriedades aninhadas, sinalize que freeze sozinho nao garante imutabilidade completa

## How to write

### Congelamento de objeto simples (funciona)

```typescript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
}

Object.freeze(config)

config.timeout = 9999 // Silenciosamente ignorado (ou TypeError em strict mode)
// config.timeout continua 5000
```

### Congelamento com objeto aninhado (armadilha)

```typescript
const book = {
  title: "Objetos Imutáveis",
  category: "JavaScript",
  author: {
    name: "Rodrigo",
    email: "rodrigo@email.com",
  },
}

Object.freeze(book)

book.category = "CSS"        // Bloqueado — propriedade direta
book.author.name = "João"    // PERMITIDO — objeto aninhado nao foi congelado
```

## Example

**Before (falsa sensacao de seguranca):**
```typescript
const settings = {
  theme: "dark",
  notifications: {
    email: true,
    sms: false,
  },
}
Object.freeze(settings)
// Dev acha que tudo esta protegido
settings.notifications.sms = true // Mutou! Bug silencioso
```

**After (com consciencia do shallow freeze):**
```typescript
const settings = {
  theme: "dark",
  notifications: {
    email: true,
    sms: false,
  },
}
Object.freeze(settings)
Object.freeze(settings.notifications) // Congela tambem o objeto aninhado

settings.notifications.sms = true // Agora sim, bloqueado
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Objeto com apenas propriedades primitivas | `Object.freeze()` e suficiente |
| Objeto com propriedades que sao objetos | Freeze cada nivel ou use deep freeze |
| Configuracao que nunca deve mudar | Freeze + `as const` em TypeScript |
| Objeto recebido de API externa | Freeze apos parsing se quiser proteger |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `Object.freeze(obj)` e assumir que nested esta seguro | Congele cada nivel ou use deep freeze |
| Mutar antes de verificar se esta frozen | Use `Object.isFrozen(obj)` para checar |
| Freeze em arrays e achar que `.push()` funciona | Freeze bloqueia push/pop/splice tambem |
| Ignorar strict mode ao usar freeze | Use `"use strict"` para receber TypeError em vez de falha silenciosa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-shallow-freezing/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-shallow-freezing/references/code-examples.md)
