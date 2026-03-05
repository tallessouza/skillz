# Deep Explanation: Seed do Banco de Dados

## Por que criar um seed?

O instrutor explica que a partir desse ponto do curso, todas as funcionalidades vao exigir dados pre-existentes no banco. A parte de permissoes especificamente precisa de:
- Um usuario admin
- Um usuario member
- Um usuario billing
- Multiplas organizacoes para testar invites
- Projetos distribuidos entre membros

Criar tudo isso manualmente a cada teste seria inviavel. O seed automatiza essa preparacao.

## Conexao separada para o seed

O instrutor cria um `new PrismaClient()` no seed em vez de reutilizar o que ja existe em `lib/`. Motivo: a instancia em `lib/` tem logging configurado, e no seed isso poluiria o output com centenas de queries desnecessarias.

## Estrategia de roles por organizacao

A sacada principal: o mesmo usuario (John Doe) aparece em tres organizacoes com roles diferentes:
- `acme-admin` → role ADMIN (e owner)
- `acme-member` → role MEMBER
- `acme-billing` → role BILLING

Isso permite testar todas as permissoes fazendo login com uma unica conta. O nome da organizacao inclui a role (`Acme Inc (Admin)`) para facilitar a identificacao visual durante testes.

## createMany vs create individual

O instrutor inicialmente tentou usar `createMany` para usuarios, mas descobriu que o Prisma nao retorna os objetos criados com `createMany` (retorna apenas `{ count: N }`). Como ele precisava dos IDs dos usuarios para criar members e projects, teve que mudar para `create` individual.

Porem, para members e projects (onde nao precisa do retorno), `createMany` funciona perfeitamente e e mais performatico.

## Hash com round baixo

`hash('123456', 1)` usa apenas 1 round de bcrypt. Em producao isso seria inseguro, mas no seed:
- Velocidade e prioridade
- Os dados sao ficticios
- A senha e trivial de qualquer forma

## Randomizacao de ownership

`faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id])` distribui a propriedade dos projetos aleatoriamente entre os membros da organizacao. Isso simula um cenario real onde diferentes pessoas criam projetos.

## Ordem de deleteMany

A limpeza do banco respeita a ordem de dependencias foreign key:
1. Projects (depende de Organization e User)
2. Members (depende de Organization e User)
3. Organizations (depende de User como owner)
4. Users (sem dependencias)

Se deletar Users primeiro, as foreign keys em Organization.ownerId impediriam a operacao.

## Configuracao do seed no package.json

O Prisma reconhece a secao `prisma.seed` no `package.json`. Ao rodar `pnpm prisma db seed`, ele executa o comando configurado (`tsx prisma/seed.ts`). Isso tambem e executado automaticamente apos `prisma migrate reset`.