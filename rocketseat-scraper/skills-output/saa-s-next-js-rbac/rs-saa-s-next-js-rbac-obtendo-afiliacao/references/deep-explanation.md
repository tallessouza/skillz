# Deep Explanation: Obtendo Afiliação

## Por que slug e não ID?

O instrutor explica com um exemplo visual de URL. Imagine o front-end:

- Com slug: `meusaas.com/orgs/rocketseat/projects` — limpo, legível, bookmarkável
- Com ID: `meusaas.com/orgs/clkj2f0x00008...xyz/projects` — feio, ilegível

Como o slug já é `@unique` no schema do Prisma, ele funciona como um índice natural. O front-end já tem o slug na URL, então enviá-lo direto para o back-end evita uma query extra para converter slug → ID.

Se no futuro alguma rota precisar do ID real da organização, cria-se outra rota. Não se força todas as rotas a usar ID só por causa de uma exceção.

## Por que include organization?

O instrutor justifica: quando uma rota precisa negar acesso, a mensagem de erro deve ser contextual. "Você não tem permissão para fazer X **nesta organização**". Para isso, precisa dos dados da organização disponíveis no ponto onde o erro é lançado.

Além disso, muitas rotas downstream vão precisar de dados da organização (nome, slug, ownerId) para lógica de negócio. Trazer junto na mesma query evita N+1.

## Desestruturação do retorno

O Prisma retorna um objeto `member` com `organization` nested:

```typescript
{
  id: '...',
  role: 'ADMIN',
  userId: '...',
  organizationId: '...',
  organization: { id: '...', name: '...', slug: '...' }
}
```

A desestruturação `const { organization, ...membership } = member` separa elegantemente os dois domínios em variáveis distintas, facilitando o uso por consumers.

## findFirst vs findUnique

O instrutor menciona que não pode usar `findUnique` aqui porque o filtro inclui um join (`organization: { slug }`). O `findUnique` do Prisma só funciona com campos marcados como `@unique` ou `@@unique` diretamente na tabela. Como estamos filtrando por `userId` + `organization.slug` (campo de outra tabela), `findFirst` é necessário.

## Tipagem da role com Zod

O instrutor encontra dificuldade ao tipar a role na response porque o Prisma usa um enum TypeScript (`Role`) enquanto o schema de validação usa Zod. A solução é usar `roleSchema` (definido no pacote `@saas/auth`) e fazer `roleSchema.parse(membership.role)` para converter o enum do Prisma para o formato esperado pelo Zod schema.

## Padrão de registro de rotas

Cada rota é uma função que recebe `FastifyInstance`, registra o plugin de auth, e exporta. Depois precisa ser registrada no servidor principal:

```typescript
// server.ts
app.register(getMembership)
```

O instrutor quase esquece esse passo e recebe erro — lembrete importante de que rotas Fastify precisam ser registradas explicitamente.