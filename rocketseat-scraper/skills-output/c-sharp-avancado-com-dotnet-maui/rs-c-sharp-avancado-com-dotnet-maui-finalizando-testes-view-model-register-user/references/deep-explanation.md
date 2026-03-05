# Deep Explanation: Testes de ViewModel com Cenarios de Falha

## Por que extrair validacoes em helpers?

O instrutor demonstra na pratica o problema: quando voce tem um `Verify` do Moq que valida multiplos parametros, cada um com `It.Is<T>` contendo lambdas complexas, a quantidade de parenteses abertos e fechados torna o codigo impossivel de ler e manter. O instrutor literalmente errou parenteses ao vivo e teve que corrigir — se isso acontece durante a aula, vai acontecer no dia a dia.

A solucao e criar metodos privados como `GetValidationForRoute(string route)` e `GetValidationForDictionaryErrors(string errorMessage)`. Cada helper encapsula uma validacao especifica e retorna o tipo que o `It.Is` produziria. O Verify fica limpo e legivel.

## Truque do void + return para descobrir tipos

O instrutor compartilha uma tecnica pratica: quando voce nao sabe qual tipo um metodo deve retornar (por exemplo, `It.Is<ShellNavigationState>` retorna o que?), declare o metodo como `private void`, escreva o `return` com a expressao, e deixe o Visual Studio reclamar. Use "Show potential fix" e a IDE corrige o tipo de retorno automaticamente. No caso, descobriu-se que era `ShellNavigationState`.

## Sintaxe simplificada de colecoes no .NET moderno

A partir de versoes recentes do .NET, voce pode usar `["item1", "item2"]` como forma simplificada de criar listas. Porem, ha uma restricao importante: essa sintaxe **nao funciona** quando atribuida a uma variavel com `var`. Funciona apenas quando passada diretamente como argumento de metodo, onde o compilador consegue inferir o tipo esperado.

```csharp
// NAO FUNCIONA
var x = ["error 1", "error 2"];

// FUNCIONA — passado direto como argumento
Result.Failure(["error 1", "error 2"])
```

## Por que forcar erros intencionais?

O instrutor enfatiza isso como pratica essencial. Ele demonstra dois cenarios:

1. **Trocou a chave do dicionario** de `"errors"` para `"ellison"` na ViewModel — o teste falhou corretamente, confirmando que o `ContainsKey("errors")` funciona.

2. **Trocou a rota** de `ErrorPage` para `OnboardingPage` na ViewModel — o teste falhou corretamente, confirmando que a validacao de rota funciona.

A mensagem de erro do Moq quando o Verify falha diz: "esperava que fosse executado 1 vez, mas foi executado 0 vezes". Isso acontece porque o Moq considera que a chamada com parametros diferentes e uma chamada diferente.

## Estrutura do assert triplo

Para um cenario de falha em ViewModel MAUI, tres coisas devem ser validadas:

1. **StatusPage volta ao default** — garante que a UI nao ficou em estado de loading
2. **Navegacao para ErrorPage** — garante que o usuario e redirecionado corretamente
3. **Dicionario com erros corretos** — garante que as mensagens de erro chegam na pagina de destino

Cada assert testa uma responsabilidade diferente da ViewModel, e todos sao necessarios para cobertura completa.

## Cast em dicionarios string-object

Quando o dicionario e `IDictionary<string, object>`, acessar `dictionary["errors"]` retorna `object`. Para verificar `.Count` ou `.Contains`, e necessario fazer cast para `IList<string>`. O instrutor mostra que sem o cast, o IntelliSense nao oferece os metodos esperados — voce precisa envolver em parenteses: `((IList<string>)dictionary["errors"]).Count`.