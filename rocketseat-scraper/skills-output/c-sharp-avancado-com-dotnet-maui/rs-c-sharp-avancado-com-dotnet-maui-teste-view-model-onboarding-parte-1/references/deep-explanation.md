# Deep Explanation: Testes de Unidade para ViewModel de Onboarding

## Por que testar Commands e nao metodos?

O instrutor (Wellerson) explica que no padrao MVVM com CommunityToolkit.MVVM, o atributo `[RelayCommand]` gera automaticamente uma propriedade `ICommand` (ou `IAsyncRelayCommand`) com o nome da funcao + "Command". A View nunca chama o metodo diretamente — ela executa o comando. Portanto, o teste deve simular o mesmo caminho que a View percorre.

Exemplo: a funcao `LoginComEmailEPassword()` gera `LoginComEmailEPasswordCommand`. O comando e do tipo `IAsyncRelayCommand` porque a funcao e `async Task`.

Para funcoes `void` (como `LoginComGoogle`), o comando gerado nao tem `ExecuteAsync`, apenas `Execute`.

## Por que o Builder retorna Mock e nao o objeto?

Essa e a decisao mais contraintuitiva da aula. Wellerson propositalmente mostra a versao "normal" primeiro (retornar `.Object`) e depois muda para retornar o `Mock<T>` inteiro.

A razao: o `Mock<T>` tem o metodo `.Verify()` que permite fazer asserts sobre quais metodos foram chamados e quantas vezes. Se voce retorna apenas o `.Object` (a interface fake), perde acesso ao `.Verify()`.

O `.Object` so e usado no momento de instanciar a ViewModel: `new OnboardingViewModel(navigationService.Object)`.

## Tupla como retorno do CreateViewModel

O padrao de retornar tupla `(ViewModel, Mock<IService>)` e uma estrategia para manter o teste limpo. Sem isso, voce precisaria de variaveis de instancia na classe de teste ou repetir o setup em cada teste.

A sintaxe C# permite desestruturar: `var (viewModel, navigationService) = CreateViewModel();`

## O problema do ShellNavigationState

No final da aula, Wellerson demonstra um problema real: o `GoToAsync` do .NET MAUI nao recebe uma `string` diretamente — recebe um `ShellNavigationState`. O .NET MAUI faz conversao implicita de string para `ShellNavigationState`, mas o Moq nao reconhece essa conversao na hora do `Verify`.

Resultado: mesmo que a funcao seja chamada corretamente, o `Verify` reporta zero chamadas porque o parametro (string) nao casa com o tipo esperado (ShellNavigationState).

A solucao e tratada na parte 2 da aula.

## Organizacao dos testes

O instrutor mantem espelhamento entre a estrutura do projeto principal e o projeto de testes:

```
Projeto principal:              Projeto de testes:
ViewModels/                     (nome do projeto ja e ViewModels.Tests)
  Pages/                          Pages/
    Onboarding/                     Onboarding/
      OnboardingViewModel.cs          OnboardingViewModelTests.cs
```

## Bibliotecas e setup

- **Moq**: instalado tanto no projeto CommonTestUtilities (para builders) quanto no projeto de testes
- **Shouldly**: instalado no projeto de testes para asserts mais legíveis (`ShouldNotThrowAsync`)
- **xUnit**: framework de testes (atributo `[Fact]`)

## O padrao act = async () => ...

Ao inves de executar o comando diretamente no await, o instrutor armazena a execucao numa variavel `act`. Isso permite usar `act.ShouldNotThrowAsync()` do Shouldly — um assert que verifica que nenhuma excecao foi lancada durante a execucao.

## Times do Moq

O `Times` e um struct do Moq com opcoes:
- `Times.Once` — exatamente uma vez
- `Times.Never` — zero vezes
- `Times.Exactly(n)` — exatamente N vezes
- `Times.AtLeast(n)` — no minimo N vezes
- `Times.AtMost(n)` — no maximo N vezes