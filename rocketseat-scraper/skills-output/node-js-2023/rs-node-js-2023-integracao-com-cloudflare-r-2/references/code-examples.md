# Code Examples: Integração com Cloudflare R2

## 1. Variáveis de ambiente (.env)

```env
# AWS (Cloudflare R2)
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_BUCKET_NAME=ignite-nest-clean
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

## 2. Validação das variáveis (env.ts)

```typescript
// Adicionar ao schema de validação
AWS_ACCESS_KEY_ID: z.string(),
AWS_SECRET_ACCESS_KEY: z.string(),
AWS_BUCKET_NAME: z.string(),
CLOUDFLARE_ACCOUNT_ID: z.string(),
```

## 3. Interface Uploader (domínio)

```typescript
export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ url: string }>
}
```

## 4. R2Storage completo (infra)

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { Uploader } from '@/domain/forum/application/storage/uploader'
import { UploadParams } from '@/domain/forum/application/storage/uploader'

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

## 5. Storage Module

```typescript
import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { Uploader } from '@/domain/forum/application/storage/uploader'
import { R2Storage } from './r2-storage'

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

## 6. Importação no HttpModule

```typescript
@Module({
  imports: [
    // ... outros módulos
    StorageModule,
    CryptographyModule,
  ],
  controllers: [
    // ... controllers
    UploadAttachmentController,
  ],
  providers: [
    // ... casos de uso
    UploadAndCreateAttachmentUseCase,
  ],
})
export class HttpModule {}
```

## 7. Instalação do pacote

```bash
npm install @aws-sdk/client-s3
```

## 8. Padrão de importação Node.js com prefixo

```typescript
// Prefixar importações nativas do Node com 'node:'
import { randomUUID } from 'node:crypto'
// Em vez de:
import { randomUUID } from 'crypto'
```

## 9. Criação do token no Cloudflare (passo a passo)

```
1. Cloudflare Dashboard → R2 → Manage R2 API Tokens
2. Create API Token
3. Token name: "Ignite Nest Clean" (nome do projeto)
4. Permissions: Object → Read & Write
5. Scope: Apply to Specific Buckets Only → selecionar o bucket
6. TTL: Forever
7. Create API Token
8. Copiar accessKeyId e secretAccessKey
```

## 10. Estrutura de pastas resultante

```
src/
├── domain/
│   └── forum/
│       └── application/
│           └── storage/
│               └── uploader.ts          # Interface abstrata
└── infra/
    ├── storage/
    │   ├── r2-storage.ts                # Implementação R2
    │   └── storage.module.ts            # Módulo NestJS
    └── env/
        ├── env.ts                       # Schema de validação
        ├── env.service.ts               # Serviço tipado
        └── env.module.ts                # Módulo do env
```