---
name: rs-csharp-maui-status-page
description: "Applies page status pattern using enums in .NET MAUI ViewModels to control UI element visibility during async operations. Use when user asks to 'add loading state', 'show spinner while sending', 'toggle UI visibility', 'control page elements during API call', or 'implement status enum in MAUI'. Make sure to use this skill whenever building .NET MAUI pages that need to swap visible content based on application state. Not for navigation between pages, data binding basics, or animation implementation."
---

# Status Page Pattern no .NET MAUI

> Controle a visibilidade de grupos de elementos na pagina usando um enum de status na ViewModel base, porque isso evita poluicao visual e permite mostrar feedback (animacoes) durante operacoes assincronas.

## Rules

1. **Defina o status como enum em Models/** — crie `StatusPage` com valores explicitos (`Default = 0`, `Sending = 1`), porque controle explicito dos valores evita bugs quando novos status forem adicionados
2. **Coloque a propriedade na ViewModel base** — declare `StatusPage` na `ViewModelBase` com `[ObservableProperty]`, porque login, registro e outras paginas precisam do mesmo comportamento
3. **Marque a ViewModelBase como partial** — o CommunityToolkit reescreve a classe para gerar notificacao automatica, sem `partial` o atributo `[ObservableProperty]` nao funciona
4. **Garanta default no construtor** — inicialize `StatusPage = StatusPage.Default` no construtor da ViewModelBase, porque toda pagina deve comecar mostrando seu conteudo principal
5. **Agrupe elementos em layouts para controlar visibilidade** — use `IsVisible` no `VerticalStackLayout` pai, nao em cada elemento individual, porque um unico binding controla todo o grupo
6. **ContentPage aceita apenas um elemento raiz** — envolva multiplos grupos (formulario + animacao) em um VerticalStackLayout externo

## How to write

### Enum de status

```csharp
// Models/StatusPage.cs
namespace PlanShare.App.Models;

public enum StatusPage
{
    Default = 0,
    Sending = 1
}
```

### Propriedade na ViewModelBase

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

### Uso na ViewModel filha

```csharp
// Antes da chamada API
StatusPage = StatusPage.Sending;

await _registerAccountUseCase.Execute(request);

// Depois da chamada API
StatusPage = StatusPage.Default;
```

### Estrutura XAML com agrupamento

```xml
<ContentPage>
    <VerticalStackLayout>

        <!-- Grupo: formulario (visivel quando Default) -->
        <VerticalStackLayout IsVisible="False">
            <!-- Labels, Entries, Buttons -->
        </VerticalStackLayout>

        <!-- Grupo: animacao (visivel quando Sending) -->
        <animationComponent:AnimationSendInformationComponent
            IsVisible="False" />

    </VerticalStackLayout>
</ContentPage>
```

## Example

**Before (sem status, tudo sempre visivel):**
```csharp
// ViewModel dispara request sem feedback visual
await _useCase.Execute(request);
```

**After (com status controlando visibilidade):**
```csharp
StatusPage = StatusPage.Sending;   // esconde form, mostra animacao
await _useCase.Execute(request);
StatusPage = StatusPage.Default;   // volta ao estado original
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Propriedade usada em multiplas ViewModels | Declare na ViewModelBase |
| Precisa esconder varios elementos de uma vez | Agrupe num layout e use IsVisible no layout pai |
| ContentPage precisa de dois grupos alternados | Envolva ambos num VerticalStackLayout raiz |
| Novo status necessario (ex: erro, sucesso) | Adicione valor ao enum com indice explicito |
| Componente XAML conflita com namespace existente | Renomeie o xmlns (ex: `inputsComponent`, `animationComponent`) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `IsVisible="False"` em cada elemento individual | `IsVisible` no layout pai que agrupa os elementos |
| Declarar `StatusPage` em cada ViewModel | Declarar uma vez na `ViewModelBase` |
| Enum sem valores explicitos (`Default, Sending`) | `Default = 0, Sending = 1` |
| Esquecer `partial` na ViewModelBase | Sempre marcar como `partial class` |
| Dois layouts raiz dentro de ContentPage | Um VerticalStackLayout raiz contendo os grupos |
| Navegar para outra pagina para mostrar loading | Alternar visibilidade na mesma pagina |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
