---
name: rs-csharp-maui-iniciando-onboarding
description: "Applies .NET MAUI project structure and page setup patterns when creating new pages, configuring AppShell navigation, or organizing Views folders. Use when user asks to 'create a MAUI page', 'setup AppShell', 'add onboarding screen', 'organize MAUI project structure', or 'configure shell navigation'. Enforces Views/Pages folder hierarchy, namespace references in XAML, and navigation bar configuration. Make sure to use this skill whenever scaffolding new .NET MAUI pages or configuring AppShell. Not for API integration, data binding, or MVVM logic."
---

# Estrutura de Projeto e Navegacao com .NET MAUI

> Organize paginas em Views/Pages/{Feature}/, configure AppShell como controlador de navegacao, e remova elementos visuais desnecessarios desde o inicio.

## Rules

1. **Organize Views em hierarquia semantica** — `Views/Pages/{Feature}/` porque voce tera tambem modals e componentes compartilhados em Views, nao apenas paginas
2. **Use AppShell como controlador de navegacao** — transfira a responsabilidade de pagina inicial do App.xaml para AppShell.xaml, porque navegacao entre paginas e muito mais facil com Shell
3. **Nomeie arquivos com sufixo de tipo** — `OnboardPage.xaml` nao `Onboard.xaml`, porque o sufixo identifica imediatamente o que o arquivo representa
4. **Mantenha namespaces XAML sincronizados com pastas** — ao mover paginas para subpastas, atualize o `xmlns` no AppShell para refletir o novo namespace
5. **Remova a navbar quando o design nao exige** — use `Shell.NavBarIsVisible="False"` na pagina, porque barras de navegacao padrao ocupam espaco desnecessario
6. **Nunca remova xmlns obrigatorios** — os dois primeiros `xmlns` e `xmlns:x` sao obrigatorios no XAML, funcionam como usings do C#

## How to write

### Estrutura de pastas

```
ProjectName/
├── Views/
│   ├── Pages/
│   │   ├── Onboarding/
│   │   │   ├── OnboardPage.xaml
│   │   │   └── OnboardPage.xaml.cs
│   │   └── Dashboard/
│   │       ├── DashboardPage.xaml
│   │       └── DashboardPage.xaml.cs
│   ├── Modals/
│   └── Components/
├── App.xaml
├── AppShell.xaml
└── MauiProgram.cs
```

### AppShell.xaml com referencia de namespace

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<Shell
    x:Class="PlanShare.App.AppShell"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:onboarding="clr-namespace:PlanShare.App.Views.Pages.Onboarding">

    <ShellContent
        ContentTemplate="{DataTemplate onboarding:OnboardPage}"
        Shell.NavBarIsVisible="False" />

</Shell>
```

### Pagina basica (.xaml)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    x:Class="PlanShare.App.Views.Pages.Onboarding.OnboardPage"
    Shell.NavBarIsVisible="False">

    <VerticalStackLayout>
        <!-- Conteudo da pagina -->
    </VerticalStackLayout>

</ContentPage>
```

## Example

**Before (projeto padrao sem organizacao):**
```
ProjectName/
├── MainPage.xaml          ← pagina solta na raiz
├── App.xaml
├── AppShell.xaml           ← referencia local:MainPage
└── MauiProgram.cs
```

```xml
<!-- AppShell apontando para raiz -->
<ShellContent
    ContentTemplate="{DataTemplate local:MainPage}" />
```

**After (com esta skill aplicada):**
```
ProjectName/
├── Views/Pages/Onboarding/
│   ├── OnboardPage.xaml
│   └── OnboardPage.xaml.cs
├── App.xaml
├── AppShell.xaml
└── MauiProgram.cs
```

```xml
<!-- AppShell com namespace correto e navbar removida -->
<Shell xmlns:onboarding="clr-namespace:PlanShare.App.Views.Pages.Onboarding">
    <ShellContent
        ContentTemplate="{DataTemplate onboarding:OnboardPage}"
        Shell.NavBarIsVisible="False" />
</Shell>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Criando nova pagina | Crie em `Views/Pages/{Feature}/` com sufixo `Page` |
| Pagina nao precisa de navbar | Adicione `Shell.NavBarIsVisible="False"` na pagina |
| Multiplas paginas iniciais possiveis | Adicione multiplos `ShellContent` no AppShell, controle no code-behind |
| Moveu pagina de pasta | Atualize xmlns no AppShell E x:Class na pagina |
| Quer menu lateral (flyout) | Use `Shell.FlyoutBehavior` — consulte documentacao Microsoft |
| Alteracao simples no XAML | Use Hot Reload (Ctrl+S) sem reiniciar o app |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|--------------|
| Criar paginas soltas na raiz do projeto | `Views/Pages/{Feature}/NomePage.xaml` |
| `xmlns:local` apontando para raiz quando pagina esta em subpasta | `xmlns:feature="clr-namespace:Namespace.Correto"` |
| Remover `xmlns` ou `xmlns:x` do XAML | Mantenha sempre — sao obrigatorios |
| Deixar navbar visivel quando design nao tem | `Shell.NavBarIsVisible="False"` |
| Nomear arquivo `Onboard.xaml` sem sufixo | `OnboardPage.xaml` |
| Reiniciar app para cada alteracao XAML | Use Hot Reload com Ctrl+S |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
