# Deep Explanation: Lógica de Identificação de Filme Favorito

## Por que a lógica fica no service e não no componente?

O instrutor enfatiza que não quer fazer o processamento dentro da classe do componente MovieDetails "porque senão vai acumular muita coisa para ele". Esse é um princípio de separação de responsabilidades — o componente deve orquestrar a UI, enquanto o service encapsula a lógica de negócio e transformação de dados.

O método `isMovieInFavorites` no `FavoritesApi` service:
1. Chama `getFavorites()` (que retorna `Observable<MoviesListResponse>`)
2. Usa `pipe(map(...))` para transformar a lista em booleano
3. Retorna `Observable<boolean>` — o componente só recebe true/false

## O operador `map` do RxJS

O instrutor explica: "O map serve para isso. Ele recebe um valor e eu consigo manipular para retornar um outro valor de outro tipo."

O `map` transforma o valor emitido pelo Observable sem alterar a cadeia reativa. O Observable original emitia `MoviesListResponse` (lista de filmes), e após o `map`, ele emite `boolean`.

**Cuidado com o import:** O instrutor alerta para importar `map` do RxJS (`rxjs` ou `rxjs/operators`), não confundir com `Array.prototype.map`.

## O `find` para membership check

Dentro do `map`, usa-se `Array.find()`:
- Recebe callback com cada item da lista
- Retorna o item se `favoriteMovie.id === movieId`
- Retorna `undefined` se não encontrar

O instrutor converte isso para booleano: se `find` retorna o objeto do filme → true (existe na lista). Se retorna `undefined` → false.

## rxResource: reatividade automática

O `rxResource` é configurado com:
- `params`: função que retorna o valor do signal `this.id()` — quando o ID na URL muda, o resource re-executa
- `stream`: função que recebe os params e retorna o Observable do service

Isso elimina a necessidade de `subscribe` manual e gerenciamento de lifecycle.

## linkedSignal vs signal vs computed

O instrutor faz uma mudança importante: o `isFavorite` que era um `signal()` normal é convertido para `linkedSignal`. Por quê?

- `signal()`: valor manual, sem reatividade derivada
- `computed()`: valor derivado, mas read-only — não pode fazer `.set()` ou `.update()`
- `linkedSignal()`: valor derivado de outro signal MAS também permite `.set()` e `.update()` manual

O instrutor antecipa: "futuramente eu vou precisar fazer um update no valor dele" — quando o usuário clicar no coração para toggle, será necessário mudar o valor manualmente. O `computed` não permite isso, mas o `linkedSignal` sim.

## Tratamento de erro no linkedSignal

Padrão defensivo:
```typescript
const errorOnResponse = !!this.isMoveFavoriteResource.error();
if (errorOnResponse) return false;
return this.isMoveFavoriteResource.value() ?? false;
```

Se a requisição falhar, o coração simplesmente não preenche (false). O fallback `?? false` cobre casos onde o value é null/undefined.

## Consideração de performance

O instrutor reconhece abertamente: "Eu sei que essa daqui não é a lógica mais performática." Em produção, o ideal seria o backend ter um endpoint dedicado como `GET /favorites/:movieId/exists` que retorna diretamente um booleano, evitando transferir a lista inteira e fazer o loop no frontend.

Para o contexto do curso, a abordagem funciona bem e serve como exercício didático de RxJS operators e reactive patterns.

## Fluxo completo

1. Tela de detalhes carrega → signal `id()` é populado com ID da URL
2. `rxResource` detecta mudança no `id()` → executa `isMovieInFavorites(id)`
3. Service chama `getFavorites()` → recebe lista → `map` + `find` → retorna boolean
4. `linkedSignal` recebe o boolean do resource → atualiza `isFavorite()`
5. Template reage: `@if (isFavorite())` → mostra coração preenchido ou vazio