# Deep Explanation: Functional Error Handling

## Origem: Programacao Funcional

O pattern Either vem de linguagens funcionais como Elixir, Clojure e Haskell. Nessas linguagens, erros sao tratados com **tuplas** — estruturas com duas posicoes:

1. **Primeira posicao:** indicador de sucesso ou erro (`:ok` ou `:error` em Elixir)
2. **Segunda posicao:** o valor (resultado no caso de sucesso, motivo no caso de erro)

Em Elixir, por exemplo:
```elixir
{:ok, user}       # sucesso
{:error, "not found"}  # erro
```

No JavaScript/TypeScript nao temos tuplas nativas, entao usamos **objetos (classes)** para representar essa mesma ideia.

## Por que "Either"?

Either significa "um ou outro". A funcao vai retornar **ou** um erro **ou** um sucesso — nunca os dois, nunca nenhum. O tipo `Either<L, R>` e uma union type que forca isso no sistema de tipos.

## Por que "Left" e "Right"?

A convencao vem da ideia do fluxo da aplicacao:

```
UI → Controller → Use Case → Entity → Repository → Database
     ←────────────────────────────────────────────────────
```

- **Right (direita):** o fluxo continua avancando normalmente — sucesso
- **Left (esquerda):** o fluxo volta, algo deu errado — erro

O instrutor menciona que a nomenclatura nao e o mais importante. Voce pode usar `Failure` e `Success` se preferir. Mas `Left` e `Right` e a convencao mais comum na comunidade.

## Por que nao usar throw?

Quando voce faz `throw`, o TypeScript **nao consegue tipar o erro**. O chamador nao tem como saber, olhando o tipo de retorno, quais erros aquela funcao pode produzir. Com Either:

- O tipo de retorno **documenta** todos os caminhos possiveis
- O TypeScript **forca** o chamador a lidar com ambos os casos
- Nao ha surpresas em runtime

## Generics e inferencia

As funcoes helper `left()` e `right()` usam generics com inferencia automatica. Quando voce escreve:

```typescript
return left('Not found')
```

O TypeScript infere que `L = string`. E quando o tipo de retorno da funcao e `Either<string, object>`, ele valida que o left retorna string e o right retorna object.

O instrutor menciona que essa tipagem avancada e algo que ele simplesmente copia entre projetos — nao e necessario entender profundamente os generics para usar o pattern.

## Biblioteca PurifyTS

Para quem quer ir alem, a biblioteca [purify-ts](https://gigobyte.github.io/purify/) traz Either, Maybe, Tuple e outras estruturas de programacao funcional prontas para TypeScript. E uma alternativa a implementar manualmente.

## Either no core, nao no dominio especifico

O arquivo `either.ts` fica em `core/` porque e usado por **toda a aplicacao** — todos os use cases, todas as camadas que precisam retornar erro de forma tipada.