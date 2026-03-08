---
name: rs-full-stack-upload-do-arquivo
description: "Generates file upload endpoints with Express and Multer when building APIs that handle file submissions. Use when user asks to 'upload a file', 'handle file upload', 'create upload route', 'receive files via API', or 'configure multer'. Applies patterns: separate upload config, multer middleware with single/multi, authorization before upload, temp folder storage, form-data field naming. Make sure to use this skill whenever implementing any file upload functionality in Express. Not for cloud storage integration, image processing, or streaming large files."
---

# Upload de Arquivo com Express e Multer

> Configure upload de arquivos separando a configuração do Multer em arquivo próprio, aplicando autorização antes do middleware de upload, e usando `upload.single()` com campo nomeado.

## Rules

1. **Separe a configuração do Multer em arquivo dedicado** — crie `configs/upload.ts` com `export default`, porque misturar config de storage com rotas polui o código e dificulta reuso
2. **Aplique autorização ANTES do middleware de upload** — `routes.use(verifyUserAuthorization)` vem antes de `routes.post("/", upload.single(...))`, porque arquivos não autorizados nunca devem chegar ao disco
3. **Use `upload.single("fieldName")` como middleware de rota** — passe entre a rota e o controller, porque o Multer precisa processar o form-data antes do controller acessar `req.file`
4. **Nomeie o campo do form-data explicitamente** — o nome passado em `single("file")` deve corresponder exatamente ao campo enviado no cliente, porque divergência causa upload silenciosamente vazio
5. **Armazene temporariamente em pasta `tmp/`** — configure `dest` ou `diskStorage` apontando para pasta temporária, porque o processamento definitivo acontece em etapa posterior

## Steps

### Step 1: Criar o controller de upload

```typescript
// src/controllers/upload-controller.ts
import { Request, Response } from "express"

class UploadController {
  async create(request: Request, response: Response) {
    // req.file disponível após middleware multer
    return response.json({ message: "OK" })
  }
}

export { UploadController }
```

### Step 2: Criar o arquivo de rotas com Multer

```typescript
// src/routes/upload-routes.ts
import { Router } from "express"
import multer from "multer"

import uploadConfig from "@/configs/upload"
import { UploadController } from "@/controllers/upload-controller"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"

const uploadsRoutes = Router()
const uploadController = new UploadController()

// Autorização primeiro — bloqueia antes de processar arquivo
uploadsRoutes.use(verifyUserAuthorization("employee"))

const upload = multer(uploadConfig.multer)

// upload.single("file") como middleware entre rota e controller
uploadsRoutes.post("/", upload.single("file"), uploadController.create)

export { uploadsRoutes }
```

### Step 3: Registrar nas rotas privadas

```typescript
// src/routes/index.ts
import { uploadsRoutes } from "./upload-routes"

// Dentro das rotas privadas (autenticadas)
routes.use("/uploads", uploadsRoutes)
```

### Step 4: Testar com Insomnia/Postman

1. Selecione método **POST** para `{{baseURL}}/uploads`
2. Em Body, escolha **Form Data** (não JSON)
3. Adicione campo com nome `file`, tipo **File**
4. Selecione o arquivo e envie
5. Verifique que o arquivo aparece na pasta `tmp/`

## Output format

```
src/
├── configs/
│   └── upload.ts          # Configuração do Multer (export default)
├── controllers/
│   └── upload-controller.ts
├── routes/
│   ├── upload-routes.ts
│   └── index.ts           # Registra uploadsRoutes
└── tmp/                   # Pasta temporária para arquivos recebidos
```

## Error handling

- Se upload retorna "não autorizado" → verificar se o token está sendo enviado e se o perfil do usuário tem permissão (ex: `employee`)
- Se `upload.single("file")` não recebe arquivo → verificar se o campo no form-data tem exatamente o mesmo nome passado em `single()`
- Se `uploadConfig.multer` não lista propriedades → verificar se o arquivo de config usa `export default`

## Verification

- Enviar arquivo via form-data e receber resposta 200 com mensagem OK
- Arquivo aparece na pasta `tmp/` após o envio
- Requisição sem token retorna 401
- Requisição com perfil não autorizado retorna 403

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação de config, ordem de middlewares e fluxo do Multer
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações