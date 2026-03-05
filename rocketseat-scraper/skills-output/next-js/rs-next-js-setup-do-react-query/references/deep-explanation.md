# Deep Explanation: Setup do React Query no Next.js App Router

## Por que separar dados em duas requisições?

O instrutor usa o exemplo de um board (kanban) para ilustrar uma decisão arquitetural importante. Os cards do board (backlog, to do, in progress, done) são iguais para todos os usuários — são dados públicos. Porém, o número de likes e se o usuário logado deu like ou não é específico de cada usuário.

A sacada: em vez de fazer UMA requisição que traz tudo (cards + likes), o instrutor propositalmente faz DUAS:

1. **Requisição dos cards** — Server Component, cacheável. Se 1 milhão de usuários acessarem no mesmo minuto, o Next.js pode servir o cache do front-end sem bater no back-end para cada um.
2. **Requisição das interações (likes/comentários)** — Client Component com React Query. Essa depende de quem está logado, então não pode ser cacheada no nível do servidor Next.js.

## As duas exceções ao cache do Next.js

O instrutor destaca que Server Components no App Router são cacheáveis por padrão, mas existem duas exceções:

### Exceção 1: Requisições feitas no client-side
Requisições via useEffect, fetch no navegador, ou useQuery do React Query — são cacheadas apenas no navegador individual do usuário. Se 1 milhão de usuários acessam, todos os 1 milhão batem no back-end. O cache no navegador de cada um existe, mas é difícil de controlar.

### Exceção 2: Requisições que dependem do usuário logado
Qualquer requisição que usa headers, cookies, ou dados que identificam o usuário não pode ser cacheada no Next.js. Por quê? Porque a resposta é customizada para aquele usuário específico. O Diego vê likes diferentes do que outro usuário veria.

## Por que useState para instanciar o QueryClient?

A documentação oficial do TanStack Query pede isso. O useState garante que a instância do QueryClient seja criada uma única vez e nunca recriada em re-renders subsequentes. Se você instanciar fora do useState (como `const client = new QueryClient()`), um novo client é criado a cada render, perdendo todo o cache e estado das queries.

## O mix Server + Client Component

A regra de ouro do React (não só do Next.js): um componente marcado com `"use client"` NÃO pode ter um Server Component chamado diretamente dentro dele como JSX. Porém, se o Server Component for passado como `children`, funciona perfeitamente.

É por isso que o padrão de Provider funciona:
- O Provider é `"use client"` (precisa de useState)
- O layout é Server Component
- O children (as páginas) são Server Components
- Tudo funciona porque os Server Components são passados como children, não renderizados diretamente dentro do Client Component

O instrutor enfatiza: "O que eu NÃO posso fazer é ter um `use client` e dentro dele chamar um componente assíncrono (Server Component) diretamente."

## Decisão arquitetural do instrutor

O instrutor deixou os likes em "12" hardcoded propositalmente durante as aulas anteriores. Toda a listagem do board foi construída com Server Components primeiro. Só agora, quando precisa de dados do usuário logado, ele introduz o React Query. Isso mostra o princípio: comece com Server Components para tudo que puder, e só adicione Client Components onde realmente precisa de dados específicos do usuário ou interatividade.