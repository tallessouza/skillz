# Code Examples: Upload e Criacao de Attachment

## Estrutura completa do Use Case

```typescript
// src/domain/forum/application/use-cases/upload-and-create-attachment.ts
import { Either, left, right } from '@/core/either'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type'

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>

export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    // Validacao de mimetype na camada de dominio
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    // Upload para storage externo
    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    // Criar entidade e persistir
    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({ attachment })
  }
}
```

## Erro de dominio

```typescript
// src/domain/forum/application/use-cases/errors/invalid-attachment-type.ts
export class InvalidAttachmentTypeError extends Error {
  constructor(type: string) {
    super(`File type "${type}" is not valid.`)
  }
}
```

## Contrato do Uploader

```typescript
// src/domain/forum/application/storage/uploader.ts
export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ url: string }>
}
```

## Repository generico de Attachments

```typescript
// src/domain/forum/application/repositories/attachments-repository.ts
import { Attachment } from '../../enterprise/entities/attachment'

export abstract class AttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>
}
```

## Entidade Attachment (ajuste de link para url)

```typescript
// src/domain/forum/enterprise/entities/attachment.ts
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AttachmentProps {
  title: string
  url: string  // era 'link', renomeado para 'url'
}

export class Attachment extends Entity<AttachmentProps> {
  get title() { return this.props.title }
  get url() { return this.props.url }

  static create(props: AttachmentProps, id?: UniqueEntityID) {
    return new Attachment(props, id)
  }
}
```

## Regex de validacao de mimetype

```typescript
// Valida jpeg, jpg, png e pdf
/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)

// Exemplos:
// 'image/jpeg' → true
// 'image/png'  → true
// 'application/pdf' → true
// 'text/plain' → false
// 'image/gif'  → false
```

## Estrutura de pastas resultante

```
src/domain/forum/application/
├── repositories/
│   ├── attachments-repository.ts          ← NOVO (generico)
│   ├── question-attachments-repository.ts ← ja existia
│   └── answer-attachments-repository.ts   ← ja existia
├── storage/
│   └── uploader.ts                        ← NOVO (contrato)
└── use-cases/
    ├── upload-and-create-attachment.ts     ← NOVO
    └── errors/
        └── invalid-attachment-type.ts     ← NOVO
```

## Fake Uploader para testes (sera criado na proxima aula)

```typescript
// test/storage/fake-uploader.ts
import { Uploader, UploadParams } from '@/domain/forum/application/storage/uploader'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ url }> {
    const url = `http://localhost:3333/uploads/${fileName}`
    this.uploads.push({ fileName, url })
    return { url }
  }
}
```