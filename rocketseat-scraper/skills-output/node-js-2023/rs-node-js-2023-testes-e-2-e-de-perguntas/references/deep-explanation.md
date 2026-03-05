# Deep Explanation: Testes E2E de Perguntas no NestJS

## Por que gerar token direto ao inves de chamar rota de login?

O instrutor destaca um ponto sutil mas crucial: em testes E2E de endpoints que requerem autenticacao, voce NAO deve depender da rota de autenticacao para obter o token. A razao e isolamento — se o teste do `CreateQuestionController` falhar, voce quer ter certeza de que o problema esta no controller de criacao de perguntas, nao no fluxo de login.

A tecnica e pegar o `JwtService` diretamente do modulo de teste usando `moduleRef.get(JwtService)`, da mesma forma que se pega o `PrismaService`. O `JwtService` e o mesmo servico que o `AuthenticateController` usa internamente para gerar tokens, entao o token produzido e identico ao que seria retornado pela rota de login.

## Senha sem hash — quando e aceitavel?

O instrutor explica que quando voce cria um usuario no banco apenas para ter um `user.id` para gerar o token JWT, a senha armazenada e irrelevante. O hash so importa quando o teste exercita o fluxo de comparacao de senha (login). Como o teste de criacao de perguntas pula completamente o login, `'123456'` plain text funciona perfeitamente.

## O padrao de verificacao dupla

O instrutor ensina um padrao de verificacao em dois niveis:

1. **Status code** — `expect(response.statusCode).toBe(201)` confirma que a rota respondeu corretamente
2. **Consulta ao banco** — `prisma.question.findFirst({ where: { title: 'New question' } })` confirma que o dado realmente persistiu

Isso e importante porque um controller poderia retornar 201 sem efetivamente salvar no banco (bug no service, transacao nao commitada, etc).

## createMany vs create em loop

Para testes de listagem, o instrutor usa `prisma.question.createMany()` com um array de dados. Isso e mais eficiente que multiplos `create()` porque executa uma unica query INSERT com multiplos valores.

## expect.objectContaining e expect.arrayContaining

O instrutor usa uma tecnica elegante para validar respostas parcialmente:

```typescript
expect(response.body).toEqual({
  questions: expect.arrayContaining([
    expect.objectContaining({ title: 'Question 01' }),
    expect.objectContaining({ title: 'Question 02' }),
  ]),
})
```

Isso evita ter que listar todas as propriedades do objeto (id, slug, content, createdAt, etc). Voce valida apenas os campos que importam para o teste.

## Correcao do perPage durante o teste

O instrutor percebe durante a aula que `perPage: 1` estava hardcoded no controller de listagem e corrige para `20`. Isso ilustra como testes E2E servem tambem como ferramenta de descoberta de bugs — ao tentar listar 3 questoes e receber apenas 1, o teste falharia e revelaria o bug.