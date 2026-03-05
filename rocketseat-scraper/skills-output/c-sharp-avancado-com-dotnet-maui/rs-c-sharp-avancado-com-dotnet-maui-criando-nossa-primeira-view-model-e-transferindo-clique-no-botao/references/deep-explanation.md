# Deep Explanation: ViewModel e Commands no .NET MAUI

## Por que separar View de ViewModel?

O instrutor Wellison enfatiza que a View (arquivo XAML + code-behind) deve ser responsavel apenas pela parte visual. A ViewModel assume toda logica: validacao, comunicacao com API, regras de negocio. Quando o usuario clica um botao na View, a execucao real acontece na ViewModel.

## O conceito de Command vs Click

Ponto central da aula: ao trabalhar com ViewModel, voce nao enxerga mais como "clique no botao". Voce enxerga como **comando a ser executado**. Essa mudanca de mentalidade e fundamental para MVVM.

O `ICommand` (de `System.Windows.Input`) e uma interface. A classe `Command` implementa essa interface. Ao instanciar `new Command(MinhaFuncao)`, voce passa a funcao como **parametro** (referencia), nao como chamada.

### Diferenca critica: referencia vs chamada

```csharp
// CORRETO - passa referencia da funcao
LoginCommand = new Command(LoginWithEmailAndPassword);

// ERRADO - chama a funcao imediatamente e passa o retorno (void)
LoginCommand = new Command(LoginWithEmailAndPassword());
```

O instrutor reforça: "Sem abrir e fechar parenteses, isso vira um parametro. E como se eu tivesse passando o numero 17, um texto — estou passando uma funcao como parametro."

## BindingContext: o atrelamento obrigatorio

```csharp
BindingContext = new OnboardingViewModel();
```

Essa propriedade `BindingContext` ja existe em `ContentPage`. Sem essa linha, nenhum binding no XAML funciona. O instrutor classifica como **obrigatorio**.

## x:DataType: opcional mas altamente recomendado

O `x:DataType` no XAML nao atrela a pagina a ViewModel (isso e feito no code-behind). Ele apenas **informa** ao Visual Studio/Rider qual e a ViewModel, habilitando:
- Autocomplete de propriedades e commands
- Validacao em tempo de compilacao

O instrutor diz: "Fazer isso aqui nao esta atrelando sua pagina a sua ViewModel. O que esta atrelando e o BindingContext. Esse parametro e pra simplificar nossa vida."

### Como declarar o xmlns e DataType

1. Adicione o namespace: `xmlns:viewModel="clr-namespace:Namespace.Da.ViewModel"`
2. Declare o tipo: `x:DataType="viewModel:OnboardingViewModel"`

## Funcoes na ViewModel nao precisam de parametros de evento

No code-behind, event handlers exigem `(object sender, EventArgs e)`. Na ViewModel, as funcoes podem ser sem parametro nenhum, porque nao sao disparadas pelo sistema de eventos — sao chamadas pelo Command.

## Limitacao reconhecida pelo instrutor

Cada botao exige: uma funcao + uma propriedade ICommand + atribuicao no construtor. Para telas com muitos botoes, isso gera muito boilerplate. O instrutor antecipa que na proxima aula introduzira o CommunityToolkit.Mvvm (pacote NuGet) para reduzir esse codigo.

## Organizacao de pastas: padrao espelhado

O instrutor cria a estrutura de ViewModels espelhando Views:
- Views/Pages/Onboarding/ → ViewModels/Pages/Onboarding/
- Views/Popups/ → ViewModels/Popups/

Justificativa: "Eu crio um padrao e fica facil o entendimento."