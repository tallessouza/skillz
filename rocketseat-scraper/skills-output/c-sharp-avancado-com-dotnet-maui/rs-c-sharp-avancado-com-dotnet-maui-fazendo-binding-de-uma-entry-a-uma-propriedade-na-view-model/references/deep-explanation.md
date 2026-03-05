# Deep Explanation: Binding de Entry a Propriedade na ViewModel

## Por que a View nao atualiza sem ObservableProperty?

O instrutor demonstra o problema ao vivo: ao criar uma propriedade simples `public string Texto { get; set; }`, o binding acontece **uma unica vez** — no momento em que o `BindingContext` e atribuido (o `new` da ViewModel no code-behind).

Nesse momento, `Texto` e uma string vazia. Quando o usuario digita na Entry, o valor ate chega na propriedade (comprovado pelo breakpoint), mas a View nao e notificada da mudanca. O Label conectado via `{Binding Texto}` permanece vazio.

Isso acontece porque o padrao MVVM exige uma **notificacao de mudanca** (INotifyPropertyChanged). Sem ela, a View nao sabe que precisa re-ler o valor da propriedade.

## Como o Community Toolkit resolve isso

O atributo `[ObservableProperty]` e um source generator. Quando voce escreve:

```csharp
[ObservableProperty]
string texto;
```

O Toolkit gera por baixo dos panos uma propriedade completa com notificacao:

```csharp
public string Texto
{
    get => texto;
    set => SetProperty(ref texto, value);
}
```

O `SetProperty` (herdado de `ObservableObject`) dispara o evento `PropertyChanged`, que a View escuta para se atualizar.

## Analogia com RelayCommand

O instrutor faz uma analogia direta: assim como `[RelayCommand]` transforma um metodo `DoLogin()` em uma propriedade `DoLoginCommand` do tipo `ICommand`, o `[ObservableProperty]` transforma um campo `texto` em uma propriedade `Texto` observavel.

Ambos exigem `partial class` porque o source generator precisa criar codigo complementar na mesma classe.

## A armadilha da inicial maiuscula

O campo DEVE comecar com letra minuscula porque o Toolkit gera a propriedade com a primeira letra maiuscula. Se voce declarar `[ObservableProperty] string Texto;`, havera conflito de nomes.

## xmlns e x:DataType — opcional mas recomendado

O instrutor explica que adicionar o namespace da ViewModel no XAML e usar `x:DataType` nao e obrigatorio para o binding funcionar, mas habilita:
- IntelliSense para propriedades e comandos no XAML
- Validacao em tempo de compilacao
- Binding compilado (melhor performance)

O que e obrigatorio e o `BindingContext = new ViewModel()` no code-behind.

## Estrutura de pastas espelhada

O instrutor segue um padrao rigido: a hierarquia de pastas da ViewModel espelha exatamente a da Page.

```
Pages/Login/DoLogin/DoLoginPage.xaml
ViewModels/Pages/Login/DoLogin/DoLoginViewModel.cs
```

Isso facilita encontrar a ViewModel correspondente a qualquer pagina e vice-versa.

## Bug do Visual Studio com IntelliSense

O instrutor demonstra ao vivo um bug do Visual Studio onde a propriedade gerada `Texto` nao aparece no IntelliSense apos refatoracao. A solucao e simples: apagar o texto e redigitar. E um bug cosmético que nao afeta a compilacao.