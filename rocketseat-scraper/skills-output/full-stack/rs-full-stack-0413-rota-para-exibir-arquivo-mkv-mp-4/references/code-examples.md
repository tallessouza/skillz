# Code Examples: Rota para Exibir Arquivo

## Exemplo 1: Configuracao basica no app.ts

```typescript
// src/app.ts
import express from "express"
import { uploadConfig } from "./configs/upload"
import { routes } from "./routes"
import { errorHandler } from "./middlewares/error-handler"

const app = express()

app.use(express.json())

// Rota estatica para servir arquivos de upload
app.use("/upload", express.static(uploadConfig.directory))

// Rotas dinamicas
app.use(routes)

// Tratamento de erros (sempre por ultimo)
app.use(errorHandler)

export { app }
```

## Exemplo 2: Arquivo de configuracao de upload (referencia)

```typescript
// src/configs/upload.ts
import path from "node:path"
import multer from "multer"

const directory = path.resolve(__dirname, "..", "..", "tmp", "uploads")

const storage = multer.diskStorage({
  destination: directory,
  filename: (req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const extension = path.extname(file.originalname)
    callback(null, `${uniqueSuffix}${extension}`)
  },
})

export const uploadConfig = {
  directory,
  storage,
}
```

## Exemplo 3: Testando no Insomnia

### Requisicao de upload (POST)
```
POST http://localhost:3333/uploads
Content-Type: multipart/form-data

Body: arquivo de imagem (comprovante.jpg)
```

### Resposta do upload
```json
{
  "filename": "1709234567890-123456789.jpg"
}
```

### Requisicao de visualizacao (GET)
```
GET http://localhost:3333/upload/1709234567890-123456789.jpg
```

Resposta: a imagem renderizada diretamente.

## Exemplo 4: Variacao com multiplos diretorios estaticos

```typescript
// Se precisar servir arquivos de diferentes pastas
app.use("/upload", express.static(uploadConfig.directory))
app.use("/assets", express.static(path.resolve(__dirname, "..", "public")))
```

## Exemplo 5: Com opcoes de cache (producao)

```typescript
// Em producao, adicionar cache para arquivos estaticos
app.use("/upload", express.static(uploadConfig.directory, {
  maxAge: "1d",        // Cache de 1 dia no navegador
  etag: true,          // Habilitar ETag para validacao
  lastModified: true,  // Header Last-Modified
}))
```

## Exemplo 6: Endpoint que retorna a URL completa do arquivo

```typescript
// No controller de upload, retornar a URL completa
class UploadsController {
  async create(request: Request, response: Response) {
    const file = request.file

    if (!file) {
      throw new AppError("Arquivo nao enviado")
    }

    // Retorna nome e URL completa para o cliente
    return response.json({
      filename: file.filename,
      url: `${request.protocol}://${request.get("host")}/upload/${file.filename}`,
    })
  }
}
```