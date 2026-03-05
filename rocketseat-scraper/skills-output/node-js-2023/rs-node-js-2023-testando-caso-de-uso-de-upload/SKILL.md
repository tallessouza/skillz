---
name: rs-node-js-2023-testando-upload-use-case
description: "Applies testing patterns for upload and file attachment use cases in clean architecture NestJS projects. Use when user asks to 'test upload', 'test file attachment', 'create fake uploader', 'mock storage', or 'test use case with file'. Enforces fake storage implementations, in-memory repositories for attachments, buffer handling in tests, and invalid file type validation. Make sure to use this skill whenever writing tests for upload or file storage features. Not for implementing actual storage providers, controllers, or infrastructure-layer upload logic."
---

# Testando Caso de Uso de Upload

> Ao testar uploads, crie fakes que simulam armazenamento em memoria e valide tanto o caminho feliz quanto tipos de arquivo invalidos.

## Rules

1. **Crie um FakeUploader que implementa a interface Uploader** — porque testes de caso de uso nao devem depender de storage real (S3, disco, etc)
2. **Armazene uploads em array interno no fake** — `uploads: Upload[]` funciona como uma "pasta" em memoria, permitindo assertions sobre o que foi salvo
3. **Gere URLs ficticias no fake** — use `randomUUID()` para criar URLs unicas, porque o teste so precisa verificar que uma URL foi retornada
4. **Use `Buffer.from('')` para o body nos testes** — porque o conteudo do arquivo e irrelevante no teste de caso de uso, so a estrutura importa
5. **Teste sempre o tipo de arquivo invalido** — valide que o caso de uso retorna `Left` com `InvalidAttachmentType` para tipos nao permitidos
6. **Verifique o repositorio e o uploader apos execucao** — asserte que o attachment foi salvo no repositorio in-memory E que o upload aparece no fake uploader

## How to write

### FakeUploader

```typescript
interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({ fileName, url })

    return { url }
  }
}
```

### InMemoryAttachmentsRepository

```typescript
export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }
}
```

### Teste do caminho feliz

```typescript
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
    expect.objectContaining({ fileName: 'profile.png' }),
  )
})
```

### Teste de tipo invalido

```typescript
it('should not be able to upload with invalid file type', async () => {
  const result = await sut.execute({
    fileName: 'music.mp3',
    fileType: 'audio/mpeg',
    body: Buffer.from(''),
  })

  expect(result.isLeft()).toBe(true)
  expect(result.value).toBeInstanceOf(InvalidAttachmentType)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Testando caso de uso de upload | Crie FakeUploader + InMemoryAttachmentsRepository |
| Body do arquivo no teste | `Buffer.from('')` — conteudo irrelevante |
| Verificando que upload aconteceu | Asserte no array `fakeUploader.uploads` |
| Verificando persistencia | Asserte no array `inMemoryRepository.items` |
| Testando rejeicao de tipo | Envie tipo invalido, espere `Left` com erro especifico |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Usar storage real (S3/disco) em teste de caso de uso | `FakeUploader` com array em memoria |
| Ignorar teste de tipo invalido | Sempre testar rejeicao de `audio/mpeg`, etc |
| Enviar arquivo real como body no teste | `Buffer.from('')` e suficiente |
| Verificar so o resultado sem checar o uploader | Verificar resultado E `fakeUploader.uploads` |
| Criar fake sem propriedade publica de uploads | Expor `public uploads: Upload[]` para assertions |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
