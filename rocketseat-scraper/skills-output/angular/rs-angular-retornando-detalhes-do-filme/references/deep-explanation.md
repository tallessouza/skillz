# Deep Explanation: Retornando Detalhes do Filme com Signal Input

## Por que Signal Input em vez de ActivatedRoute?

O instrutor destaca que "tem diversas formas que o Angular proporciona" para pegar o ID da URL, mas escolhe o Signal Input porque:

1. **Simplicidade** — elimina a injecao do ActivatedRoute e o subscribe manual nos params
2. **Reatividade nativa** — como `input.required()` retorna um Signal, ele integra diretamente com rxResource no campo `params`
3. **Pouco conhecido** — o instrutor menciona que "poucas pessoas utilizam" essa abordagem, indicando que e uma feature subutilizada do Angular moderno

## Como funciona o binding de rota → input

O Angular, quando configurado com `withComponentInputBinding()`, faz o seguinte:

1. Olha os parametros da rota ativa (ex: `:id` em `/details/:id`)
2. Procura no componente um `@Input()` ou `input()` com o **mesmo nome** do parametro
3. Injeta o valor automaticamente

Por isso o instrutor enfatiza: "o nome dela tem que ser do mesmo nome do id que nos colocamos aqui no app routes, dois pontos id, tem que ser do mesmo nome."

## Fluxo reativo completo

```
URL muda (/details/47)
  → Angular injeta "47" no Signal Input `id`
    → Signal emite novo valor
      → rxResource detecta mudanca em `params: () => this.id()`
        → Dispara `stream` com novo params
          → Chama `getMovieDetails(47)`
            → Retorna Observable com dados do filme
```

O ponto-chave e que **nenhum subscribe manual e necessario**. O rxResource gerencia o ciclo de vida da subscription automaticamente.

## Conversao string → number com `+`

O parametro vem da URL como string. O instrutor usa o operador unario `+` para converter:

```typescript
stream: ({ params }) => this._moviesApi.getMovieDetails(+params)
```

Isso e equivalente a `Number(params)` mas mais conciso. E um padrao idiomatico em JavaScript/TypeScript.

## withComponentInputBinding — configuracao obrigatoria

Sem essa configuracao no `app.config.ts`, o Angular simplesmente ignora o binding de rota para inputs. O instrutor explica: "eu tenho que falar para o Angular que isso daqui pode acontecer, que utilizando o input eu posso pegar o ID la da URL."

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    // ... outros providers
  ]
};
```

## Coesao do servico

O metodo `getMovieDetails` e adicionado ao `MoviesApiService` existente (nao a um servico novo), porque e um endpoint relacionado a filmes. Isso segue o principio de coesao por dominio — todos os endpoints de filmes ficam no mesmo servico.