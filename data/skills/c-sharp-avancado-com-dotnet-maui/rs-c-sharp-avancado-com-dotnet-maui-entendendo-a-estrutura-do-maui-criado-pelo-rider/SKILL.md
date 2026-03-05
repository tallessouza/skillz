---
name: rs-csharp-maui-estrutura-rider
description: "Applies .NET MAUI project structure normalization when migrating from Rider to Visual Studio template format. Use when user asks to 'create MAUI project', 'clean MAUI template', 'normalize Rider project', 'simplify MAUI structure', or 'remove unused MAUI dependencies'. Guides removal of extra Rider template files, NuGet cleanup, GlobalUsings approach, and AppShell configuration. Make sure to use this skill whenever setting up or cleaning a .NET MAUI project structure. Not for MAUI UI development, XAML layouts, or platform-specific native code."
---

# Estrutura do Projeto .NET MAUI — Rider vs Visual Studio

> Ao iniciar um projeto .NET MAUI, normalize a estrutura para o template minimo do Visual Studio, removendo extras do Rider, porque uma base limpa evita confusao durante a trilha de aprendizado.

## Rules

1. **Template do Rider tem mais conteudo que o do Visual Studio** — o projeto e identico em ambas IDEs, a diferenca esta apenas no Hello World inicial (Rider inclui graficos, paginas extras, servicos de exemplo)
2. **Remova injecao de dependencia do MauiProgram ate o momento correto** — delete singletons/transients do template porque serao ensinados no momento adequado da trilha
3. **Evite GlobalUsings** — prefira declarar `using` em cada classe individualmente, porque facilita localizar a origem de cada tipo pelo namespace (`PlanShare.App.Pages`) em vez de procurar num arquivo global
4. **Mantenha apenas NuGet packages essenciais** — no template base so precisa de `Microsoft.Maui.Controls` e `CommunityToolkit.Maui` (quando necessario), remova SyncFusion (pago), SQLite, e outros que o Rider adiciona
5. **Delete a pasta Tizen** — o sistema operacional Samsung nao sera utilizado, mantenha apenas Android, iOS, Mac e Windows
6. **AppShell deve ter apenas um ShellContent apontando para MainPage** — remova navegacoes extras, tabs e flyout items do template Rider

## Steps

### Step 1: Limpar MauiProgram.cs

Remova todas as injecoes de dependencia e deixe apenas o builder basico:

```csharp
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        return builder.Build();
    }
}
```

### Step 2: Deletar GlobalUsings.cs

Remova o arquivo `GlobalUsings.cs` inteiro. Declare `using` diretamente em cada classe.

### Step 3: Remover pastas e arquivos extras

| Deletar | Motivo |
|---------|--------|
| `Pages/` (conteudo do Rider) | Sera recriado do zero |
| `PageModels/` (ViewModels) | Sera ensinado depois |
| `Models/` | Sera criado quando necessario |
| `Data/` (repositorios) | App vai chamar API, nao tera repositorio local |
| `Services/` (IErrorHandler, etc) | Sera implementado no momento correto |
| `Properties/launchSettings.json` | Nao necessario no MAUI |
| `Platforms/Tizen/` | Samsung OS nao utilizado |
| Imagens extras em `Resources/Images/` | Manter pasta vazia |
| `Resources/Styles/AppStyles.xaml` (extra) | Manter apenas `Colors.xaml` e `Styles.xaml` padrao |

### Step 4: Desinstalar NuGet packages extras

Botao direito no projeto > Manage NuGet Packages > remover:

| Package | Motivo da remocao |
|---------|-------------------|
| CommunityToolkit (se presente) | Sera instalado quando necessario |
| SyncFusion.* | Biblioteca paga, nao utilizada |
| SQLite | Nao sera usado repositorio local |
| Qualquer outro alem do basico | Conferir `.csproj` contra template VS |

### Step 5: Criar MainPage.xaml

Crie uma ContentPage na raiz do projeto com nome `MainPage`:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.App.MainPage">

    <ScrollView>
        <VerticalStackLayout Padding="30,0" Spacing="25">
            <Label Text="Hello, World!"
                   SemanticProperties.HeadingLevel="Level1"
                   FontSize="32"
                   HorizontalOptions="Center" />
        </VerticalStackLayout>
    </ScrollView>

</ContentPage>
```

### Step 6: Configurar AppShell.xaml

```xml
<?xml version="1.0" encoding="utf-8" ?>
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       xmlns:local="clr-namespace:PlanShare.App"
       x:Class="PlanShare.App.AppShell"
       FlyoutBehavior="Disabled">

    <ShellContent
        Title="Home"
        ContentTemplate="{DataTemplate local:MainPage}"
        Route="MainPage" />

</Shell>
```

### Step 7: Rebuild e verificar

Faca Rebuild (Build Actions > Rebuild). Erros esperados e aceitaveis:
- SDK Android nao encontrado no Mac — ignorar se nao usa Android
- Referencias a pacotes removidos — corrigir `using` restantes

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto criado no Rider | Executar todos os steps acima |
| Projeto criado no Visual Studio | Ja esta no formato minimo, pular |
| Erro de `using` apos limpeza | Remover o `using` orfao da classe |
| `xmlns:local` no AppShell | Apontar para namespace raiz do projeto (`clr-namespace:NomeProjeto`) |
| Duvida se package e necessario | Conferir `.csproj` do template VS como referencia |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Manter template completo do Rider e ir removendo "depois" | Limpar tudo de uma vez antes de comecar a desenvolver |
| Usar `GlobalUsings.cs` sem entender | Declarar `using` explicitamente em cada classe |
| Instalar SyncFusion sem verificar licenca | Verificar se e pago antes de adicionar |
| Deixar pasta Tizen no projeto | Deletar — nao sera usado |
| Copiar codigo entre projetos sem conferir namespace | Verificar que namespace e nome de classe batem antes do Ctrl+V |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
