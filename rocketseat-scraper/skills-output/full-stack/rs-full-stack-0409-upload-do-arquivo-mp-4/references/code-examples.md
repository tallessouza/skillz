# Code Examples: Upload de Arquivo com Express e Multer

## Exemplo 1: Controller básico de upload

```typescript
// src/controllers/upload-controller.ts
import { Request, Response } from "express"

class UploadController {
  async create(request: Request, response: Response) {
    // Neste ponto, req.file já foi populado pelo Multer
    return response.json({ message: "OK" })
  }
}

export { UploadController }
```

## Exemplo 2: Rotas de upload com autorização e Multer

```typescript
// src/routes/upload-routes.ts
import { Router } from "express"
import multer from "multer"

import uploadConfig from "@/configs/upload"
import { UploadController } from "@/controllers/upload-controller"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"

const uploadsRoutes = Router()
const uploadController = new UploadController()

// Autorização aplicada a todas as rotas de upload
uploadsRoutes.use(verifyUserAuthorization("employee"))

// Instancia o Multer com a configuração separada
const upload = multer(uploadConfig.multer)

// Rota POST com middleware de upload de arquivo único
uploadsRoutes.post("/", upload.single("file"), uploadController.create)

export { uploadsRoutes }
```

## Exemplo 3: Registro das rotas no index

```typescript
// src/routes/index.ts
import { uploadsRoutes } from "./upload-routes"

// ... outras importações de rotas

// Dentro das rotas privadas (que exigem autenticação)
routes.use("/uploads", uploadsRoutes)
```

## Exemplo 4: Configuração do Multer (arquivo separado)

```typescript
// src/configs/upload.ts
import multer from "multer"
import path from "node:path"

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp")

export default {
  multer: {
    storage: multer.diskStorage({
      destination: TMP_FOLDER,
      filename(request, file, callback) {
        const fileName = `${Date.now()}-${file.originalname}`
        callback(null, fileName)
      },
    }),
  },
  TMP_FOLDER,
}
```

## Exemplo 5: Controller com acesso aos dados do arquivo

```typescript
// Variação: controller que retorna informações do arquivo recebido
class UploadController {
  async create(request: Request, response: Response) {
    const file = request.file

    if (!file) {
      return response.status(400).json({ error: "No file uploaded" })
    }

    return response.json({
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
    })
  }
}
```

## Exemplo 6: Testando no Insomnia

### Configuração da requisição:
1. **Método:** POST
2. **URL:** `{{baseURL}}/uploads`
3. **Body:** Form Data (não JSON)
4. **Campo:** nome = `file`, tipo = File
5. **Header Authorization:** Bearer token (configurar via variável de ambiente)

### Configurando token como variável:
- Em Environment, criar variável `token`
- Referenciar na aba Auth: `Bearer {{token}}`
- Marcar como "Always" para enviar em toda requisição

### Resultado esperado:
```json
{
  "message": "OK"
}
```

### Verificação no sistema de arquivos:
```
tmp/
└── 1709745600000-comprovante.png   # Arquivo recebido
```

## Exemplo 7: Upload múltiplo (variação)

```typescript
// Para múltiplos arquivos, usar .array() ao invés de .single()
uploadsRoutes.post(
  "/multiple",
  upload.array("files", 5), // máximo 5 arquivos
  uploadController.createMultiple
)

// No controller:
async createMultiple(request: Request, response: Response) {
  const files = request.files as Express.Multer.File[]
  return response.json({
    count: files.length,
    files: files.map(f => f.originalname),
  })
}
```

## Exemplo 8: Estrutura final do projeto

```
src/
├── configs/
│   └── upload.ts              # export default { multer: {...}, TMP_FOLDER }
├── controllers/
│   ├── upload-controller.ts   # class UploadController { create() }
│   ├── ticket-controller.ts
│   └── session-controller.ts
├── middlewares/
│   └── verify-user-authorization.ts
├── routes/
│   ├── upload-routes.ts       # uploadsRoutes com multer middleware
│   ├── ticket-routes.ts
│   ├── session-routes.ts
│   └── index.ts               # registra todas as rotas
└── tmp/                       # pasta temporária para uploads
```