# Code Examples: Controller Upload de Arquivo

## Setup completo

### 1. Instalar dependencia de tipos

```bash
pnpm i -D @types/multer
```

### 2. Configurar tsconfig.json

```json
{
  "compilerOptions": {
    "types": ["multer"]
  }
}
```

Isso faz com que `Express.Multer.File` seja reconhecido globalmente no TypeScript.

### 3. Controller completo

```typescript
// src/infra/http/controllers/upload-attachment.controller.ts
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
  constructor() {}

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
    console.log(file)
  }
}
```

### 4. Registro no HttpModule

```typescript
// src/infra/http/http.module.ts
@Module({
  controllers: [
    // ...outros controllers existentes
    UploadAttachmentController,
  ],
})
export class HttpModule {}
```

### 5. Teste e2e completo

```typescript
// test/e2e/upload-attachment.e2e-spec.ts
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { StudentFactory } from 'test/factories/make-student'
import { JwtService } from '@nestjs/jwt'

describe('Upload attachment (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /attachments', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.png')

    expect(response.statusCode).toBe(201)
  })
})
```

## Estrutura do objeto file recebido pelo Multer

```typescript
{
  fieldname: 'file',
  originalname: 'sample-upload.png',
  encoding: '7bit',
  mimetype: 'image/png',
  buffer: <Buffer 89 50 4e 47 ...>,
  size: 56000 // bytes — ~54kb nesse exemplo
}
```

## Calculo de tamanho em bytes

```typescript
// Referencia rapida
const oneKb = 1024           // 1 KB
const oneMb = 1024 * 1024    // 1 MB
const twoMb = 1024 * 1024 * 2 // 2 MB

// Para converter bytes para KB:
const sizeInKb = file.size / 1024
```

## Preparacao do arquivo de teste

Coloque um arquivo real (png, jpg, ou pdf) valido na pasta de testes:

```
test/
└── e2e/
    └── sample-upload.png   # arquivo real, nao mock
```

O supertest usa `.attach(fieldName, filePath)` onde:
- `fieldName` deve ser identico ao nome no `FileInterceptor('file')`
- `filePath` e relativo a raiz do projeto

## Troubleshooting comum

### Erro de tipo `Express.Multer.File` nao encontrado

```json
// tsconfig.json — adicionar multer nos types
{
  "compilerOptions": {
    "types": ["multer"]
  }
}
```

### Erro no ParseFilePipe (bug de versao)

```bash
# Atualizar NestJS para ultima versao
pnpm i @nestjs/common@latest @nestjs/core@latest @nestjs/platform-express@latest
```

### Erro apos deletar node_modules

```bash
# Regenerar tipos do Prisma
npx prisma generate
```