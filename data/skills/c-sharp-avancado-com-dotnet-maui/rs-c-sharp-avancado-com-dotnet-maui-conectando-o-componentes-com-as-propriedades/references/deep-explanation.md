# Deep Explanation: Conectando Componentes com Propriedades

## Por que nao funciona criar uma ViewModel separada para componentes?

O instrutor explica um ponto critico: a classe do componente herda de `ContentView`, que por sua vez fornece os metodos `GetValue` e `SetValue`. Esses metodos sao essenciais para o funcionamento das BindableProperties. Uma ViewModel convencional nao tem essa heranca, entao `GetValue`/`SetValue` nao estariam disponiveis e o mecanismo de binding quebraria.

A solucao eh usar o proprio code behind como ViewModel, ja que ele naturalmente tem acesso a esses metodos por heranca.

## Entendendo propertyChanged vs propertyChanging

- **propertyChanging** (com `ing`): a funcao eh chamada ENQUANTO o valor esta sendo alterado, antes da atribuicao finalizar
- **propertyChanged** (com `ed`): a funcao eh chamada APOS a atribuicao do valor

Na pratica, para a maioria dos cenarios de componentes, nao faz diferenca qual usar. A distincao importa quando voce precisa capturar o estado anterior para rollback ou validacao condicional.

## Assinatura do callback

O callback recebe tres parametros:
1. `BindableObject bindable` — o proprio componente (precisa cast)
2. `object oldValue` — valor anterior (sera `string.Empty` na primeira atribuicao se esse for o default)
3. `object newValue` — novo valor sendo atribuido

Como os parametros sao `object`, eh necessario fazer `.ToString()` ou cast explicito para o tipo esperado.

## Parametros opcionais do BindableProperty.Create

A funcao `Create` tem muitos parametros opcionais alem dos 4 obrigatorios:
- `defaultBindingMode` — modo de binding (OneWay, TwoWay, etc.)
- `validateValue` — funcao de validacao
- `propertyChanged` — callback apos alteracao
- `propertyChanging` — callback durante alteracao
- E outros

Para pular parametros opcionais e chegar ao desejado, use parametros nomeados em C#: `propertyChanged: MinhaFuncao`. Isso evita ter que passar valores para todos os parametros intermediarios.

## x:Reference this — o que acontece por baixo

Quando voce faz `x:Name="this"` no ContentView e depois `BindingContext="{x:Reference this}"` no layout:
- O nome "this" eh arbitrario (poderia ser "dis", "myComponent", qualquer coisa)
- O BindingContext do VerticalStackLayout aponta para a instancia do ContentView
- Todos os filhos do VerticalStackLayout herdam esse BindingContext
- `{Binding Title}` resolve para a propriedade `Title` da classe do componente

Isso eh equivalente a fazer `BindingContext = this` no construtor do code behind, mas eh mais declarativo e afeta apenas o escopo do layout, nao o componente inteiro.

## Quando usar cada abordagem

O instrutor deixa claro que prefere a abordagem 3 (x:Reference) por ser mais concisa, mas reconhece que o contexto importa. A abordagem 1 com callback eh necessaria quando voce precisa:
- Fazer validacao antes de aplicar o valor
- Alterar outra propriedade em resposta a mudanca de uma
- Executar logica imperativa (chamar servicos, disparar eventos)

A abordagem 2 eh util quando voce quer IntelliSense completo no Visual Studio, pois o `x:DataType` permite que o editor mostre todas as propriedades disponiveis.

## O breakpoint bateu duas vezes — por que?

O instrutor demonstrou que o callback `propertyChanged` foi chamado duas vezes porque existem duas instancias do componente na pagina (uma com titulo "Nome" e outra com "E-mail"). Cada instancia recebe seu valor independentemente, disparando o callback separadamente.