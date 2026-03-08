# Code Examples: Validação de Arquivo com Zod

## Upload Config completo

```javascript
// src/configs/upload-config.js
const path = require("path")
const multer = require("multer")

const maxSize = 3 // em MB — altere aqui para mudar o limite globalmente

const tmpFolder = path.resolve(__dirname, "..", "..", "tmp")
const uploadsFolder = path.resolve(tmpFolder, "uploads")

const uploadConfig = {
  tmpFolder,
  uploadsFolder,
  acceptedImageTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  maxSizeFile: maxSize * 1024 * 1024, // converte MB para bytes
  maxSize, // exporta o valor em MB para mensagens

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (request, file, callback) => {
      const fileHash = Date.now()
      const fileName = `${fileHash}-${file.originalname}`
      return callback(null, fileName)
    },
  }),
}

module.exports = uploadConfig
```

## Schema de validação completo

```javascript
// src/controllers/uploads-controller.js
const { z } = require("zod")
const uploadConfig = require("../configs/upload-config")

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

class UploadsController {
  async create(request, response) {
    try {
      const file = fileSchema.parse(request.file)
      return response.json({ message: "ok" })
    } catch (error) {
      throw error
    }
  }
}

module.exports = UploadsController
```

## Variação: validação com múltiplos tipos de arquivo

```javascript
// Para aceitar PDFs além de imagens
const acceptedTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "application/pdf",
]

const fileSchema = z.object({
  filename: z.string().min(1, "Arquivo é obrigatório"),
  mimetype: z.string().refine(
    (type) => acceptedTypes.includes(type),
    `Formatos permitidos: ${acceptedTypes.join(", ")}`
  ),
  size: z.number().positive().refine(
    (size) => size <= 10 * 1024 * 1024,
    "Arquivo excede o tamanho máximo de 10MB"
  ),
}).passthrough()
```

## Variação: validação de múltiplos arquivos

```javascript
// Quando o endpoint aceita array de arquivos (multer.array())
const filesSchema = z.array(
  z.object({
    filename: z.string().min(1),
    mimetype: z.string().refine(
      (type) => uploadConfig.acceptedImageTypes.includes(type),
      `Formato inválido. Permitidos: ${uploadConfig.acceptedImageTypes}`
    ),
    size: z.number().positive().refine(
      (size) => size <= uploadConfig.maxSizeFile,
      `Excede ${uploadConfig.maxSize}MB`
    ),
  }).passthrough()
).min(1, "Envie pelo menos um arquivo").max(5, "Máximo de 5 arquivos")

// No controller
const files = filesSchema.parse(request.files)
```

## Variação: mensagens de erro formatadas

```javascript
// Usando join para formatar lista de tipos
const fileSchema = z.object({
  mimetype: z.string().refine(
    (type) => uploadConfig.acceptedImageTypes.includes(type),
    {
      message: `Formato inválido. Aceitos: ${uploadConfig.acceptedImageTypes
        .map((t) => t.split("/")[1].toUpperCase())
        .join(", ")}`,
    }
    // Resultado: "Formato inválido. Aceitos: PNG, JPEG, JPG, WEBP"
  ),
}).passthrough()
```

## Testando no Insomnia/Insomnia

### Cenário 1: Arquivo válido (PNG, < 3MB)
- Selecione um arquivo `.png` menor que 3MB
- Resultado esperado: `{ "message": "ok" }`

### Cenário 2: Formato inválido
- Selecione um arquivo com extensão não permitida (ex: `.exe`, `.txt`)
- Resultado esperado: erro com mensagem listando formatos permitidos

### Cenário 3: Arquivo muito grande
- Selecione um arquivo maior que o limite (ex: 105MB)
- Resultado esperado: erro com mensagem informando o tamanho máximo

### Cenário 4: Sem arquivo
- Envie a requisição sem selecionar arquivo
- Resultado esperado: erro "Arquivo é obrigatório"