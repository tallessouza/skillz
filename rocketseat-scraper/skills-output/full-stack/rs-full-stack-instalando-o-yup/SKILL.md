---
name: rs-full-stack-instalando-o-yup
description: "Applies Yup schema validation setup with React Hook Form when configuring form validation, installing validation libraries, or integrating schema resolvers. Use when user asks to 'add form validation', 'install yup', 'setup react hook form validation', 'integrate schema validation', or 'configure yup resolver'. Make sure to use this skill whenever setting up schema-based validation in React forms with React Hook Form. Not for Zod validation, backend validation, or form UI styling."
---

# Validação com Yup + React Hook Form

> Configure validação baseada em schema usando Yup integrado ao React Hook Form via resolver.

## Prerequisites

- React Hook Form já instalado e configurado com `useForm`
- Gerenciador de pacotes (npm/yarn/pnpm) disponível

## Steps

### Step 1: Instalar as dependências

```bash
npm install @hookform/resolvers@3.9.1 yup@1.5.0
```

Duas bibliotecas distintas:
- `@hookform/resolvers` — integração entre validação baseada em schema e React Hook Form
- `yup` — biblioteca de validação baseada em schema

### Step 2: Importar o resolver e o Yup

```typescript
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
```

O `@hookform/resolvers` suporta múltiplas bibliotecas (Yup, Zod, Joi, SuperStruct). Importar o resolver específico para a biblioteca escolhida.

### Step 3: Criar o schema fora do componente

```typescript
const schema = yup.object({
  // definir campos na próxima etapa
})
```

Declarar o schema fora da função do componente para evitar recriação a cada render.

### Step 4: Passar o schema para o useForm via resolver

```typescript
const { register, handleSubmit } = useForm({
  resolver: yupResolver(schema),
})
```

## Output format

```typescript
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup.object({
  // campos do formulário com regras de validação
})

function MyComponent() {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  })
  // ...
}
```

## Error handling

- Se TypeScript reclama de conflito de tipos com schema vazio — definir pelo menos um campo no schema ou aguardar a implementação completa
- Se o resolver não é reconhecido — verificar se `@hookform/resolvers` está instalado e a importação usa o path correto (`/yup`)

## Heuristics

| Situação | Ação |
|----------|------|
| Já usa Zod no backend | Usar Yup no frontend amplia repertório, mas Zod também funciona via `zodResolver` |
| Precisa de validação simples (required only) | Yup ainda vale — schema centraliza todas as regras |
| Schema fica complexo demais | Extrair para arquivo separado (ex: `schemas/userForm.ts`) |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|-----------|
| Criar schema dentro do componente | Declarar fora da função do componente |
| Importar `yupResolver` de `@hookform/resolvers` (raiz) | Importar de `@hookform/resolvers/yup` |
| Validar manualmente com `if/else` quando tem React Hook Form | Usar resolver com schema |
| Misturar validação inline do RHF com schema resolver | Escolher uma abordagem — schema é preferível |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre validação baseada em schema e escolha do Yup
- [code-examples.md](references/code-examples.md) — Exemplos completos de setup e variações de configuração