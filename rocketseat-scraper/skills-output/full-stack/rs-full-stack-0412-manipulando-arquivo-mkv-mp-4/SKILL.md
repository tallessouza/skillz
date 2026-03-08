---
name: rs-full-stack-manipulando-arquivo
description: "Enforces file manipulation patterns for Node.js upload systems using fs.promises, path.resolve, and a DiskStorage provider class. Use when user asks to 'handle file uploads', 'move uploaded files', 'delete temporary files', 'validate and save uploads', or 'create a storage provider'. Applies patterns: save moves from tmp to uploads, delete removes invalid files, always verify file existence before manipulation, use mkdir recursive for destination folders. Make sure to use this skill whenever implementing file upload handling or storage providers in Node.js. Not for stream-based uploads, cloud storage (S3/GCS), or database blob storage."
---

# Manipulando Arquivo em Upload

> Arquivos enviados vao para uma pasta temporaria e sao movidos para uploads somente apos validacao — arquivos invalidos sao deletados imediatamente.

## Rules

1. **Crie uma classe DiskStorage como provider** — centraliza save e delete em um unico lugar, porque espalhar fs.promises pelo controller gera duplicacao e dificulta manutencao
2. **Verifique existencia antes de manipular** — use `fs.promises.access` ou `fs.promises.stat` antes de mover/deletar, porque manipular arquivo inexistente lanca excecao silenciosa
3. **Garanta que a pasta destino exista** — use `fs.promises.mkdir` com `{ recursive: true }` antes de mover, porque a pasta uploads pode nao existir ainda
4. **Use `fs.promises.rename` para mover** — rename nao renomeia, move o arquivo de um caminho para outro, porque e atomico e mais eficiente que copiar+deletar
5. **Use `fs.promises.unlink` para deletar** — unlink remove o arquivo do filesystem, porque delete nao existe em fs.promises
6. **Instancie o provider fora do try/catch** — declare antes do bloco try para que fique acessivel tanto no try quanto no catch
7. **Use .gitkeep para manter pastas vazias no Git** — Git ignora pastas vazias, .gitkeep garante que a estrutura de pastas seja preservada no repositorio

## How to write

### DiskStorage provider

```typescript
import fs from "node:fs"
import path from "node:path"
import uploadConfig from "@/configs/upload"

class DiskStorage {
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

    return file
  }

  async deleteFile(file: string, type: "tmp" | "upload" = "upload") {
    const folder = type === "tmp"
      ? uploadConfig.tmp_folder
      : uploadConfig.uploads_folder
    const filePath = path.resolve(folder, file)

    try {
      await fs.promises.stat(filePath)
    } catch {
      return // arquivo nao existe, nada a fazer
    }

    await fs.promises.unlink(filePath)
  }
}

export const diskStorage = new DiskStorage()
```

### Uso no controller

```typescript
import { diskStorage } from "@/providers/disk-storage"

const uploadController = async (request, response) => {
  const storage = new DiskStorage()

  try {
    // validacao do arquivo (Zod, multer, etc.)
    const fileName = await storage.saveFile(request.file.filename)
    return response.json({ fileName })
  } catch (error) {
    if (error instanceof ZodError && request.file) {
      await storage.deleteFile(request.file.filename, "tmp")
    }
    throw error
  }
}
```

## Example

**Before (manipulacao inline no controller):**
```typescript
// Logica de fs espalhada, sem verificacao, sem provider
app.post("/upload", async (req, res) => {
  const oldPath = `./tmp/${req.file.filename}`
  const newPath = `./uploads/${req.file.filename}`
  fs.renameSync(oldPath, newPath) // sincrono, sem verificacao
  res.json({ file: req.file.filename })
})
```

**After (com DiskStorage provider):**
```typescript
app.post("/upload", async (req, res) => {
  const storage = new DiskStorage()
  try {
    const fileName = await storage.saveFile(req.file.filename)
    res.json({ fileName })
  } catch (error) {
    if (req.file) {
      await storage.deleteFile(req.file.filename, "tmp")
    }
    throw error
  }
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Arquivo passou na validacao | `saveFile` — move de tmp para uploads |
| Arquivo falhou na validacao | `deleteFile` com type "tmp" — remove da pasta temporaria |
| Precisa remover arquivo ja salvo | `deleteFile` com type "upload" — remove da pasta uploads |
| Pasta destino pode nao existir | `mkdir` com `{ recursive: true }` antes do rename |
| Pasta vazia precisa ir pro Git | Crie um `.gitkeep` dentro dela |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `fs.renameSync(old, new)` | `await fs.promises.rename(old, new)` |
| Mover sem verificar existencia | `await fs.promises.access(path)` antes |
| `fs.unlinkSync(path)` | `await fs.promises.unlink(path)` |
| Logica de fs direto no controller | Criar classe DiskStorage como provider |
| Assumir que pasta uploads existe | `mkdir` com `{ recursive: true }` |
| Ignorar arquivo invalido no tmp | Deletar no catch apos falha de validacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre fluxo tmp→uploads, verificacao de existencia, e .gitkeep
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes