# Deep Explanation: Carregando Interacoes no Board

## Por que separar server e client components?

No Next.js App Router, pages sao server components por padrao. Isso significa que voce pode usar `async/await` diretamente, mas NAO pode usar hooks do React (`useState`, `useEffect`, `useQuery`, `useMemo`).

Quando voce precisa de ambos — fetch inicial no servidor E reatividade no cliente — a solucao eh a **composicao**: a page (server) faz o fetch e passa os dados para um client component que gerencia o estado reativo.

O instrutor enfatiza: "o carregamento dos dados vai ficar na página mesmo, somente o conteúdo da página que vai ficar nesse componente no BoardContent." Essa separacao eh o padrao fundamental.

## Por que usar Map em vez de find?

O board tem issues em 4 colunas (backlog, todo, inProgress, done). Para cada issue renderizada, voce precisa buscar sua interacao. Com `.find()`, cada busca percorre o array inteiro — O(n) por issue, O(n*m) total.

Com `Map`, voce constroi o indice uma vez e cada lookup eh O(1). O `useMemo` garante que o Map so eh reconstruido quando `interactionsData` muda.

## Por que sort().join() na query key?

O React Query usa a query key para cache. Se os IDs estiverem em ordem diferente (ex: uma issue mudou de coluna), a key muda e o cache eh invalidado desnecessariamente. O `sort()` garante que a mesma combinacao de IDs sempre gere a mesma key, independente da ordem.

## Por que importar de `http` e nao de `api`?

O instrutor alerta: "esse getIssueInteractions aqui, eu vou importar ele de dentro de HTTP, não de API, cuidado." A pasta `api` contem funcoes server-side (usam cookies, headers do request). A pasta `http` contem funcoes client-side que fazem fetch para a API. Dentro de um `use client` component, voce DEVE usar as funcoes de `http`.

## Tipagem do Map

O instrutor cria um tipo explicito para o Map:

```typescript
type InteractionsMap = Map<string, {
  isLiked: boolean
  likesCount: number
}>
```

Isso garante que ao fazer `interactions.get(issueId)`, o TypeScript sabe exatamente o shape do retorno (ou `undefined` se a key nao existir).

## Fallbacks para dados opcionais

Como `interactions.get(issue.id)` pode retornar `undefined` (a issue pode nao ter interacoes carregadas ainda), todo acesso usa optional chaining com fallback:

- `interaction?.likesCount ?? 0` — sem likes, mostra zero
- `interaction?.isLiked ?? false` — sem dado, assume nao curtido

## Replicando para todas as colunas

O instrutor copia a mesma logica de `const interaction = interactions.get(issue.id)` e o `<IssueLikeButton>` para cada coluna (backlog, todo, inProgress, done). Em um cenario real, isso sugere extrair um componente `IssueCard` que encapsula essa logica, evitando repeticao.

## Sobre o useMemo sem React Compiler

O instrutor menciona: "eu não tô usando o React Compiler aqui também." O React Compiler (React 19+) automatiza memoizacao, tornando `useMemo` desnecessario em muitos casos. Sem ele, `useMemo` eh necessario para evitar reconstruir o Map a cada render.