---
name: rs-full-stack-0410-entendendo-info-arquivo
description: "Enforces file upload validation patterns when handling Multer uploads, inspecting file metadata, validating MIME types against allowed lists, and calculating file sizes in bytes. Use when user asks to 'upload a file', 'validate file type', 'check file size', 'configure Multer', or 'handle file uploads in Express'. Applies rules: temp folder before final destination, validate before moving, unique filenames with hash, MIME type array for includes() check, byte math for size limits. Make sure to use this skill whenever implementing file upload flows in Node.js/Express. Not for frontend drag-and-drop UI, cloud storage (S3), or streaming large files."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [multer, upload, validation, mime-type, file-size, crypto]
---

# Entendendo as Informações do Arquivo (Multer Upload)

> Arquivos enviados pelo usuário vao para uma pasta temporaria primeiro, sao validados (tipo e tamanho), e so entao movidos para o destino final.

## Rules

1. **Sempre use pasta temporaria como destino inicial** — o Multer leva o arquivo para `tmp/` antes da controller executar, porque validacao acontece antes de persistir
2. **Valide tipo e tamanho antes de mover** — se o arquivo nao atende os criterios, delete da pasta temporaria em vez de mover para o destino final
3. **Gere nomes unicos com hash** — use `crypto.randomBytes(10).toString('hex')` + nome original, porque dois usuarios podem subir arquivos com o mesmo nome e sobrepor o anterior
4. **Armazene MIME types aceitos em array constante** — use `includes()` para verificar se o formato e permitido, porque e mais legivel e extensivel que encadear comparacoes
5. **Calcule tamanhos em bytes** — 1 KB = 1024 bytes, 1 MB = 1024² bytes. Multiplique pelo numero de megabytes desejado para comparar no mesmo padrao de grandeza
6. **Extraia configuracoes em constantes nomeadas** — pasta temporaria, pasta final, tamanho maximo, tipos aceitos, tudo separado e nomeado para facilitar manutencao

## How to write

### Configuracao de upload com constantes

```javascript
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

// 1 KB = 1024 bytes, 1 MB = 1024^2 bytes
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
  multerConfig: { storage, limits: { fileSize: MAX_FILE_SIZE_IN_BYTES } },
}
```

### Rota com Multer como middleware

```javascript
const upload = multer(uploadConfig.multerConfig)

routes.post("/upload", upload.single("file"), uploadController.create)
```

### Inspecionando request.file na controller

```javascript
class UploadController {
  async create(request, response) {
    const { originalname, mimetype, filename, path, size } = request.file

    // originalname: "comprovante.jpg"
    // mimetype: "image/jpeg"
    // filename: "a1b2c3d4e5-comprovante.jpg" (hash + original)
    // path: caminho completo onde foi salvo na tmp
    // size: tamanho em bytes
  }
}
```

## Example

**Before (sem validacao, sem hash):**
```javascript
const storage = multer.diskStorage({
  destination: "uploads/",
  filename(req, file, cb) {
    cb(null, file.originalname) // risco de sobreposicao
  },
})

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ message: "ok" }) // sem inspecionar o arquivo
})
```

**After (com this skill applied):**
```javascript
const storage = multer.diskStorage({
  destination: TMP_FOLDER,
  filename(req, file, cb) {
    const hash = crypto.randomBytes(10).toString("hex")
    cb(null, `${hash}-${file.originalname}`)
  },
})

app.post("/upload", upload.single("file"), (req, res) => {
  const { mimetype, size, filename } = req.file

  if (!ACCEPTED_MIME_TYPES.includes(mimetype)) {
    // deletar arquivo da tmp e retornar erro
  }

  // mover de TMP_FOLDER para UPLOADS_FOLDER
  res.json({ filename })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Arquivo recebido do usuario | Sempre vai para pasta temporaria primeiro |
| Precisa validar formato | Compare `mimetype` contra array de MIME types com `includes()` |
| Precisa validar tamanho | Use `limits.fileSize` no Multer (em bytes) |
| Nomes de arquivo | Hash aleatorio + nome original para evitar colisao |
| Caminho do projeto | Use `__dirname` com `path.resolve()` para caminhos dinamicos |
| Calculo de tamanho | `1024 * 1024 * MB_DESEJADOS` para converter MB em bytes |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `destination: "uploads/"` (direto no destino final) | `destination: TMP_FOLDER` (temporaria primeiro) |
| `cb(null, file.originalname)` (nome original direto) | `cb(null, \`${hash}-${file.originalname}\`)` |
| `if (type === "jpeg" \|\| type === "png")` | `ACCEPTED_MIME_TYPES.includes(mimetype)` |
| `limits: { fileSize: 3145728 }` (numero magico) | `limits: { fileSize: 1024 * 1024 * 3 }` (calculo explicito) |
| Constantes espalhadas pelo codigo | Constantes centralizadas em arquivo de configuracao |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `request.file` não tem `mimetype` | Multer não processou o arquivo corretamente | Verifique se `upload.single("file")` está como middleware antes do controller |
| Arquivo aceito mesmo com tipo inválido | Validação de MIME type não implementada | Use `ACCEPTED_MIME_TYPES.includes(mimetype)` antes de mover |
| Número mágico no limite de tamanho | Tamanho hardcoded como bytes direto | Use `1024 * 1024 * MAX_MB` com constante nomeada |
| Hash não aparece no nome do arquivo | `crypto.randomBytes` não chamado no `filename` callback | Adicione geração de hash no `diskStorage.filename` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre fluxo temporario→final, calculo de bytes, e estrategia de hash
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes