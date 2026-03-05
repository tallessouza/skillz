# Deep Explanation: Testando Classes de Erro

## Por que testar o Either com funcoes, nao apenas construtores

O instrutor comeca testando `right('success')` e `left('error')` isoladamente, mas rapidamente evolui para uma funcao `doSomething(x: boolean)` que decide qual caminho retornar. Isso e importante porque no dia a dia voce nunca "forca" o caminho — a funcao decide baseada em logica de negocio. Testar com funcoes simula o uso real em use cases.

## O problema do `instanceof`

Quando voce faz `if (result instanceof Right)`, funciona logicamente, mas:
1. E verboso ("meu Deus, isso aqui e muito grande")
2. O TypeScript nao consegue fazer narrowing automatico do tipo do `.value`

A solucao sao metodos auxiliares `isRight()` e `isLeft()` que retornam booleanos simples.

## O hack do TypeScript: `this is`

O ponto mais tecnico da aula. Quando voce declara:

```typescript
isRight(): this is Right<L, R> {
  return true
}
```

Voce esta dizendo ao TypeScript: "quando esse metodo retornar true, considere que `this` e do tipo `Right<L, R>`". Isso e um **type predicate** — um recurso avancado do TypeScript que permite narrowing customizado.

### Por que ambas as classes precisam de `<L, R>`

Originalmente, `Right` so tinha `<R>` e `Left` so tinha `<L>`. Mas para o `this is` funcionar corretamente, ambas as classes precisam conhecer ambos os tipos. Sem isso, o TypeScript nao consegue inferir o tipo correto do `.value` apos o narrowing.

O instrutor admite: "isso aqui e uma daquelas coisas que eu copio entre os projetos" — e um arquivo utilitario que nao muda entre projetos. O importante e entender o mecanismo, nao decorar a implementacao.

## Impacto nos use cases

Apos implementar o Either com type guards, todo use case que retorna `Either<Error, Success>` ganha narrowing automatico. Quando voce faz:

```typescript
const result = await createQuestionUseCase.execute(input)

if (result.isRight()) {
  result.value // TypeScript sabe que e o tipo de sucesso
}
```

Isso elimina casts manuais e torna o codigo mais seguro em tempo de compilacao.

## O que o instrutor nao aprofundou

Ele menciona explicitamente que nao vai aprofundar em TypeScript avancado ("nao e meu objetivo, nem sou tao especialista assim"). O `this is` e apresentado como um "hack util" que voce copia e usa, sem necessidade de dominar type-level programming.