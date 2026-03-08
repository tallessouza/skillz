# Code Examples: Configuração de Upload de Arquivos com Multer

## Exemplo completo: upload.ts

```typescript
import multer from "multer"
import { resolve } from "node:path"
import { randomBytes } from "node:crypto"

const TMP_FOLDER = resolve(__dirname, "..", "..", "tmp")
const UPLOADS_FOLDER = resolve(TMP_FOLDER, "uploads")

const FILE_SIZE = 1024 * 1024 * 3 // 3MB

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"]

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

export { TMP_FOLDER, UPLOADS_FOLDER, MULTER, FILE_SIZE, ACCEPTED_IMAGE_TYPES }
```

## Instalação das dependências

```bash
npm install multer@1.4.5-lts.1
npm install @types/multer@1.4.12 -D
```

## Variações

### Com validação de tipo no próprio multer

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
  limits: {
    fileSize: FILE_SIZE,
  },
  fileFilter(request: any, file: any, callback: any) {
    if (ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
      return callback(null, true)
    }
    return callback(new Error("Tipo de arquivo não aceito."))
  },
}
```

### Com criação automática das pastas

```typescript
import { mkdirSync } from "node:fs"

const TMP_FOLDER = resolve(__dirname, "..", "..", "tmp")
const UPLOADS_FOLDER = resolve(TMP_FOLDER, "uploads")

// Garante que as pastas existem ao iniciar a aplicação
mkdirSync(TMP_FOLDER, { recursive: true })
mkdirSync(UPLOADS_FOLDER, { recursive: true })
```

### Uso em uma rota Express

```typescript
import { Router } from "express"
import multer from "multer"
import { MULTER } from "../configs/upload"

const router = Router()
const upload = multer(MULTER)

router.patch("/users/avatar", upload.single("avatar"), async (request, response) => {
  // request.file contém os metadados do arquivo salvo em tmp/
  const { filename } = request.file!

  // Aqui você manipula e move para uploads/
  return response.json({ filename })
})
```

### Estrutura de pastas esperada

```
projeto/
├── src/
│   ├── configs/
│   │   └── upload.ts      ← arquivo de configuração
│   ├── routes/
│   └── server.ts
├── tmp/                    ← arquivos temporários (gitignore)
│   └── uploads/            ← arquivos processados (gitignore)
├── package.json
└── .gitignore              ← incluir tmp/
```

### .gitignore recomendado

```gitignore
tmp/
```

### Exemplo de nome de arquivo gerado

```
# Original: foto-perfil.jpg
# Gerado:   3a8f2b1c9d4e-foto-perfil.jpg

# Original: documento.png
# Gerado:   7f1a3c5e9b2d-documento.png
```

### Cálculo de FILE_SIZE para diferentes limites

```typescript
const ONE_MB = 1024 * 1024 * 1    // 1MB
const THREE_MB = 1024 * 1024 * 3  // 3MB
const FIVE_MB = 1024 * 1024 * 5   // 5MB
const TEN_MB = 1024 * 1024 * 10   // 10MB
```