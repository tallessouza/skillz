---
name: rs-node-js-2023-controller-de-autenticacao
description: "Applies NestJS authentication controller patterns when building login endpoints, JWT token generation, or credential validation. Use when user asks to 'create login route', 'authenticate user', 'generate JWT token', 'validate credentials', or 'build auth endpoint' in NestJS. Enforces consistent error responses, bcrypt comparison, and JWT sub convention. Make sure to use this skill whenever implementing authentication in NestJS applications. Not for registration, authorization guards, or role-based access control."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [nestjs, controller, clean-architecture, e2e-test, rest-api]
  mind-lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
---

# Controller de Autenticação NestJS

> Ao criar endpoints de autenticação, retorne erros genéricos que não revelem qual campo falhou, use bcrypt para comparação de senhas, e siga o padrão JWT com `sub` para identificar o usuário.

## Rules

1. **Retorne o mesmo erro para email inexistente e senha incorreta** — `UnauthorizedException('User credentials do not match')`, porque revelar qual campo falhou permite enumeração de usuários
2. **Use `sub` como claim do JWT** — não `userId` ou `id`, porque `sub` (subject) é o padrão RFC 7519 e ferramentas como jwt.io reconhecem automaticamente
3. **Compare senhas com bcrypt.compare** — nunca compare strings diretamente, porque senhas são armazenadas como hash
4. **Retorne respostas HTTP com snake_case** — `access_token` não `accessToken`, porque é convenção de APIs REST e facilita consumo no front-end
5. **Use Zod validation pipe no body** — valide email e senha antes de qualquer lógica de negócio, porque evita queries desnecessárias ao banco
6. **Injete dependências no constructor** — Prisma, JWT service etc. via inversão de dependência do NestJS, porque facilita testes e desacoplamento

## How to write

### Controller de autenticação completo

```typescript
@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    const accessToken = this.jwt.sign({ sub: user.id })

    return { access_token: accessToken }
  }
}
```

### Schema de validação com Zod

```typescript
const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>
```

## Example

**Before (inseguro e inconsistente):**
```typescript
@Post('/login')
async login(@Body() body: any) {
  const user = await this.prisma.user.findUnique({ where: { email: body.email } })
  if (!user) throw new NotFoundException('User not found')  // revela que email não existe
  if (body.password !== user.password) throw new BadRequestException('Wrong password')  // compara string direto
  const token = this.jwt.sign({ userId: user.id })  // não usa sub
  return { accessToken: token }  // camelCase na resposta
}
```

**After (com esta skill aplicada):**
```typescript
@Post()
@HttpCode(201)
@UsePipes(new ZodValidationPipe(authenticateBodySchema))
async handle(@Body() body: AuthenticateBodySchema) {
  const { email, password } = body
  const user = await this.prisma.user.findUnique({ where: { email } })
  if (!user) throw new UnauthorizedException('User credentials do not match.')
  const isPasswordValid = await compare(password, user.password)
  if (!isPasswordValid) throw new UnauthorizedException('User credentials do not match.')
  const accessToken = this.jwt.sign({ sub: user.id })
  return { access_token: accessToken }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Usuário não encontrado por email | Mesmo erro genérico (401), nunca 404 |
| Senha incorreta | Mesmo erro genérico (401), nunca 400 |
| Claim de identificação no JWT | Use `sub`, não `userId` ou `id` |
| Resposta JSON para front-end | snake_case: `access_token` |
| Validação do body | Zod schema + ZodValidationPipe |
| Injeção de PrismaService | Constructor injection, qualquer ordem |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `throw new NotFoundException('User not found')` | `throw new UnauthorizedException('User credentials do not match.')` |
| `throw new BadRequestException('Wrong password')` | `throw new UnauthorizedException('User credentials do not match.')` |
| `body.password === user.password` | `await compare(password, user.password)` |
| `jwt.sign({ userId: user.id })` | `jwt.sign({ sub: user.id })` |
| `return { accessToken: token }` | `return { access_token: token }` |
| `async login(@Body() body: any)` | `async handle(@Body() body: AuthenticateBodySchema)` |

## Troubleshooting

### Erro inesperado ao seguir este padrao
**Symptom:** Codigo segue o padrao mas comportamento nao e o esperado
**Cause:** Dependencia nao registrada no modulo ou configuracao incompleta
**Fix:** Verificar registro completo no modulo (controllers, providers, imports) e dependencias instaladas

## Deep reference library

- [deep-explanation.md](../../../data/skills/node-js-2023/rs-node-js-2023-controller-de-autenticacao/references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/node-js-2023/rs-node-js-2023-controller-de-autenticacao/references/code-examples.md) — Todos os exemplos de código expandidos com variações
