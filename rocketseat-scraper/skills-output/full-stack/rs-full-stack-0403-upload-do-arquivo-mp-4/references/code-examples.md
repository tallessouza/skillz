# Code Examples: Upload de Arquivo via FormData

## Exemplo 1: Componente completo de upload

```typescript
import { ChangeEvent, useState } from "react"
import { api } from "../lib/api"

export function RefundForm() {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  async function handleSubmit() {
    setIsLoading(true)

    try {
      // Validacao do arquivo
      if (!file) {
        alert("Selecione um arquivo de comprovante.")
        return
      }

      // Criar FormData para transportar o arquivo
      const fileUploadForm = new FormData()
      fileUploadForm.append("file", file)

      // Enviar arquivo para API de upload
      const response = await api.post("/uploads", fileUploadForm)

      // Usar o filename retornado pela API (pode ter sido renomeado)
      const uploadedFilename = response.data.filename

      // Salvar a solicitacao com referencia ao arquivo
      await api.post("/refunds", {
        description,
        amount: Number(amount),
        filename: uploadedFilename,
      })

      alert("Solicitação enviada!")
    } catch (error) {
      console.error(error)
      alert("Erro ao enviar solicitação.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Valor"
      />

      {/* Componente de upload exibe o nome do arquivo selecionado */}
      <input type="file" onChange={handleFileChange} />
      {file && <span>{file.name}</span>}

      <button type="button" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  )
}
```

## Exemplo 2: Verificando o campo esperado pela API

```typescript
// No backend (Express + Multer)
// O campo "file" aqui define o que o frontend deve usar no FormData.append()
const uploadMiddleware = multer(uploadConfig).single("file")

router.post("/uploads", uploadMiddleware, uploadController.store)
```

```typescript
// No frontend — o primeiro argumento do append DEVE ser "file"
const formData = new FormData()
formData.append("file", file) // ← "file" corresponde ao .single("file") do multer
```

## Exemplo 3: API de upload (backend)

```typescript
// upload-controller.ts
import { Request, Response } from "express"
import { DiskStorage } from "../providers/DiskStorage"

class UploadController {
  async store(request: Request, response: Response) {
    const diskStorage = new DiskStorage()

    // request.file vem do multer middleware
    if (!request.file) {
      return response.status(400).json({ error: "File is required." })
    }

    // Salva o arquivo (pode renomear internamente)
    const filename = await diskStorage.save(request.file.filename)

    // Retorna o nome final do arquivo
    return response.json({ filename })
  }
}
```

## Exemplo 4: DiskStorage que renomeia o arquivo

```typescript
// disk-storage.ts
import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { UPLOADS_FOLDER, TMP_FOLDER } from "../configs/upload"

class DiskStorage {
  async save(file: string): Promise<string> {
    // Gera hash unico para evitar colisao de nomes
    const fileHash = crypto.randomBytes(10).toString("hex")
    const fileName = `${fileHash}-${file}`

    await fs.promises.rename(
      path.resolve(TMP_FOLDER, file),
      path.resolve(UPLOADS_FOLDER, fileName)
    )

    return fileName
  }
}
```

## Exemplo 5: Acessando o arquivo armazenado

```typescript
// Rota estatica no Express para servir arquivos de upload
import express from "express"
import { UPLOADS_FOLDER } from "./configs/upload"

const app = express()
app.use("/uploads", express.static(UPLOADS_FOLDER))

// Acesso: GET http://localhost:3333/uploads/abc123-comprovante.jpg
```

## Exemplo 6: Exibindo o arquivo no frontend

```tsx
function RefundItem({ filename }: { filename: string }) {
  const fileUrl = `http://localhost:3333/uploads/${filename}`

  return (
    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
      Ver comprovante
    </a>
  )
}
```

## Exemplo 7: Mantendo .gitkeep em pastas vazias

```
uploads/
├── .gitkeep    ← Forca o Git a rastrear a pasta vazia
```

```gitignore
# .gitignore — ignora arquivos de upload mas mantem a pasta
uploads/*
!uploads/.gitkeep
```