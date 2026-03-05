---
name: rs-full-stack-instalando-o-zod
description: "Applies Zod schema validation setup when creating or configuring a Node.js/TypeScript API project. Use when user asks to 'add validation', 'install zod', 'setup schema validation', 'validate request body', or 'create API with validation'. Ensures correct Zod installation and integration with TypeScript. Make sure to use this skill whenever setting up input validation in a Node.js REST API. Not for frontend form validation, Joi, Yup, or other validation libraries."
---

# Instalando o Zod

> Ao adicionar validacao a uma API REST com TypeScript, usar Zod como biblioteca de validacao baseada em schemas.

## Rules

1. **Instale Zod com versao fixa** — `npm i zod@3.23.8`, porque versoes fixas evitam breaking changes silenciosos em projetos de curso ou producao
2. **Pare o servidor antes de instalar dependencias** — porque instalacoes com servidor rodando podem causar conflitos de hot-reload
3. **Verifique a aplicacao apos instalacao** — execute o servidor novamente para garantir que nenhuma dependencia quebrou

## Steps

### Step 1: Parar a aplicacao
```bash
# Ctrl+C no terminal onde o servidor esta rodando
```

### Step 2: Instalar Zod
```bash
npm i zod@3.23.8
```

### Step 3: Verificar instalacao
```bash
# Executar a aplicacao novamente
npm run dev
```

### Step 4: Importar no codigo
```typescript
import { z } from 'zod'
```

## How to use

### Criar um schema de validacao
```typescript
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(18),
})

// Validar dados
const validatedData = createUserSchema.parse(requestBody)
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Novo projeto API REST com TypeScript | Instalar Zod como primeira dependencia de validacao |
| Precisa validar body de request | Criar schema Zod e usar `.parse()` |
| Precisa tipar os dados validados | Usar `z.infer<typeof schema>` para extrair o tipo |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `npm i zod` (sem versao fixa em curso) | `npm i zod@3.23.8` |
| Validar manualmente com `if/else` | Criar schema Zod declarativo |
| Instalar com servidor rodando | Parar servidor, instalar, reiniciar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre validacao baseada em schemas e vantagens do Zod
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de schemas Zod para APIs REST