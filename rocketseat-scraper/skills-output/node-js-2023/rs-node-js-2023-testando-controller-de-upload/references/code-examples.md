# Code Examples: Testando Controller de Upload

## Controller completo com use case e error handling

```typescript
// src/infra/http/controllers/upload-attachment.controller.ts
@Controller('/attachments')
export class UploadAttachmentController {
  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
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

    return {
      attachmentId: attachment.id.toString(),
    }
  }
}
```

## Teste e2e do controller

```typescript
// src/infra/http/controllers/upload-attachment.controller.e2e-spec.ts
describe('Upload attachment (E2E)', () => {
  // ... setup com app, prisma, jwt

  it('should upload a file', async () => {
    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.png')

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    })
  })
})
```

## Prisma Attachments Repository

```typescript
// src/infra/database/prisma/repositories/prisma-attachments-repository.ts
@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment)

    await this.prisma.attachment.create({
      data,
    })
  }
}
```

## Prisma Attachment Mapper

```typescript
// src/infra/database/prisma/mappers/prisma-attachment-mapper.ts
export class PrismaAttachmentMapper {
  static toPrisma(attachment: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }
}
```

## Database Module com Attachments

```typescript
// src/infra/database/database.module.ts
@Module({
  providers: [
    PrismaService,
    // ... outros repositorios
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    // ... outros repositorios
    AttachmentsRepository,
  ],
})
export class DatabaseModule {}
```

## Setup e2e com override de variaveis

```typescript
// test/setup-e2e.ts
import { config } from 'dotenv'

// Carrega .env com override
config({ path: '.env', override: true })

// Carrega .env.test — sobrescreve variaveis que diferem para teste
config({ path: '.env.test', override: true })

// ... resto do setup (PrismaClient, beforeAll, afterAll)
```

## Arquivo .env.test

```env
# Override variables during test
AWS_BUCKET_NAME=my-app-bucket-test
```

## Cloudflare R2: Object Lifecycle Rule (configuracao via dashboard)

```
Bucket: my-app-bucket-test
Settings > Object Lifecycle Rules:
  - Rule name: "Delete all files"
  - Conditions: (none — applies to all objects)
  - Action: Delete after 1 day
```

## .gitignore (adicionar .env.test)

```gitignore
# Environment
.env
.env.test
```