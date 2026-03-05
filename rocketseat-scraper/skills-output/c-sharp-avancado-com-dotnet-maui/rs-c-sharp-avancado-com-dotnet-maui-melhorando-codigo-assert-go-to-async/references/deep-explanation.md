# Deep Explanation: Verify Extension Methods para Testes

## Por que extension methods e nao helpers estaticos comuns?

O instrutor escolhe extension methods especificamente porque permitem uma sintaxe fluente: `_navigationService.VerifyGoTo(...)` ao inves de `NavigationVerifyHelper.VerifyGoTo(_navigationService, ...)`. Isso mantem a leitura natural do teste.

## Por que nao criar extension para `It` do Moq?

O instrutor explica um detalhe tecnico importante do C#: a classe `It` do Moq e **estatica**, e o C# **nao permite extension methods para classes estaticas**. Por isso a extensao e criada para `Mock<INavigationService>`, que e uma classe de instancia.

## Tres regras para extension methods em C#

1. A **funcao** precisa ser `static`
2. A **classe** que contem a funcao precisa ser `static`
3. O **primeiro parametro** precisa ter o modificador `this` seguido do tipo que voce esta estendendo

```csharp
public static class MinhaExtensao        // regra 2: classe estatica
{
    public static void MeuMetodo(        // regra 1: metodo estatico
        this Mock<IService> service)     // regra 3: this + tipo
    { }
}
```

## `Times` vs `Func<Times>` — a sutileza

O metodo `Verify` do Moq aceita `Func<Times>` (uma funcao que retorna Times), nao `Times` diretamente. Por isso:

- Se voce recebe `Func<Times>` no seu extension method: pode passar `Times.Once` sem parenteses
- Se voce recebe `Times` (struct): precisa chamar `Times.Once()` com parenteses

O instrutor mostra que ambas as formas funcionam, mas recomenda `Func<Times>` para manter consistencia com a API do Moq.

## `All` + `Contains` — validacao elegante de listas

Ao inves de verificar cada mensagem individualmente, o instrutor usa:

```csharp
errors.All(errorMessages.Contains)
```

Isso verifica que **todos** os elementos de `errors` existem em `errorMessages`. O truque e passar `errorMessages.Contains` diretamente como funcao ao inves de criar um lambda `(e) => errorMessages.Contains(e)` — ambos funcionam, mas a versao direta e mais limpa.

## Filosofia: momentos de organizacao

O instrutor reforça repetidamente: apos implementar uma funcionalidade, pare e pergunte "esse codigo e util em outras partes?". Se sim, refatore antes de seguir. Isso evita debito tecnico acumulado e torna o sistema mais facil de testar e escalar.

## Method overloading para flexibilidade

Ao inves de parametros opcionais (`string? errorMessage = null`), o instrutor prefere **sobrecarga de metodos** — duas funcoes com o mesmo nome mas assinaturas diferentes. Isso torna a intencao mais clara e evita verificacoes de null dentro do metodo.