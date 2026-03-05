# Deep Explanation: Visualizacao Dinamica de Documentos

## Por que rotas dinamicas com ID?

O instrutor explica que cada documento e unico, entao a pagina precisa ser dinamica e receber o ID do documento. Sem o ID na URL, nao ha como saber qual documento buscar. A rota muda de `/document` (estatica) para `/documents/:id` (dinamica).

## NavLink vs Link — a diferenca sutil

O React Router oferece dois componentes: `Link` e `NavLink`. A unica diferenca e que o NavLink adiciona informacao sobre se aquele link corresponde a rota atual. No HTML puro, ele adiciona uma classe `active`, mas com Tailwind isso nao ajuda diretamente.

A solucao do instrutor: ao inves de passar `className` como string, passar como **funcao**. Essa funcao recebe `{ isActive }` (booleano) e retorna as classes. Combinando com `clsx`, voce pode condicionalmente aplicar `bg-rotion-700` quando `isActive` e true.

## Query Key como identidade — por que o array importa

O instrutor enfatiza que quando uma query busca dados parametrizados (como um documento especifico por ID), e "super importante" incluir o parametro na chave da query. Usando `['document', id]`, o React Query automaticamente entende que quando o `id` muda, precisa re-executar a query. Sem isso, o cache retornaria dados do documento anterior.

## isFetching vs isLoading — quando cada um importa

O instrutor faz uma distincao clara:

- **isLoading**: retorna `true` **somente no primeiro carregamento**, quando a query nunca executou antes
- **isFetching**: retorna `true` **toda vez** que a query esta executando

No caso de visualizacao de documento, o usuario troca de documento frequentemente (muda o ID). Cada troca dispara nova execucao. Se usasse `isLoading`, apos o primeiro documento carregado, o loading nunca mais apareceria — mesmo durante a busca de um novo documento. Com `isFetching`, o estado de carregamento aparece em toda transicao.

## O problema do `undefined` no useParams

`useParams` retorna `string | undefined` para cada parametro. O TypeScript reclama ao passar `id` para funcoes que esperam `string`. O instrutor resolve de duas formas complementares:

1. **`enabled: !!id`** — a query so executa quando id existe
2. **`id!` (non-null assertion)** — dentro da queryFn, afirma que id nao e undefined

O instrutor nota que "o React Query nao e esperto o bastante para identificar" que com `enabled: !!id` o id jamais sera undefined dentro da queryFn, entao a assertion manual e necessaria.

## useMemo para preparacao de conteudo

O titulo do documento nao esta salvo com tags HTML, mas o editor espera HTML. O instrutor usa `useMemo` para:

1. Envolver o titulo em `<h1>`
2. Concatenar o conteudo (que ja e HTML) ou um `<p></p>` vazio como fallback
3. Recalcular apenas quando `data` muda

O paragrafo vazio como fallback e uma decisao de UX: sem ele, o cursor cairia dentro do titulo ao clicar no documento, obrigando o usuario a dar Enter antes de digitar. Com o `<p></p>`, ja existe um paragrafo pronto para digitacao.

## Renderizacao condicional — por que duas condicoes

O editor so aparece quando:
- `!isFetching` — dados ja chegaram
- `data` — existe conteudo para exibir

Sem essa guarda, o editor receberia `content=""` ou `undefined` durante o carregamento, causando flash de conteudo vazio ou erros.