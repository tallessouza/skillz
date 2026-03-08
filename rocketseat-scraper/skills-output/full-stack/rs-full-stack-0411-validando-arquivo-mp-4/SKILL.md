---
name: rs-full-stack-0411-validando-arquivo-mp-4
description: "Enforces file upload validation patterns using Zod schemas when building upload endpoints, validating file type/size/name, or handling multipart form data. Use when user asks to 'validate upload', 'check file type', 'limit file size', 'validate mimetype', or 'create upload endpoint'. Applies Zod refine for dynamic validation with configurable allowed types and max sizes. Make sure to use this skill whenever implementing file upload validation in Node.js APIs. Not for frontend file input handling, image processing, or cloud storage configuration."
---

# Validação de Arquivo com Zod

> Valide arquivos enviados via upload usando Zod schemas com mensagens dinâmicas baseadas na configuração centralizada.

## Rules

1. **Valide fileName, mimeType e size** — são as três propriedades essenciais de qualquer upload, porque formato inválido e tamanho excessivo são os erros mais comuns
2. **Use `refine` para validações customizadas** — mimeType e size precisam de lógica além de tipos primitivos, porque `z.string()` sozinho não verifica se o tipo está na lista de permitidos
3. **Centralize configuração de upload** — `acceptedImageTypes` e `maxSize` vivem em um arquivo de config exportado, porque alterações futuras propagam automaticamente para validação e mensagens
4. **Mensagens dinâmicas interpolam a config** — exiba os formatos permitidos e tamanho máximo direto da config, porque manter mensagens hardcoded desincroniza com a configuração real
5. **Use `.passthrough()` no schema** — arquivos têm propriedades extras (path, fieldName, encoding) que o Zod rejeitaria sem passthrough, porque o schema só precisa validar as três propriedades relevantes
6. **Envolva validação em try-catch** — o parse do Zod lança exceção em falha, e o bloco catch será necessário para limpar arquivos temporários inválidos

## How to write

### Upload config centralizado

```javascript
const maxSize = 3 // em MB

const uploadConfig = {
  acceptedImageTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  maxSizeFile: maxSize * 1024 * 1024,
  maxSize,
}

module.exports = uploadConfig
```

### Schema de validação com Zod

```javascript
const { z } = require("zod")
const uploadConfig = require("./upload-config")

const fileSchema = z.object({
  filename: z.string().min(1, "Arquivo é obrigatório"),
  mimetype: z.string().refine(
    (type) => uploadConfig.acceptedImageTypes.includes(type),
    `Formato de arquivo inválido. Formatos permitidos: ${uploadConfig.acceptedImageTypes}`
  ),
  size: z.number().positive().refine(
    (size) => size <= uploadConfig.maxSizeFile,
    `Arquivo excede o tamanho máximo de ${uploadConfig.maxSize}MB`
  ),
}).passthrough()
```

### Controller com try-catch

```javascript
async create(request, response) {
  try {
    const file = fileSchema.parse(request.file)
    return response.json({ message: "ok" })
  } catch (error) {
    throw error
  }
}
```

## Example

**Before (sem validação):**
```javascript
async create(request, response) {
  // Aceita qualquer arquivo sem verificar
  return response.json(request.file)
}
```

**After (com validação Zod):**
```javascript
async create(request, response) {
  try {
    const file = fileSchema.parse(request.file)
    return response.json({ message: "ok" })
  } catch (error) {
    throw error
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa validar tipo de arquivo | Use `refine` com array de tipos permitidos da config |
| Precisa limitar tamanho | Use `refine` comparando com `maxSizeFile` em bytes |
| Schema tem propriedades extras não relevantes | Use `.passthrough()` no final do `z.object()` |
| Mensagem de erro precisa mostrar limites | Interpole valores da config na mensagem |
| Quer mudar o tamanho máximo | Altere apenas `maxSize` na config — validação e mensagens atualizam sozinhas |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `if (file.mimetype !== "image/png")` hardcoded | `refine((type) => config.acceptedTypes.includes(type))` |
| `"Máximo 3MB"` hardcoded na mensagem | `` `Máximo de ${config.maxSize}MB` `` interpolado |
| Schema sem `.passthrough()` para objetos com props extras | `z.object({...}).passthrough()` |
| Validação sem try-catch | Sempre envolva `schema.parse()` em try-catch |
| `maxSizeFile: 3145728` número mágico | `maxSize * 1024 * 1024` cálculo explícito |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre validação de uploads, Zod refine, e gestão de arquivos temporários
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações