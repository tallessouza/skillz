---
name: rs-full-stack-config-upload
description: "Enforces file upload configuration best practices when setting up Multer for file handling in Node.js/Express APIs. Use when user asks to 'configure upload', 'handle file upload', 'set up multer', 'upload images', or 'receive files in API'. Applies rules: use path.resolve for OS-independent paths, temporary folder before final destination, crypto hash for unique filenames, explicit file size limits, whitelist accepted MIME types. Make sure to use this skill whenever implementing file upload in any Node.js backend. Not for cloud storage (S3/GCS), streaming uploads, or frontend file input components."
---

# Configuração de Upload de Arquivos com Multer

> Configure uploads com pasta temporária, nomes únicos via hash, limites de tamanho e whitelist de tipos aceitos.

## Prerequisites

- Node.js com Express configurado
- Instalar `multer@1.4.5-lts.1` e `@types/multer@1.4.12` (devDependency)

## Steps

### Step 1: Criar arquivo de configuração

Criar `src/configs/upload.ts` com imports do multer, path e crypto do Node.

```typescript
import multer from "multer"
import { resolve } from "node:path"
import { randomBytes } from "node:crypto"
```

### Step 2: Definir pastas com path.resolve

Usar `path.resolve` para garantir compatibilidade entre sistemas operacionais (Windows usa `\`, Linux/Mac usa `/`).

```typescript
const TMP_FOLDER = resolve(__dirname, "..", "..", "tmp")
const UPLOADS_FOLDER = resolve(TMP_FOLDER, "uploads")
```

### Step 3: Definir limites e tipos aceitos

```typescript
const FILE_SIZE = 1024 * 1024 * 3 // 3MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"]
```

### Step 4: Configurar multer com diskStorage

```typescript
const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      const fileHash = randomBytes(10).toString("hex")
      const fileName = `${fileHash}-${file.originalname}`
      return callback(null, fileName)
    },
  }),
}
```

### Step 5: Exportar configurações

```typescript
export { TMP_FOLDER, UPLOADS_FOLDER, MULTER, FILE_SIZE, ACCEPTED_IMAGE_TYPES }
```

## Output format

Arquivo `src/configs/upload.ts` exportando: `TMP_FOLDER`, `UPLOADS_FOLDER`, `MULTER`, `FILE_SIZE`, `ACCEPTED_IMAGE_TYPES`.

## Heuristics

| Situação | Faça |
|----------|------|
| Receber arquivo no backend | Envie para TMP_FOLDER primeiro, manipule, depois mova para UPLOADS_FOLDER |
| Nomes de arquivo duplicados | Use crypto.randomBytes para gerar hash único como prefixo |
| Caminhos de pasta no projeto | Sempre use `path.resolve` com `__dirname`, nunca concatenação manual de strings |
| Limite de tamanho | Defina FILE_SIZE explicitamente em bytes (1024 * 1024 * N) |
| Tipos de arquivo | Whitelist explícita de MIME types aceitos, nunca aceite qualquer tipo |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `"../../tmp"` (string concatenada) | `resolve(__dirname, "..", "..", "tmp")` |
| Salvar arquivo direto na pasta final | Salvar em tmp, manipular, depois mover para uploads |
| Manter nome original do arquivo | Prefixar com hash: `${hash}-${originalname}` |
| Aceitar qualquer tipo de arquivo | Definir whitelist: `["image/jpeg", "image/png"]` |
| Sem limite de tamanho | Definir `FILE_SIZE` explícito |

## Error handling

- Se pasta tmp não existir: criar com `fs.mkdirSync(TMP_FOLDER, { recursive: true })` no startup
- Se arquivo exceder FILE_SIZE: multer rejeita automaticamente com erro
- Se tipo não aceito: validar contra ACCEPTED_IMAGE_TYPES antes de processar

## Verification

- Pasta tmp existe na raiz do projeto
- Upload de arquivo gera nome com hash (ex: `a1b2c3d4e5-foto.jpg`)
- Arquivo aparece primeiro em tmp/, depois é movido para tmp/uploads/
- Arquivos maiores que 3MB são rejeitados

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre path.resolve, fluxo tmp→uploads e segurança de nomes
- [code-examples.md](references/code-examples.md) — Código completo do upload.ts com variações e integração com rotas