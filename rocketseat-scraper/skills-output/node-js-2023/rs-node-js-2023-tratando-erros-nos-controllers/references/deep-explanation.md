# Deep Explanation: Tratando Erros nos Controllers

## Por que nao usar erros genericos?

O instrutor enfatiza que simplesmente verificar `if (result.isLeft())` e lancar um erro generico desperdiça todo o trabalho feito na camada de dominio. Os use cases ja retornam erros especificos como `WrongCredentialsError` e `StudentAlreadyExistsError` — o controller precisa traduzir esses erros para o vocabulario HTTP.

A motivacao principal: **o front-end precisa de status codes corretos para reagir adequadamente**. Um 401 pode redirecionar para login, um 409 pode mostrar "email ja cadastrado", mas um 400 generico nao diz nada.

## O pattern switch + error.constructor

O `error.constructor` retorna a classe que originou o erro. Isso permite fazer pattern matching sem precisar de `instanceof` em cadeia:

```typescript
switch (error.constructor) {
  case WrongCredentialsError:    // compara a classe diretamente
  case StudentAlreadyExistsError:
  default:
}
```

O instrutor escolhe `switch` ao inves de `if/else instanceof` porque escala melhor quando ha multiplos erros possiveis.

## Excecoes HTTP do NestJS

O NestJS fornece excecoes prontas em `@nestjs/common` que automaticamente geram a resposta HTTP correta:

| Excecao | Status Code | Quando usar |
|---------|-------------|-------------|
| `BadRequestException` | 400 | Erro esperado generico |
| `UnauthorizedException` | 401 | Credenciais invalidas |
| `ForbiddenException` | 403 | Sem permissao |
| `NotFoundException` | 404 | Recurso nao encontrado |
| `ConflictException` | 409 | Conflito de dados (duplicidade) |

Erros nao capturados pelo controller resultam em `InternalServerError` (500) automaticamente — o instrutor destaca que isso e o comportamento desejado para erros inesperados: "nao tem o que a gente fazer de tratativa, ate porque foi um erro nao esperado."

## Controllers sem erros esperados

Para use cases como `CreateQuestion` e `FetchRecentQuestions` que nao definem erros de dominio especificos, o instrutor usa o pattern simplificado:

```typescript
if (result.isLeft()) {
  throw new BadRequestException()
}
```

A logica: se nao ha erro esperado mapeado, qualquer `isLeft()` e uma situacao anomala que merece no maximo um 400. Se for algo realmente grave, o erro nem chegaria ao `isLeft()` — seria uma excecao nao tratada que vira 500.

## Conexao com a arquitetura Either/Result

Este pattern so funciona porque os use cases retornam `Either<Error, Success>` ao inves de lancar excecoes. O controller e a camada que traduz:

```
Dominio (Either) → Controller (switch) → HTTP (Exception) → Response (status code + message)
```

A mensagem de erro vem da classe de dominio (`error.message`), mantendo a separacao de responsabilidades: o dominio define O QUE deu errado, o controller define COMO comunicar via HTTP.