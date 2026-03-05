# Code Examples: Controller de Criacao de Pergunta

## Exemplo completo do controller (como ficou na aula)

```typescript
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBody,
  ) {
    const { title, content } = body
    const userId = user.sub

    const slug = this.convertToSlug(title)

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug,
        authorId: userId,
      },
    })
  }

  private convertToSlug(title: string): string {
    return title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
}
```

## Funcao de slug isolada

```typescript
function convertToSlug(text: string): string {
  return text
    .normalize('NFD')                   // decompoe: "é" -> "e" + acento
    .replace(/[\u0300-\u036f]/g, '')    // remove diacriticos
    .toLowerCase()                       // minusculas
    .replace(/[^\w\s-]/g, '')           // remove caracteres especiais
    .replace(/\s+/g, '-')              // espacos viram hifens
}

// Exemplos:
convertToSlug('Nova Pergunta')           // 'nova-pergunta'
convertToSlug('Título com Acentuação')   // 'titulo-com-acentuacao'
convertToSlug('What is Node.js?')        // 'what-is-nodejs'
```

## Comparacao: @UsePipes() vs pipe no @Body()

### Forma 1: @UsePipes no controller (usada em aulas anteriores)

```typescript
@Controller('/questions')
@UsePipes(new ZodValidationPipe(createQuestionBodySchema))
export class CreateQuestionController {
  @Post()
  async handle(@Body() body: CreateQuestionBody) {
    // funciona, mas o pipe roda em TODOS os parametros
  }
}
```

### Forma 2: pipe no @Body() (adotada nesta aula)

```typescript
@Controller('/questions')
export class CreateQuestionController {
  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBody,
  ) {
    // pipe roda APENAS no body — mais preciso
  }
}
```

## Teste HTTP (como o instrutor testou)

```http
### Criar pergunta
POST http://localhost:3333/questions
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Nova pergunta",
  "content": "Conteúdo da pergunta"
}
```

Resposta esperada: `201 Created` sem body.

Verificacao no Prisma Studio: registro com title, slug gerado (`nova-pergunta`), content, createdAt, e authorId apontando para o usuario autenticado.