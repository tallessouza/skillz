# Deep Explanation: Inserindo Registros com Prisma ORM

## Por que centralizar o PrismaClient?

O instrutor cria um unico arquivo `src/prisma.ts` e exporta a instancia. Isso nao e apenas organizacao — cada `new PrismaClient()` abre um pool de conexoes com o banco. Se voce instanciar em cada arquivo, rapidamente esgota as conexoes disponiveis.

O instrutor menciona que nao vai se preocupar com estrutura de pastas elaborada (como `src/database/`) neste momento, porque o foco e no Prisma em si. Em projetos reais, a instancia pode viver em `src/database/prisma.ts` ou `src/lib/prisma.ts`.

## Log de queries: por que e util

O instrutor configura `log: ['query']` e demonstra o resultado no terminal. Ao cadastrar um usuario, o terminal mostra:
- O `INSERT INTO` real gerado pelo Prisma
- O `SELECT` que o Prisma faz para verificar constraints

Isso e valioso para:
1. **Debugging** — ver exatamente o que o Prisma esta fazendo
2. **Performance** — identificar queries N+1 ou desnecessarias
3. **Aprendizado** — entender o SQL gerado por cada operacao do ORM

Opcoes de log disponiveis: `'error'`, `'info'`, `'warn'`, `'query'`. O instrutor prefere so `'query'` para manter o output limpo.

## A propriedade `data` no create

O metodo `prisma.model.create()` aceita um objeto com varias propriedades opcionais:
- `data` — os campos a serem inseridos (obrigatorio)
- `select` — quais campos retornar
- `include` — quais relacoes carregar

Por isso os dados ficam dentro de `data: {}` — para separar dos demais parametros. Nao e burocracia, e design intencional da API.

## Constraints automaticas (@unique)

O instrutor demonstra ao vivo: tenta cadastrar dois usuarios com o mesmo email e o Prisma retorna erro automaticamente. O schema define `@@unique` ou `@unique` e o Prisma:
1. Gera a constraint no banco via migration
2. Em runtime, o banco rejeita o insert duplicado
3. O Prisma propaga o erro para a aplicacao

Nao e necessario fazer um `findFirst` antes do `create` para verificar duplicidade — isso seria uma query desnecessaria. O correto e tentar o create e tratar o erro de constraint violation.

## Autocompletion e type safety

O instrutor destaca que ao digitar `prisma.` o editor ja sugere `user` (o modelo definido no schema). E ao digitar `prisma.user.` aparecem todos os metodos disponiveis: `create`, `findMany`, `findFirst`, `update`, `delete`, etc.

Isso acontece porque o `prisma generate` gera tipos TypeScript a partir do schema. E um dos grandes diferenciais do Prisma sobre ORMs sem tipagem.