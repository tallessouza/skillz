# Deep Explanation: Listando Filmes Favoritos com RxResource

## Por que o servico fica em shared/ e nao na feature?

O instrutor explica um principio arquitetural importante: **features nao devem depender de outras features**. O `FavoritesApi` inicialmente parece pertencer a feature `favorites`, mas ele tem 3 metodos:
- `getFavorites()` — usado pela feature favorites
- `addMovieToFavorites()` — usado pela feature movies
- `removeMovieFromFavorites()` — usado pela feature movies

Se o servico ficasse em `features/favorites/`, a feature `movies` teria que importar de `features/favorites/`, criando um acoplamento direto entre features. A solucao e extrair para `shared/services/`, tornando-o um servico compartilhado injetado em ambas as features.

**Regra geral:** Se um servico sera injetado em mais de uma feature, ele pertence a `shared/`.

## RxResource: params como gatilho de execucao

O `rxResource` do Angular usa a propriedade `params` como gatilho reativo:
- `params: () => true` — executa imediatamente quando o componente carrega (o valor `true` e truthy, entao o stream e chamado)
- `params: () => undefined` — NAO executa (undefined e tratado como "sem parametros validos")
- `params: () => someSignal()` — executa sempre que o signal muda

O `stream` recebe um callback que retorna um Observable. O RxResource se inscreve automaticamente nesse Observable e gerencia o lifecycle (unsubscribe, etc).

## Computed vs LinkedSignal: quando usar cada um

O instrutor faz uma distincao clara:
- **`computed`**: Use quando o valor e DERIVADO de outros signals e voce NUNCA precisa setar manualmente. E read-only.
- **`linkedSignal`**: Use quando voce precisa de um signal derivado MAS que tambem pode ser setado manualmente (writable).

No caso da lista de favoritos, o valor sempre vem do resource. Nao ha necessidade de setar manualmente, entao `computed` e a escolha correta.

## Padrao de tratativa de erro no computed

```typescript
favoritesList = computed(() => {
  const errorOnResponse = !!this.favoritesResource.error();
  if (errorOnResponse) return [];
  return this.favoritesResource.value() ?? [];
});
```

A logica:
1. `this.favoritesResource.error()` retorna o erro se houver, ou `undefined`
2. `!!` converte para boolean
3. Se erro: retorna array vazio (o template nunca recebe `undefined`)
4. Se sucesso: retorna o value, com fallback `?? []` para o caso de value ser null/undefined

Esse padrao garante que o template SEMPRE recebe um array, independente do estado da requisicao.

## Reutilizacao de interfaces de tipagem

O instrutor verificou no Insomnia que o response do endpoint `/favorites` retorna objetos com a mesma estrutura do endpoint de listagem de filmes. Em vez de criar uma nova interface `IFavoriteMovieResponse`, ele reutilizou `MoviesListResponse` (que e um array de `IMovieResponse`).

Regra: so crie uma nova interface se as propriedades forem DIFERENTES. Mesma estrutura = mesma interface.