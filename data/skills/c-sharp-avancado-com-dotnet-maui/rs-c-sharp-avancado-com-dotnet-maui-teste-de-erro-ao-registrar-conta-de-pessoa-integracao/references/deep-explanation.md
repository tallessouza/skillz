# Deep Explanation: Testes de Erro em Integração para APIs .NET

## Filosofia de distribuição de testes

O instrutor enfatiza um princípio importante: **não é necessário cobrir todos os cenários de erro em cada tipo de teste**. A cobertura total deve existir, mas distribuída estrategicamente:

- **Testes de validator**: cobrem regras de validação individuais
- **Testes de use case**: cobrem lógica de negócio e exceções
- **Testes de integração**: cobrem o pipeline completo (request → middleware → controller → use case → exception filter → response)

O valor do teste de integração de erro não é testar a validação em si (já coberta), mas confirmar que o **pipeline de erro funciona end-to-end**: a exceção é lançada, capturada pelo filtro de exceção, e transformada em `ResponseErrorJSON` com status 400.

## Short-circuit evaluation do C#

O instrutor explica que o C# é "preguiçoso" com operadores lógicos. Num `&&`:

```
FALSE && qualquer_coisa = FALSE (sem avaliar o lado direito)
```

Isso é explorado para null-safety:

```csharp
error.GetString().NotEmpty() && error.GetString()!.Equals(msg)
```

Se `NotEmpty()` retorna `false` (string nula ou vazia), o C# nem executa `Equals()`, evitando `NullReferenceException`. Só depois dessa verificação é seguro usar `!` (null-forgiving operator).

## Por que não usar `!` diretamente

O instrutor faz questão de explicar: **num teste de integração, você não pode afirmar que algo não é nulo**. Diferente de código de produção onde você controla o fluxo, no teste você está validando comportamento. Se alguém alterou a API e um elemento da lista de erros veio nulo, usar `!` mascararia o problema com uma exceção genérica em vez de uma falha de asserção clara.

## O papel do `ShouldSatisfyAllConditions`

Agrupa asserções de forma que **todas são avaliadas** mesmo que uma falhe. Sem ele, a primeira falha interrompe o teste e você não vê as demais. Com ele, o relatório mostra todas as condições que falharam.

## JsonDocument e EnumerateArray

O `JsonDocument` do System.Text.Json não deserializa para objetos tipados — ele dá acesso ao DOM JSON. `EnumerateArray()` retorna um `JsonElement.ArrayEnumerator`, que é diferente de uma `List<string>`. Por isso:

- `Count()` precisa de parênteses (é método, não propriedade)
- Cada elemento é `JsonElement`, não `string` — precisa de `GetString()`
- O debugger mostra "Undefined" ao passar o mouse, mas expandindo "Result View" os valores aparecem

## Middleware de cultura e idioma

A API tem um middleware que define o idioma das mensagens de erro baseado no header da requisição. Sem header, usa inglês por padrão. O teste não envia header de idioma, então valida contra `ResourceMessageException.NAME_EMPTY` em inglês. Na próxima aula, o instrutor planeja testar com diferentes idiomas.

## ResponseErrorJSON

A API retorna erros no formato:

```json
{
  "errors": ["The name cannot be empty"],
  "tokenIsExpired": false
}
```

O teste foca apenas na propriedade `errors`. A propriedade `tokenIsExpired` será relevante em outro contexto.