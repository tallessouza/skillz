---
name: rs-node-js-2023-testando-controller-upload
description: "Enforces end-to-end testing patterns for upload controllers in NestJS with external storage integration. Use when user asks to 'test upload', 'write e2e test', 'test controller with file upload', 'configure test environment for S3/R2', or 'separate test bucket'. Applies rules: real external services in e2e tests, separate test buckets with auto-cleanup, env override for test environments, proper Prisma repository wiring. Make sure to use this skill whenever writing e2e tests that involve file uploads or external storage. Not for unit tests, mock-based tests, or frontend upload components."
---

# Testando Controller de Upload (E2E com Storage Real)

> Testes end-to-end devem testar a aplicacao de ponta a ponta — nunca mockar integrações externas como upload de arquivos.

## Rules

1. **Nunca mocke storage em teste e2e** — use o bucket real (separado para testes), porque teste end-to-end que mocka storage nao testa se o upload realmente funciona
2. **Crie um bucket exclusivo para testes** — com lifecycle rule para deletar arquivos apos 1 dia, porque evita acumulo de lixo no storage
3. **Use .env.test para override de variaveis** — substitua apenas as variaveis que diferem do ambiente de desenvolvimento, porque mantem clareza sobre o que muda entre ambientes
4. **Configure override: true no dotenv** — o ConfigModule do NestJS nao faz override por padrao, entao carregue variaveis com override explicito no setup-e2e
5. **Teste poucos cenarios e2e, mas completos** — "teste end-to-end e que nem amigo: poucos e bons", porque sao pesados e devem cobrir o fluxo real
6. **Atualize permissoes de API keys para buckets de teste** — ao criar novo bucket, a API key precisa de acesso explicito, senao retorna Access Denied

## How to write

### Controller com upload e use case

```typescript
@Controller('/attachments')
export class UploadAttachmentController {
  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase,
  ) {}

  @Post()
  async handle(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { attachment } = result.value

    return { attachmentId: attachment.id.toString() }
  }
}
```

### Teste e2e verificando resposta

```typescript
it('should upload a file', async () => {
  const response = await request(app.getHttpServer())
    .post('/attachments')
    .attach('file', './test/e2e/sample-upload.png')

  expect(response.statusCode).toBe(201)
  expect(response.body).toEqual({
    attachmentId: expect.any(String),
  })
})
```

### Setup de environment override

```typescript
// setup-e2e.ts
import { config } from 'dotenv'

// Carrega .env primeiro
config({ path: '.env', override: true })
// Depois carrega .env.test com override para substituir variaveis
config({ path: '.env.test', override: true })
```

### Arquivo .env.test

```env
# Override variables during test
AWS_BUCKET_NAME=my-bucket-test
```

## Example

**Before (mock que nao testa o upload real):**
```typescript
// ERRADO para e2e: mocka o storage
const fakeUploader = { upload: vi.fn().mockResolvedValue({ url: 'fake' }) }
// Nao testa se o Cloudflare/S3 realmente recebe o arquivo
```

**After (teste e2e real com bucket separado):**
```typescript
// CORRETO: usa bucket real separado com lifecycle de 1 dia
// .env.test sobrescreve AWS_BUCKET_NAME para bucket de teste
// O upload realmente acontece no Cloudflare/S3
// Arquivos sao auto-deletados apos 24h via Object Lifecycle Rules
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Teste e2e com upload | Usar bucket real separado, nunca mock |
| Variavel ambiente diferente em teste | Criar .env.test com apenas os overrides |
| ConfigModule do Nest nao pega override | Carregar dotenv com `override: true` no setup-e2e ANTES do app iniciar |
| Novo bucket criado | Atualizar API key permissions para incluir o bucket |
| Arquivos de teste acumulando no storage | Configurar Object Lifecycle Rule: delete after 1 day |
| Prisma repository nao encontrado | Registrar no DatabaseModule com provide/exports |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Mock de storage em teste e2e | Bucket real separado com auto-cleanup |
| Upload para bucket de producao nos testes | .env.test com bucket dedicado |
| `config({ path: '.env' })` sem override | `config({ path: '.env', override: true })` |
| Dezenas de testes e2e para upload | Poucos testes e2e que cobrem o fluxo completo |
| Deletar arquivos de teste manualmente | Object Lifecycle Rules (auto-delete apos 1 dia) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-testando-controller-de-upload/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-testando-controller-de-upload/references/code-examples.md)
