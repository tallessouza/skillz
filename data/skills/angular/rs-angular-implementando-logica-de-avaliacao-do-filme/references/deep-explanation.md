# Deep Explanation: Logica de Avaliacao com RxResource Condicional

## Por que RxResource e nao subscribe manual?

O instrutor usa `rxResource` porque ele gerencia automaticamente a inscricao no Observable. Quando qualquer signal dentro do callback `params` muda, o RxResource:

1. Executa o callback de `params`
2. Se o retorno for `undefined`, **nao** executa o `stream`
3. Se o retorno for um objeto valido, executa o `stream` com esses params
4. Se inscreve automaticamente no Observable retornado pelo `stream`

Isso elimina a necessidade de `subscribe()`, `unsubscribe()`, ou `takeUntilDestroyed()`.

## O problema da chamada inicial

O instrutor demonstra ao vivo o problema: ao carregar a pagina, o signal `id` recebe um valor da URL, o que muda o params e dispara a requisicao HTTP. Porem, `currentRating` ainda e undefined (usuario nao clicou em nada), resultando em rating = 0 no body. O backend rejeita com erro "nota deve ser entre 1 e 5".

A solucao e elegante: extrair o rating para uma constante, validar com `if (rating > 0)`, e retornar `undefined` quando invalido. O `undefined` e o mecanismo nativo do RxResource para "nao execute agora".

## Logica de deselecao

Quando o usuario clica na mesma estrela ja selecionada, o componente seta `currentRating` para 0. Isso e intencional porque:

- O signal muda (de 5 para 0, por exemplo)
- O params e recalculado
- Rating = 0, nao passa no `if (rating > 0)`
- Retorna `undefined`, nenhuma requisicao e feita

Ou seja, a deselecao naturalmente bloqueia chamadas HTTP sem nenhuma logica adicional. O instrutor destaca isso como um beneficio emergente do design.

## Concatenacao da URL

O endpoint segue o padrao REST: `POST /movies/{id}/rate` com body `{ rating: number }`. O instrutor concatena strings: `` `movies/${movieId}/rate` ``. O retorno e o filme atualizado (`IMovieResponse`), permitindo atualizar a UI com os novos dados de avaliacao (media, quantidade de votos).

## Tipagem generica no POST

Ao tipar `this.httpClient.post<IMovieResponse>(...)`, o TypeScript infere que o retorno e `Observable<IMovieResponse>`. Isso garante type safety no stream do rxResource e em qualquer lugar que consuma o resultado.