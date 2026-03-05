# Deep Explanation: Return Pattern com Valores Genéricos

## Por que não usar `object`?

O instrutor (Wellison) explica que usar `object` como tipo de retorno funciona tecnicamente — o compilador não reclama porque todo tipo em C# herda de `object`. Uma string, um bool, uma instância de Model, tudo herda de `object`. Porém, o problema aparece no consumidor (ViewModel): ela recebe um `object` e precisa fazer cast explícito para `Models.User`, o que:

1. **Transfere responsabilidade** — a ViewModel não deveria saber como desserializar
2. **Quebra em runtime** — se o tipo mudar, o erro só aparece em execução
3. **Perde IntelliSense** — sem tipo concreto, o IDE não ajuda

## Genéricos em C# — A solução `<TResponse>`

A sintaxe `class Result<TResponse>` declara um tipo genérico que será definido em tempo de compilação. O nome `TResponse` é convencional (poderia ser `T`, `TResult`, etc.), mas o instrutor escolhe `TResponse` para ser descritivo.

Quando o UseCase faz `Result<Models.User>.Success(model)`, o compilador substitui `TResponse` por `Models.User` em toda a classe. Isso significa que `Response` vira `Models.User Response` — sem cast, sem conversão, sem risco.

## Por que separar em duas classes?

O cenário real apresentado: o UseCase de **registro** não precisa devolver dados (apenas sucesso/falha), mas o UseCase de **get profile** precisa devolver o `Models.User`. Se `Result` sempre exigisse `<TResponse>`, o registro seria forçado a passar um tipo inútil.

A solução é herança:
- `Result` — base, sem dados
- `Result<TResponse> : Result` — herda tudo e adiciona `Response`

Assim, `Result` sozinho funciona para operações void, e `Result<T>` funciona quando há dados.

## A keyword `new` em métodos estáticos

Quando `Result<T>` define `Failure()` com a mesma assinatura de `Result.Failure()`, o compilador emite warning CS0108: "'Result<T>.Failure()' hides inherited member 'Result.Failure()'". O `new` keyword comunica intenção: "sim, eu sei que estou escondendo o método base, e é isso que eu quero."

Isso é diferente de `override` — métodos estáticos não podem ser virtual/override. O `new` simplesmente diz ao compilador para usar esta versão quando o contexto é `Result<T>`.

## Construtores `protected` — Factory Pattern implícito

O instrutor usa construtores `protected` para que ninguém faça `new Result()` diretamente. A única forma de criar um `Result` é via `Result.Success()` ou `Result.Failure()`. Isso garante:

1. **Invariantes preservados** — `IsSuccess` sempre corresponde à presença/ausência de errors
2. **API clara** — o consumidor sabe exatamente as duas formas de criar um resultado
3. **Extensibilidade** — a classe filha pode chamar `base()` mas código externo não pode instanciar

## `base()` — Chamando o construtor pai

`Result<TResponse>` precisa chamar `base()` no construtor para que `IsSuccess` e `ErrorMessages` sejam preenchidos na classe mãe. Sem isso, a herança existe mas as propriedades ficam com valores default (false, null), gerando bugs sutis.

## Nullable `TResponse?`

O warning do compilador sobre "non-nullable property must contain a non-null value" aparece porque no cenário de Failure, nenhum `TResponse` é passado. A solução é marcar como `TResponse?` — o instrutor explica que na prática nunca será null quando `IsSuccess = true`, mas a declaração satisfaz o compilador.