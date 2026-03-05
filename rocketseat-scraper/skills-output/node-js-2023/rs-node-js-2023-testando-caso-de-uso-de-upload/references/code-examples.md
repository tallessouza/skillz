# Code Examples: Testando Caso de Uso de Upload

## Setup completo do teste

```typescript
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and create attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'music.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })
})
```

## FakeUploader completo

```typescript
import { randomUUID } from 'node:crypto'
import { Uploader, UploadParams } from '@/domain/forum/application/storage/uploader'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      fileName,
      url,
    })

    return { url }
  }
}
```

## InMemoryAttachmentsRepository completo

```typescript
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }
}
```

## Processo de criacao do InMemoryAttachmentsRepository

O instrutor copiou o `InMemoryStudentsRepository` e fez as seguintes adaptacoes:

1. Replace `student` → `attachment` em todo o arquivo
2. Remover metodo `findByEmail` (attachments nao tem email)
3. Remover referencia a `DomainEvents` (attachments nao emitem eventos)
4. Manter apenas o metodo `create` que faz `push` no array `items`

## Variacao: testando outros tipos de arquivo validos

```typescript
// Tipos validos comuns para testar
const validTypes = [
  { fileName: 'photo.png', fileType: 'image/png' },
  { fileName: 'photo.jpg', fileType: 'image/jpeg' },
  { fileName: 'document.pdf', fileType: 'application/pdf' },
]

// Tipos invalidos para testar rejeicao
const invalidTypes = [
  { fileName: 'music.mp3', fileType: 'audio/mpeg' },
  { fileName: 'video.mp4', fileType: 'video/mp4' },
  { fileName: 'script.exe', fileType: 'application/x-msdownload' },
]
```