# Deep Explanation: Toggle de Favorito com RxResource e Signals

## Por que o toggle fica no Service e nao no Component?

O instrutor explica que seria possivel fazer a logica de add/remove diretamente no MovieDetails component, mas isso traria um problema concreto: seria necessario criar **dois RxResource separados** — um para adicionar e outro para remover. Isso faria o component crescer desnecessariamente e ficaria "bem chato de manipular".

A solucao e criar um unico metodo `toggleMovieFavorite` no FavoritesAPI service que recebe o estado atual (`isMovieCurrentFavorite: boolean`) e o `movieId`, e internamente decide qual endpoint chamar. O component fica responsavel apenas por passar o estado atual — a decisao e do service.

## O problema do signal com mesmo valor

Este e o insight mais importante da aula. O instrutor demonstra ao vivo o bug:

1. Clica para remover o favorito → funciona (204 No Content)
2. Clica para adicionar novamente → **nada acontece**

Por que? Porque o `isFavorite` ainda tem o mesmo valor de antes (nao foi atualizado apos o primeiro request). Quando se faz `this.toggleFavoriteParams.set(this.isFavorite())`, o signal recebe o **mesmo valor** que ja tinha. Signals no Angular **nao disparam dependencias quando o valor setado e igual ao anterior**. Logo, o RxResource nao e re-executado.

A solucao e usar o operador `tap` do RxJS no pipe do observable retornado pelo toggle. Apos o request completar com sucesso, o `tap` inverte o valor do `isFavorite` usando `this.isFavorite.update(cv => !cv)`. Assim, no proximo click, o valor passado para `toggleFavoriteParams` sera diferente do anterior, e o signal dispara normalmente.

## Por que undefined como valor inicial?

O RxResource dispara automaticamente quando seus params mudam. Se o signal comecar com `false`, o RxResource interpretaria isso como um valor valido e dispararia uma requisicao no carregamento da pagina — o que seria incorreto, pois o usuario nao clicou em nada.

Usando `undefined` como valor inicial e fazendo um guard (`if (status === undefined) return undefined`), o RxResource nao dispara o observable. Isso e um padrao recorrente no Angular com RxResource: usar undefined para sinalizar "ainda nao ha acao do usuario".

## O papel do linkedSignal no isFavorite

O `isFavorite` e um `linkedSignal` — um signal que pode ser derivado de outro signal mas tambem aceita updates manuais. Isso permite:
- Derivar seu valor inicial de outro signal (ex: resposta da API de check favorite)
- Atualizar manualmente via `.update()` apos o toggle ter sucesso

Essa dualidade (derivado + manual update) e essencial para o pattern funcionar.

## Fluxo completo

```
Click no coracao
  → toggleFavorite()
    → this.toggleFavoriteParams.set(this.isFavorite())  // ex: set(true)
      → RxResource params detecta mudanca
        → params retorna { currentFavoriteStatus: true, movieId: 123 }
          → stream chama favoriteApi.toggleMovieFavorite(true, 123)
            → Service ve true → chama removeMovieFromFavorites(123)
              → API retorna 204
                → tap() executa → this.isFavorite.update(cv => !cv)  // true → false
                  → UI atualiza coracao para vazio
                    → Proximo click: set(false) ≠ true anterior → dispara novamente
```

## Retorno do toggleMovieFavorite

O metodo pode retornar dois tipos diferentes de Observable:
- `Observable<void>` — quando remove (DELETE retorna 204 No Content)
- `Observable<IMovieToFavoriteSuccessResponse>` — quando adiciona (POST retorna o objeto criado)

Por isso a tipagem do retorno e `Observable<void | IMovieToFavoriteSuccessResponse>`.