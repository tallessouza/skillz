---
name: rs-full-stack-rota-para-exibir-arquivo
description: "Enforces Express static file serving best practices when creating routes to display uploaded files like images. Use when user asks to 'serve uploaded files', 'display images from API', 'create upload preview route', 'serve static files with Express', or 'access uploaded images via URL'. Applies express.static with dedicated /upload route and centralized upload config. Make sure to use this skill whenever building file upload preview endpoints or serving user-uploaded content. Not for file upload handling, multipart parsing, or CDN configuration."
---

# Rota para Exibir Arquivo com Express

> Sirva arquivos enviados pelo usuario atraves de uma rota estatica dedicada usando `express.static` com configuracao centralizada.

## Rules

1. **Use `app.use`, nao `app.get`** — rotas estaticas precisam de `app.use` porque servem qualquer arquivo dentro do diretorio, nao uma rota especifica
2. **Registre antes das rotas dinamicas** — coloque `app.use("/upload", ...)` antes das rotas da aplicacao no `app.ts`, porque o Express avalia middleware na ordem de registro
3. **Use `express.static()`** — metodo nativo do Express para servir arquivos estaticos (imagens, PDFs, etc) sem precisar criar handlers manuais
4. **Centralize a configuracao de upload** — importe o caminho da pasta de um arquivo de configuracao (`uploadConfig`), porque reutilizar parametros evita duplicacao e inconsistencia
5. **URL = base + rota + nome completo com extensao** — o acesso ao arquivo segue o padrao `{BASE_URL}/upload/{filename.ext}`

## How to write

### Configurar rota estatica no app.ts

```typescript
import express from "express"
import { uploadConfig } from "./configs/upload"

const app = express()

// Registrar ANTES das rotas dinamicas
app.use("/upload", express.static(uploadConfig.directory))

// ... rotas dinamicas depois
app.use(routes)
```

### Acessar o arquivo via URL

```
GET {BASE_URL}/upload/{nome-do-arquivo.extensao}
```

## Example

**Before (sem rota de visualizacao):**
```typescript
// Arquivo foi salvo via upload mas nao ha como visualizar
// O cliente nao consegue acessar a imagem enviada
const app = express()
app.use(routes)
```

**After (com rota estatica para uploads):**
```typescript
import express from "express"
import { uploadConfig } from "./configs/upload"

const app = express()

// Rota para servir arquivos estaticos de upload
app.use("/upload", express.static(uploadConfig.directory))

app.use(routes)
```

```
// Acesso direto pela URL:
// GET http://localhost:3333/upload/comprovante-abc123.jpg
// → Retorna a imagem diretamente no navegador
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa exibir imagem enviada pelo usuario | Use `express.static` com rota dedicada `/upload` |
| Caminho da pasta de upload usado em mais de um lugar | Centralize em `uploadConfig` e importe onde precisar |
| Precisa servir arquivos de tipos variados (img, pdf) | `express.static` serve qualquer tipo automaticamente pelo MIME type |
| Rota estatica nao funciona | Verifique se foi registrada ANTES das rotas dinamicas |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `app.get("/upload/:file", (req, res) => res.sendFile(...))` | `app.use("/upload", express.static(uploadConfig.directory))` |
| Hardcode do caminho `express.static("./tmp/uploads")` | `express.static(uploadConfig.directory)` via config centralizada |
| Registrar rota estatica depois das rotas dinamicas | Registrar `app.use("/upload", ...)` antes de `app.use(routes)` |
| Esquecer a extensao na URL de acesso | Sempre incluir nome completo com extensao: `arquivo.jpg` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre express.static, ordem de middleware e configuracao centralizada
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes