# Deep Explanation: Buscando Dados em Server Components

## Por que uma pasta HTTP dedicada?

O instrutor explica que gosta de criar uma pasta `src/http/` onde tudo relacionado a requisicoes HTTP fica organizado. Cada requisicao vira um arquivo individual (ex: `list-issues.ts`). A motivacao e separacao de responsabilidades — o componente nao precisa saber como a requisicao e feita, apenas consome a funcao.

## Schema parse como contrato de dados

O ponto-chave da aula e usar schemas (Zod) exportados das rotas de API para validar as respostas na camada HTTP. Quando voce faz `IssuesListResponseSchema.parse(data)`, duas coisas acontecem:
1. **Validacao em runtime** — se o backend retornar algo inesperado, o erro e claro
2. **Tipagem automatica** — o TypeScript infere o tipo de retorno da funcao, entao `listIssues()` retorna o tipo exato do schema

O instrutor demonstra passando o mouse sobre `listIssues` e mostrando que o TypeScript ja sabe que retorna `{ backlog: Issue[], todo: Issue[], inProgress: Issue[], done: Issue[] }`.

## Server Components e async/await

Conceito fundamental do React (nao apenas Next.js): Server Components podem ser funcoes assincronas. O instrutor enfatiza que isso e um conceito do React, nao exclusivo do Next.js App Router. Client Components (`"use client"`) nao podem usar esse padrao.

## Erro de hidratacao explicado

O instrutor encontra um erro `hydration failed` no botao de usuario. Explica que no servidor o usuario aparece como deslogado, mas no cliente o BetterAuth carrega o estado de autenticacao e mostra o usuario logado. Isso causa um mismatch de hidratacao.

A solucao ideal seria transformar o botao em Server Component com BetterAuth, mas o instrutor aceita temporariamente porque:
- O comportamento e esperado (auth so carrega no cliente)
- O impacto e apenas um layout shift no botao
- Sera corrigido depois com mudanca de estrategia

## Hack do position absolute para scroll

Para fazer uma section com scroll ocupar o espaco restante sem quebrar o layout, o instrutor usa:
- `relative` no container pai (root)
- `absolute` com `inset-0` no content
- `top-10` ou `top-11` para compensar o header

Isso faz o conteudo ocupar todo o espaco disponivel e ter scroll proprio.

## Customizacao de scrollbar com Tailwind

Usa o plugin `tailwind-scrollbar`:
- `scrollbar-track-transparent` — track invisivel
- `scrollbar-thumb-nave-600` — thumb com cor do tema

O instrutor encontrou um bug ao instalar: esqueceu um ponto e virgula na config, o que causou `can't resolve tailwind-scrollbar`. Apos limpar o cache (`.next`) e corrigir a sintaxe, funcionou.