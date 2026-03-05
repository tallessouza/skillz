---
name: rs-csharp-maui-estrutura-projeto
description: "Applies .NET MAUI project structure conventions when creating, organizing, or reviewing MAUI apps. Use when user asks to 'create a MAUI project', 'organize MAUI files', 'setup .NET MAUI app', 'structure a mobile project', or 'understand MAUI folders'. Enforces correct file placement, AppShell navigation, MauiProgram configuration, and platform-specific code organization. Make sure to use this skill whenever scaffolding or reviewing .NET MAUI project structure. Not for Blazor, WPF, WinForms, or web API projects."
---

# Estrutura de Projeto .NET MAUI

> Organize cada arquivo e pasta do projeto MAUI pela sua responsabilidade: configuracao, navegacao, estilos, recursos e codigo de plataforma.

## Rules

1. **MauiProgram.cs e o ponto de entrada** — equivalente ao Program.cs de uma API; configure fontes, injecao de dependencia e servicos aqui, porque e a primeira classe executada ao iniciar o app
2. **Use AppShell para navegacao** — nunca defina `MainPage = new MinhaPage()` diretamente no App.xaml.cs, porque AppShell oferece navegacao mais limpa, performatica e extensivel
3. **Cada arquivo XAML tem seu Code Behind** — o .xaml.cs e o codigo C# vinculado ao .xaml; ao renomear a classe, atualize o `x:Class` no XAML tambem, porque senao o projeto nao compila
4. **App.xaml e para configuracao global** — estilos, cores, fontes e recursos compartilhados ficam aqui, porque garante padronizacao visual em todo o app
5. **Respeite a estrutura de Resources/** — `AppIcon/` para icone, `Fonts/` para fontes TTF, `Images/` para imagens, `Raw/` para videos/animacoes, `Splash/` para tela de carregamento, `Styles/` para estilos
6. **Codigo de plataforma vai em Platforms/** — Android, iOS, MacCatalyst e Windows tem pastas proprias; delete `Tizen/` se nao for usar Samsung
7. **Instale XAML Styler** — no Visual Studio use a extensao XAML Styler para formatar XAML automaticamente no Ctrl+S

## Estrutura do Projeto

```
PlanShare.App/
├── MauiProgram.cs           # Ponto de entrada — config DI, fontes
├── App.xaml                 # Recursos globais (estilos, cores)
│   └── App.xaml.cs          # Code behind — cria janela via AppShell
├── AppShell.xaml            # Navegacao — define paginas e rotas
│   └── AppShell.xaml.cs     # Code behind da navegacao
├── MainPage.xaml            # Pagina inicial (template, substituir)
│   └── MainPage.xaml.cs     # Code behind da pagina
├── Platforms/
│   ├── Android/             # Codigo especifico Android
│   ├── iOS/                 # Codigo especifico iOS
│   ├── MacCatalyst/         # Codigo especifico Mac
│   └── Windows/             # Codigo especifico Windows
├── Resources/
│   ├── AppIcon/             # Icone do app
│   ├── Fonts/               # Arquivos .ttf
│   ├── Images/              # Imagens PNG/SVG
│   ├── Raw/                 # Videos, animacoes, outros
│   ├── Splash/              # Tela de carregamento
│   └── Styles/              # Colors.xaml, Styles.xaml
└── PlanShare.App.csproj     # Config do projeto
```

## How to write

### MauiProgram.cs (ponto de entrada)

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
                fonts.AddFont("MinhaFonte-Regular.ttf", "MinhaFonteRegular");
            });

        // Injecao de dependencia
        builder.Services.AddSingleton<IMinhaService, MinhaService>();

        return builder.Build();
    }
}
```

### App.xaml.cs (criacao de janela com AppShell)

```csharp
public partial class App : Application
{
    public App()
    {
        InitializeComponent();
    }

    // Forma moderna (nao use MainPage = new ..., que e obsoleto)
    protected override Window CreateWindow(IActivationState? activationState)
    {
        return new Window(new AppShell());
    }
}
```

### AppShell.xaml (navegacao)

```xml
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       xmlns:local="clr-namespace:PlanShare.App"
       x:Class="PlanShare.App.AppShell">

    <ShellContent ContentTemplate="{DataTemplate local:MainPage}"
                  Route="MainPage"
                  Title="Home" />
</Shell>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeira vez do usuario no app | Direcione para tela de onboarding via AppShell |
| Usuario ja logado com token valido | Direcione para dashboard via AppShell |
| Precisa de codigo so para Android | Coloque em `Platforms/Android/` |
| Arquivo nao e imagem nem fonte | Coloque em `Resources/Raw/` |
| Quer padronizar botoes e textos | Crie estilos em `Resources/Styles/` e importe no `App.xaml` |
| Template veio do Rider (diferente do VS) | Limpe o excesso e alinhe com a estrutura padrao |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `MainPage = new MainPage()` no App.xaml.cs | `CreateWindow` retornando `new Window(new AppShell())` |
| Renomear classe sem atualizar `x:Class` no XAML | Sempre sincronize nome da classe e `x:Class` |
| Colocar imagens em `Raw/` | Imagens vao em `Resources/Images/` |
| Manter pasta `Tizen/` sem uso | Delete `Platforms/Tizen/` |
| Estilos inline em cada pagina | Centralize em `Resources/Styles/` |
| Navegacao manual sem AppShell | Use AppShell para rotas limpas e performaticas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
