---
name: rs-node-js-2023-upload-use-case
description: "Enforces clean architecture patterns for file upload use cases in NestJS/Node.js applications. Use when user asks to 'implement file upload', 'create upload endpoint', 'handle attachments', 'upload to S3 or R2', or 'create storage abstraction'. Applies rules: domain-layer file type validation, abstract uploader contract via dependency inversion, buffer for small files and stream for large, stateless application design. Make sure to use this skill whenever building upload features in layered architectures. Not for frontend upload UI, drag-and-drop components, or Multer configuration."
---

# Caso de Uso: Upload e Criacao de Attachment

> Em arquitetura limpa, o caso de uso define O QUE fazer com o arquivo; a camada de infra define COMO armazena-lo.

## Rules

1. **Valide o tipo do arquivo na camada de dominio** — nao dependa apenas da validacao do controller/infra, porque a camada de dominio deve funcionar independente da infra
2. **Crie um contrato abstrato para storage** — use classe abstrata (ou interface) `Uploader` com metodo `upload()`, porque o caso de uso nao pode conhecer S3, R2 ou qualquer provider especifico
3. **Use buffer apenas para arquivos pequenos (ate ~2MB)** — o conteudo inteiro fica em memoria; para arquivos maiores (video, audio), use streams para evitar consumo excessivo de memoria
4. **Aplicacao stateless: nunca salve em disco** — upload sempre para storage externo (S3, R2, GCS), porque deploys modernos nao garantem persistencia de disco
5. **Separe attachment generico de attachment associado** — crie `AttachmentsRepository` separado dos `QuestionAttachmentsRepository` e `AnswerAttachmentsRepository`, porque o upload acontece antes da associacao
6. **Retorne Either (Left/Right)** — use pattern Left para erro de validacao e Right para sucesso, mantendo o fluxo funcional

## How to write

### Contrato do Uploader (camada application)

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

### Use case com inversao de dependencia

```typescript
// upload-and-create-attachment.ts
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({ fileName, fileType, body }: Request): Promise<Response> {
    // 1. Validacao de tipo na camada de dominio
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    // 2. Upload para storage externo via contrato
    const { url } = await this.uploader.upload({ fileName, fileType, body })

    // 3. Criar entidade de dominio
    const attachment = Attachment.create({ title: fileName, url })

    // 4. Persistir no banco
    await this.attachmentsRepository.create(attachment)

    return right({ attachment })
  }
}
```

### Erro de dominio tipado

```typescript
// invalid-attachment-type.ts
export class InvalidAttachmentTypeError extends Error {
  constructor(type: string) {
    super(`File type "${type}" is not valid.`)
  }
}
```

## Example

**Before (upload acoplado a infra):**
```typescript
async execute({ file }: Request) {
  // Salva em disco - quebra em deploy stateless
  fs.writeFileSync(`./uploads/${file.name}`, file.buffer)
  const attachment = Attachment.create({
    title: file.name,
    url: `/uploads/${file.name}`,
  })
  await this.repo.create(attachment)
  return { attachment }
}
```

**After (com contrato e validacao de dominio):**
```typescript
async execute({ fileName, fileType, body }: Request) {
  if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
    return left(new InvalidAttachmentTypeError(fileType))
  }
  const { url } = await this.uploader.upload({ fileName, fileType, body })
  const attachment = Attachment.create({ title: fileName, url })
  await this.attachmentsRepository.create(attachment)
  return right({ attachment })
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Arquivo ate ~2MB | Buffer em memoria, garbage collector limpa apos uso |
| Arquivo >5MB (video, audio) | Use stream (Multer suporta) para nao estourar memoria |
| Validacao de tipo no controller | Mantenha tambem, mas duplique na camada de dominio |
| Attachment ainda nao associado | Use `AttachmentsRepository` generico, associe depois |
| Precisa da URL do arquivo | So disponivel APOS upload para storage externo |
| Novo provider de storage | Implemente o contrato `Uploader` na camada de infra |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `fs.writeFileSync('./uploads/...')` | `this.uploader.upload({ fileName, fileType, body })` |
| Validar tipo so no controller | Validar tambem no use case (dominio independe de infra) |
| `url: '/uploads/file.pdf'` (path local) | `url` vinda do retorno do `Uploader.upload()` |
| Um unico repository para todos os attachments | `AttachmentsRepository` (generico) + `QuestionAttachmentsRepository` + `AnswerAttachmentsRepository` |
| Receber Buffer para arquivos de 100MB | Usar Stream para arquivos grandes |
| Importar SDK do S3 direto no use case | Injetar `Uploader` abstrato via construtor |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
