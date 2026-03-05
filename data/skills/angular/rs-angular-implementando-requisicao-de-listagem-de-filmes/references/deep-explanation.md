# Deep Explanation: Servico HTTP para Listagem em Angular

## Por que o servico fica dentro da feature?

O instrutor explica que o servico `MoviesApi` e especifico da parte de filmes, entao ele pertence a `movies/services/`. Isso segue o principio de colocation — codigo relacionado vive junto. Servicos genericos (auth, interceptors) ficam em shared, mas servicos de dominio ficam na feature.

## A importancia do nome singular vs plural

O instrutor para no meio da implementacao e corrige o nome de `IMoviesResponse` para `IMovieResponse`. Ele enfatiza: "isso é muito, mas muito importante para a organização do seu projeto." A interface representa UM filme, nao uma lista. O plural no nome sugeriria erroneamente que e uma colecao.

## Por que criar um type alias para a lista?

O instrutor explica o raciocinio: "para eu não precisar ficar toda hora fazendo esse array aqui colocando dessa forma se eu precisar utilizar essa tipagem de lista de filmes em outros lugares." Em vez de escrever `IMovieResponse[]` repetidamente, cria-se `MoviesListResponse` como type alias. Isso:

1. Centraliza a definicao — se a estrutura mudar, muda em um lugar
2. Melhora legibilidade — `MoviesListResponse` e mais expressivo que `IMovieResponse[]`
3. Facilita refatoracao futura — se a API passar a paginar, muda apenas o type

## Convencao de prefixo I

O instrutor distingue: interfaces usam prefixo `I` (`IMovieResponse`), mas type aliases nao (`MoviesListResponse`). Isso porque `type` nao e interface — e um alias. A convencao ajuda a distinguir os dois construtos do TypeScript.

## Token via interceptor

O metodo `getMovies()` nao recebe parametros. O instrutor explica: "Apenas o token que já está sendo passado de forma automática, por conta do nosso interceptor." Isso mostra uma arquitetura limpa onde concerns de autenticacao estao separados dos servicos de dominio.

## Organizacao de pastas

```
movies/
  services/
    movies-api.ts          # Servico HTTP especifico da feature
shared/
  models/
    movie-response.ts      # Interface de resposta (singular)
  types/
    movies-list-response.ts # Type alias para colecao
```

O instrutor usa Insomnia para verificar a estrutura da resposta da API antes de criar a interface, mostrando a importancia de conhecer o contrato da API antes de tipar.