# Code Examples: Entendendo as Informações do Arquivo

## Exemplo 1: Arquivo completo de configuracao de upload

```javascript
// src/configs/upload.js
const path = require("path")
const crypto = require("crypto")
const multer = require("multer")

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp")
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads")

const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
]

// 1 KB = 1024 bytes
// 1 MB = 1024 * 1024 bytes (1024^2)
const MAX_FILE_SIZE_IN_MB = 3
const MAX_FILE_SIZE_IN_BYTES = 1024 * 1024 * MAX_FILE_SIZE_IN_MB

const storage = multer.diskStorage({
  destination: TMP_FOLDER,
  filename(request, file, callback) {
    const fileHash = crypto.randomBytes(10).toString("hex")
    const fileName = `${fileHash}-${file.originalname}`
    return callback(null, fileName)
  },
})

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE_IN_BYTES,
  multer: multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE_IN_BYTES },
  }),
}
```

## Exemplo 2: Rota com middleware de upload

```javascript
// src/routes/index.js
const { Router } = require("express")
const uploadConfig = require("../configs/upload")
const UploadController = require("../controllers/UploadController")

const routes = Router()
const uploadController = new UploadController()

routes.post(
  "/upload",
  uploadConfig.multer.single("file"),
  uploadController.create
)

module.exports = routes
```

## Exemplo 3: Controller inspecionando metadados do arquivo

```javascript
// src/controllers/UploadController.js
class UploadController {
  async create(request, response) {
    // O Multer ja salvou o arquivo na TMP_FOLDER antes de chegar aqui
    const file = request.file

    // Metadados disponiveis:
    console.log({
      fieldname: file.fieldname,       // "file"
      originalname: file.originalname, // "comprovante.jpg"
      encoding: file.encoding,         // "7bit"
      mimetype: file.mimetype,         // "image/jpeg"
      destination: file.destination,   // "/caminho/projeto/tmp"
      filename: file.filename,         // "a1b2c3d4e5-comprovante.jpg"
      path: file.path,                 // "/caminho/projeto/tmp/a1b2c3d4e5-comprovante.jpg"
      size: file.size,                 // 245760 (em bytes)
    })

    return response.json({ file: request.file })
  }
}

module.exports = UploadController
```

## Exemplo 4: Validacao completa de tipo e tamanho

```javascript
const fs = require("fs")
const path = require("path")
const { ACCEPTED_MIME_TYPES, TMP_FOLDER, UPLOADS_FOLDER } = require("../configs/upload")

class UploadController {
  async create(request, response) {
    const { mimetype, filename, size } = request.file

    // Validar MIME type usando includes() no array
    if (!ACCEPTED_MIME_TYPES.includes(mimetype)) {
      // Deletar arquivo invalido da pasta temporaria
      fs.unlinkSync(path.resolve(TMP_FOLDER, filename))

      return response.status(400).json({
        error: "Formato de arquivo não permitido.",
      })
    }

    // Mover da tmp para uploads
    const oldPath = path.resolve(TMP_FOLDER, filename)
    const newPath = path.resolve(UPLOADS_FOLDER, filename)

    fs.renameSync(oldPath, newPath)

    return response.json({ filename, size })
  }
}
```

## Exemplo 5: Variacoes de calculo de tamanho

```javascript
// Para diferentes limites de tamanho:

// 1 MB
const ONE_MB = 1024 * 1024 * 1        // 1.048.576 bytes

// 5 MB
const FIVE_MB = 1024 * 1024 * 5       // 5.242.880 bytes

// 10 MB
const TEN_MB = 1024 * 1024 * 10       // 10.485.760 bytes

// 500 KB
const FIVE_HUNDRED_KB = 1024 * 500     // 512.000 bytes

// Para verificar manualmente na controller:
if (request.file.size > FIVE_MB) {
  // arquivo grande demais
}
```

## Exemplo 6: Variacao com diferentes tipos de arquivo (nao so imagens)

```javascript
// Para aceitar PDFs alem de imagens:
const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
]

// Para aceitar documentos:
const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

// Validacao identica — includes() funciona igual
if (!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
  // rejeitar
}
```

## Exemplo 7: Estrutura de pastas do projeto

```
projeto/
├── src/
│   ├── configs/
│   │   └── upload.js          ← configuracoes centralizadas
│   ├── controllers/
│   │   └── UploadController.js
│   ├── routes/
│   │   └── index.js           ← multer como middleware na rota
│   └── server.js
├── tmp/                        ← pasta temporaria (multer deposita aqui)
│   └── uploads/                ← pasta final (arquivos validados)
├── package.json
└── .gitignore                  ← tmp/ deve estar no gitignore
```