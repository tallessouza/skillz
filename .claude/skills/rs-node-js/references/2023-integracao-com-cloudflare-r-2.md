---
name: rs-node-js-2023-integracao-cloudflare-r2
description: "Applies Cloudflare R2 storage integration patterns when building file upload features in NestJS applications. Use when user asks to 'upload files', 'integrate S3', 'setup Cloudflare R2', 'configure object storage', or 'store files in the cloud'. Enforces AWS SDK S3 client usage, unique filename generation, dependency inversion for storage, and saving file references instead of full URLs. Make sure to use this skill whenever implementing file storage or upload infrastructure in Node.js/NestJS. Not for frontend file upload UI, image processing, or video transcoding."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: cloudflare-r2-integration
  tags: [cloudflare-r2, s3, file-upload, object-storage, nestjs, aws-sdk, dependency-inversion]
---

# Integração com Cloudflare R2

> Ao implementar upload de arquivos, use o Cloudflare R2 com a SDK do AWS S3 e salve apenas referências (nunca URLs completas) no banco de dados.

## Rules

1. **Use AWS SDK para Cloudflare R2** — instale `@aws-sdk/client-s3` e use `S3Client` + `PutObjectCommand`, porque o R2 reutiliza a API do S3 e isso permite trocar entre provedores sem alterar código
2. **Gere nomes únicos para arquivos** — prefixe com `randomUUID()` no formato `${id}-${filename}`, porque usuários diferentes podem fazer upload de arquivos com o mesmo nome
3. **Salve referência, nunca URL completa** — armazene no banco apenas o nome/key do arquivo, porque se mudar de provedor de storage a URL muda mas o nome não
4. **Aplique inversão de dependência** — crie uma interface `Uploader` no domínio e implemente `R2Storage` na infra, porque isso desacopla o caso de uso do provedor de storage
5. **Use `@Injectable()` no storage** — sem o decorator o NestJS não consegue injetar dependências como `EnvService`
6. **Configure credentials via variáveis de ambiente** — `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET_NAME`, `CLOUDFLARE_ACCOUNT_ID`

## How to write

### S3 Client configurado para R2

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private envService: EnvService) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload({ fileName, fileType, body }: UploadParams) {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return { url: uniqueFileName }
  }
}
```

### Storage Module com inversão de dependência

```typescript
@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
```

## Example

**Before (acoplado ao provedor):**
```typescript
// Caso de uso importa diretamente o S3
import { S3Client } from '@aws-sdk/client-s3'

class UploadService {
  async upload(file: Buffer) {
    const s3 = new S3Client({ region: 'us-east-1' })
    // URL completa salva no banco
    const url = `https://bucket.s3.amazonaws.com/${file.name}`
    await db.save({ fileUrl: url })
  }
}
```

**After (com esta skill aplicada):**
```typescript
// Caso de uso depende apenas da interface
class UploadAndCreateAttachment {
  constructor(private uploader: Uploader) {}

  async execute({ fileName, fileType, body }: Request) {
    const { url } = await this.uploader.upload({ fileName, fileType, body })
    // Salva apenas a referência (key), não a URL completa
    const attachment = Attachment.create({ title: fileName, url })
    await this.attachmentsRepository.create(attachment)
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Escolhendo provedor de storage | Prefira Cloudflare R2 — sem taxa de egresso, mesma API do S3 |
| Configurando endpoint do R2 | Use `https://{accountId}.r2.cloudflarestorage.com` sem o nome do bucket no path |
| Definindo region no R2 | Sempre `'auto'` para seleção automática |
| Salvando referência no banco | Salve apenas o `uniqueFileName` (key), nunca a URL completa |
| Importando do Node.js | Prefixe com `node:` — `import { randomUUID } from 'node:crypto'` |
| Módulo usa classe injetável | Importe o módulo que expõe a dependência (ex: `EnvModule` para `EnvService`) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `await db.save({ url: 'https://bucket.s3.amazonaws.com/file.png' })` | `await db.save({ url: uniqueFileName })` |
| `new S3Client({ region: 'us-east-1' })` (para R2) | `new S3Client({ endpoint: '...r2...', region: 'auto' })` |
| `class R2Storage { constructor() { this.client = new S3Client(...) } }` | `@Injectable() class R2Storage { constructor(private envService: EnvService) { ... } }` |
| `const filename = originalName` | `const filename = \`${randomUUID()}-${originalName}\`` |
| Salvar Base64/blob no banco de dados | Usar sistema de object storage (R2/S3) e salvar referência |

## Troubleshooting

### NestJS nao injeta EnvService no R2Storage
**Symptom:** Erro de dependencia nao encontrada ao inicializar o modulo de storage
**Cause:** O `EnvModule` nao foi importado no `StorageModule`, entao o container de DI nao encontra `EnvService`
**Fix:** Adicione `imports: [EnvModule]` no `@Module()` do `StorageModule`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
