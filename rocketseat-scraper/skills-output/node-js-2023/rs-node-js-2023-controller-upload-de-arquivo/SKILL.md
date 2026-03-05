---
name: rs-node-js-2023-controller-upload-arquivo
description: "Applies NestJS file upload patterns when building upload endpoints with Multer. Use when user asks to 'upload file', 'receive attachment', 'handle file upload', 'create upload route', or 'multipart form data' in NestJS. Covers FileInterceptor, ParseFilePipe validators, e2e testing with supertest attach, and the separate-upload-then-reference architecture. Make sure to use this skill whenever implementing file upload in NestJS, even for simple single-file cases. Not for streaming, WebSocket file transfer, or Fastify-based NestJS apps."
---

# Controller Upload de Arquivo (NestJS)

> Isole upload de arquivos em rota dedicada que retorna um ID, depois referencie esse ID nas rotas de criacao de recursos.

## Rules

1. **Separe upload em rota propria** — nunca receba arquivo junto com JSON no mesmo request, porque JSON nao suporta binarios (base64 inflaria o tamanho)
2. **Use o fluxo upload-then-reference** — rota de upload retorna attachment ID, rotas de criacao recebem array de IDs, porque desacopla upload do dominio
3. **Configure FileInterceptor com nome explicito** — `@UseInterceptors(FileInterceptor('file'))`, porque o nome deve bater com o campo do form-data
4. **Valide tamanho e tipo com ParseFilePipe** — sempre defina maxSize e fileType no decorator, porque arquivos invalidos devem ser rejeitados antes do caso de uso
5. **Expresse tamanho em bytes com comentario legivel** — `1024 * 1024 * 2 /* 2mb */`, porque bytes puros sao ilegíveis
6. **Teste uploads via e2e, nao manualmente** — use supertest `.attach()` com arquivo real na pasta test, porque testes automatizados sao mais confiaveis que requests manuais

## How to write

### Controller de upload

```typescript
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/attachments')
export class UploadAttachmentController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, /* 2mb */
          }),
          new FileTypeValidator({
            fileType: '.(jpg|png|jpeg|pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // file.buffer contem o conteudo em memoria
    // file.originalname, file.mimetype, file.size disponiveis
  }
}
```

### Registro no module

```typescript
@Module({
  controllers: [
    // ...outros controllers
    UploadAttachmentController,
  ],
})
export class HttpModule {}
```

### Teste e2e com supertest

```typescript
it('[POST] /attachments', async () => {
  const response = await request(app.getHttpServer())
    .post('/attachments')
    .attach('file', './test/e2e/sample-upload.png')

  expect(response.statusCode).toBe(201)
})
```

## Example

**Before (upload junto com criacao — errado):**
```typescript
@Post('/questions')
async handle(@Body() body: CreateQuestionDto) {
  // Tenta receber arquivo via JSON — impossivel sem base64
  const { title, content, attachment } = body
}
```

**After (upload separado — correto):**
```typescript
// 1. Rota dedicada retorna ID do attachment
@Post('/attachments')
@UseInterceptors(FileInterceptor('file'))
async uploadFile(@UploadedFile(...) file: Express.Multer.File) {
  const attachment = await this.uploadAttachment.execute({ file })
  return { attachmentId: attachment.id }
}

// 2. Rota de criacao recebe apenas IDs
@Post('/questions')
async createQuestion(@Body() body) {
  const { title, content, attachmentIds } = body
  // attachmentIds ja existem no banco
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App usa Express (padrao NestJS) | Use Multer via `@nestjs/platform-express` |
| App usa Fastify | Multer NAO funciona — use estrategia alternativa |
| Precisa de `Express.Multer.File` type | Instale `@types/multer` e adicione em tsconfig types |
| Arquivo enviado junto com dados JSON | Separe em duas rotas |
| Precisa validar tipo de arquivo | Use regex no FileTypeValidator: `.(jpg\|png\|pdf)` |
| Precisa testar upload | Coloque arquivo real em `test/e2e/` e use `.attach()` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Receber arquivo como base64 no JSON | Rota separada com multipart/form-data |
| `maxSize: 1024` (1kb) em producao | `maxSize: 1024 * 1024 * 2` com comentario `/* 2mb */` |
| Testar upload manualmente no REST client | Teste e2e com `.attach()` e arquivo real |
| Esquecer de registrar controller no module | Adicionar no array `controllers` do HttpModule |
| Ignorar erro de tipo do `Express.Multer.File` | Adicionar `multer` no `types` do tsconfig |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
