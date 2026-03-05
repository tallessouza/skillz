# Code Examples: Status Page Pattern no .NET MAUI

## 1. Criacao do Enum StatusPage

```csharp
// Models/StatusPage.cs
// Removidos os usings desnecessarios (Ctrl+R+G no Visual Studio)
namespace PlanShare.App.Models;

public enum StatusPage
{
    Default = 0,  // Pagina exibe conteudo principal (formulario)
    Sending = 1   // Pagina exibe animacao de envio
}
```

**Nota:** O instrutor comeca com `internal class` (template padrao) e troca para `public enum`. Os valores explicitos (`= 0`, `= 1`) sao preferencia do instrutor para manter controle.

## 2. ViewModelBase com propriedade StatusPage

```csharp
// ViewModels/ViewModelBase.cs
public partial class ViewModelBase : ObservableObject
{
    [ObservableProperty]
    private StatusPage statusPage;

    public ViewModelBase()
    {
        StatusPage = StatusPage.Default;
    }
}
```

**Pontos criticos:**
- `partial` e obrigatorio para o CommunityToolkit funcionar
- `[ObservableProperty]` no campo `statusPage` (minusculo) gera a propriedade `StatusPage` (maiusculo)
- Construtor garante estado inicial Default

## 3. Uso na ViewModel de Registro

```csharp
// Na ViewModel de RegisterAccount (metodo de submit)

// Linha executada ANTES da chamada API
StatusPage = StatusPage.Sending;

// Chamada assincrona para a API
await _registerAccountUseCase.Execute(request);

// Linha executada DEPOIS da chamada API (volta ao normal)
StatusPage = StatusPage.Default;
```

**Fluxo:**
1. Usuario clica no botao
2. `StatusPage = Sending` → pagina esconde formulario, mostra animacao
3. `await` executa a request
4. `StatusPage = Default` → pagina mostra formulario, esconde animacao

## 4. Estrutura XAML completa

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:inputsComponent="clr-namespace:PlanShare.App.Vios.Components.Inputs"
             xmlns:animationComponent="clr-namespace:PlanShare.App.Vios.Components.StatusPage">

    <!-- Layout raiz unico (requisito do ContentPage) -->
    <VerticalStackLayout>

        <!-- Grupo 1: Formulario (visivel quando Default) -->
        <VerticalStackLayout IsVisible="False">
            <Label Text="Crie sua conta" />
            <inputsComponent:NameEntry />
            <inputsComponent:EmailEntry />
            <inputsComponent:PasswordEntry />
            <Button Text="Registrar" />
        </VerticalStackLayout>

        <!-- Grupo 2: Animacao de envio (visivel quando Sending) -->
        <animationComponent:AnimationSendInformationComponent
            IsVisible="False" />

    </VerticalStackLayout>
</ContentPage>
```

**Sobre os namespaces XAML:**
- `inputsComponent` — referencia componentes em `Components/Inputs/`
- `animationComponent` — referencia componentes em `Components/StatusPage/`
- O instrutor renomeou de `component` para `inputsComponent` para evitar conflito

## 5. Demonstracao do comportamento

O instrutor executa o app no emulador Motorola para mostrar:

**Sem controle de visibilidade:**
- Formulario aparece normalmente
- Animacao fica comprimida embaixo do formulario
- Ambos visiveis ao mesmo tempo (indesejado)

**Com IsVisible="False" no formulario:**
- Apenas a animacao aparece
- Formulario completamente oculto

**Proximo passo (proxima aula):**
- Binding condicional conectando `StatusPage` ao `IsVisible` de cada grupo
- Apenas um grupo visivel por vez, controlado automaticamente pelo enum