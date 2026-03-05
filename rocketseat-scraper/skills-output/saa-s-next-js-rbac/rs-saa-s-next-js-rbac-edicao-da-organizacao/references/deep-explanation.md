# Deep Explanation: Edicao de Organizacao

## Por que um unico formulario para criar e editar

O instrutor destaca que o OrganizationForm ja existia para criacao. Ao inves de duplicar, ele adiciona `isUpdating?: boolean` como prop opcional com default `false`. Isso significa que nenhum dos locais que ja usam o formulario precisa ser alterado — o principio do menor impacto.

A variavel `formAction` seleciona dinamicamente entre `createOrganizationAction` e `updateOrganizationAction`:

```typescript
const formAction = isUpdating ? updateOrganizationAction : createOrganizationAction
```

Isso e mais limpo que ter dois formularios quase identicos.

## A limitacao do 'use server' com exports

O instrutor encontra um erro ao tentar exportar o schema Zod de um arquivo `'use server'`. O Next.js impoe que arquivos com essa diretiva so podem exportar:
- Funcoes async (que viram Server Actions / endpoints HTTP)
- Tipagens TypeScript (que sao removidas em build time)

Objetos como schemas Zod **nao sao funcoes**, entao o Next bloqueia o export. A solucao e mover o schema para um arquivo separado ou exportar apenas a tipagem inferida (`type OrganizationSchema = z.infer<typeof schema>`).

## Como funciona o revalidateTag

No Next.js App Router, fetches feitos em Server Components sao cacheados automaticamente. Quando voce faz:

```typescript
fetch(url, { next: { tags: ['organizations'] } })
```

Voce esta "tagueando" aquele fetch com um identificador. Depois, em qualquer Server Action, voce pode chamar:

```typescript
revalidateTag('organizations')
```

Isso invalida TODOS os fetches tagueados com 'organizations', forcando o Next a refazer a requisicao na proxima renderizacao. O instrutor compara tags a IDs: "e como se eu tivesse passando um id pra ela".

## Por que getCurrentOrg() ao inves de input hidden

O instrutor considera tres alternativas para passar o ID da organizacao para a Server Action:
1. Input hidden no formulario
2. `useParams()` no client
3. `getCurrentOrg()` no servidor

Ele escolhe a terceira porque Server Actions rodam no servidor, entao podem acessar diretamente o contexto de autenticacao. Isso e mais seguro (o usuario nao pode manipular o valor) e mais limpo.

## Server Actions + Server Components andam juntos

O instrutor faz uma observacao importante: "se for pra nao usar Server Actions e Server Components, e melhor criar uma aplicacao sem usar esses conceitos, fazendo tudo client-side mesmo". Ou seja, o valor real aparece quando voce combina:
- Server Components para fetch com cache
- Server Actions para mutacoes
- revalidateTag para sincronizar ambos

Usar apenas um sem o outro perde o beneficio principal.

## O fluxo completo

1. Server Component faz fetch tagueado → dados cacheados
2. Usuario edita formulario → submete para Server Action
3. Server Action faz PUT na API → chama `revalidateTag`
4. Next invalida cache → re-renderiza Server Component com dados novos
5. UI atualiza automaticamente (sem F5)