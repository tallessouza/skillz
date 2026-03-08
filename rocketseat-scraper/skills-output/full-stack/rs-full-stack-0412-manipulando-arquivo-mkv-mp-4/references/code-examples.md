# Code Examples: Manipulando Arquivo em Upload

## Exemplo 1: Classe DiskStorage completa

```typescript
// src/providers/disk-storage.ts
import fs from "node:fs"
import path from "node:path"
import uploadConfig from "@/configs/upload"

class DiskStorage {
  async saveFile(file: string) {
    const tmpPath = path.resolve(uploadConfig.tmp_folder, file)
    const destPath = path.resolve(uploadConfig.uploads_folder, file)

    try {
      await fs.promises.access(tmpPath)
    } catch (error) {
      console.log(error)
      throw new Error(`Arquivo nao encontrado: ${tmpPath}`)
    }

    await fs.promises.mkdir(uploadConfig.uploads_folder, { recursive: true })
    await fs.promises.rename(tmpPath, destPath)

    return file
  }

  async deleteFile(file: string, type: "tmp" | "upload" = "upload") {
    const pathFile = type === "tmp"
      ? uploadConfig.tmp_folder
      : uploadConfig.uploads_folder

    const filePath = path.resolve(pathFile, file)

    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath)
  }
}

export const diskStorage = new DiskStorage()
```

## Exemplo 2: Controller de upload com validacao e manipulacao

```typescript
// src/controllers/upload-controller.ts
import { ZodError } from "zod"
import { DiskStorage } from "@/providers/disk-storage"
import { AppError } from "@/utils/app-error"

export class UploadController {
  async create(request, response) {
    const storage = new DiskStorage()

    try {
      // Validacao do arquivo com Zod (tipo, tamanho, etc.)
      // ... schema.parse(request.file) ...

      const fileName = await storage.saveFile(request.file.filename)
      return response.json({ fileName })
    } catch (error) {
      if (error instanceof ZodError) {
        if (request.file) {
          await storage.deleteFile(request.file.filename, "tmp")
        }
        throw new AppError(error.issues)
      }
      throw error
    }
  }
}
```

## Exemplo 3: Configuracao de upload referenciada

```typescript
// src/configs/upload.ts
import path from "node:path"
import multer from "multer"

const tmp_folder = path.resolve(__dirname, "..", "..", "tmp")
const uploads_folder = path.resolve(tmp_folder, "..", "uploads")

export default {
  tmp_folder,
  uploads_folder,
  storage: multer.diskStorage({
    destination: tmp_folder,
    filename: (request, file, callback) => {
      const uniqueName = `${Date.now()}-${file.originalname}`
      callback(null, uniqueName)
    },
  }),
}
```

## Exemplo 4: Variacao — deleteFile sem parametro type

Se o projeto so deleta da pasta uploads (ex: remover avatar antigo):

```typescript
async deleteFile(file: string) {
  const filePath = path.resolve(uploadConfig.uploads_folder, file)

  try {
    await fs.promises.stat(filePath)
  } catch {
    return
  }

  await fs.promises.unlink(filePath)
}
```

## Exemplo 5: Variacao — saveFile com retorno do path completo

```typescript
async saveFile(file: string) {
  const tmpPath = path.resolve(uploadConfig.tmp_folder, file)
  const destPath = path.resolve(uploadConfig.uploads_folder, file)

  try {
    await fs.promises.access(tmpPath)
  } catch {
    throw new Error(`Arquivo nao encontrado: ${tmpPath}`)
  }

  await fs.promises.mkdir(uploadConfig.uploads_folder, { recursive: true })
  await fs.promises.rename(tmpPath, destPath)

  return { fileName: file, path: destPath }
}
```

## Exemplo 6: Estrutura de pastas do projeto

```
projeto/
├── src/
│   ├── configs/
│   │   └── upload.ts          # Configuracao de multer e paths
│   ├── controllers/
│   │   └── upload-controller.ts
│   ├── providers/
│   │   └── disk-storage.ts    # Classe DiskStorage
│   └── utils/
│       └── app-error.ts
├── tmp/                        # Pasta temporaria (multer salva aqui)
│   └── (arquivos pendentes)
└── uploads/                    # Pasta definitiva (apos validacao)
    └── .gitkeep               # Manter pasta vazia no Git
```

## Exemplo 7: .gitkeep e .gitignore

```gitignore
# .gitignore
tmp/*
!tmp/.gitkeep
uploads/*
!uploads/.gitkeep
```

```bash
# Criar .gitkeep
touch uploads/.gitkeep
touch tmp/.gitkeep
```

## Metodos do fs.promises usados

| Metodo | O que faz | Quando usar |
|--------|-----------|-------------|
| `access(path)` | Verifica se o processo pode acessar o arquivo | Antes de mover (saveFile) |
| `stat(path)` | Retorna metadados do arquivo | Antes de deletar (deleteFile) |
| `mkdir(path, opts)` | Cria diretorio | Garantir que uploads/ existe |
| `rename(old, new)` | Move arquivo | Mover de tmp para uploads |
| `unlink(path)` | Deleta arquivo | Remover arquivo invalido/antigo |