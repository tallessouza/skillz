---
name: rs-csharp-maui-lottie-animation-component
description: "Generates reusable .NET MAUI animation components using SkiaSharp and Lottie files. Use when user asks to 'add animation', 'create loading component', 'show lottie animation', 'add SKLottieView', or 'create reusable MAUI component'. Applies correct SKLottieView configuration with infinite loop, centering, and source binding. Make sure to use this skill whenever creating animation components in .NET MAUI projects. Not for static images, SVG rendering, or non-MAUI Xamarin projects."
---

# Componente de Animacao Lottie no .NET MAUI

> Crie componentes reutilizaveis de animacao usando SKLottieView do SkiaSharp, sempre como ContentView separada para compartilhar entre paginas.

## Rules

1. **Sempre crie um componente separado** — nunca coloque SKLottieView direto na pagina, porque componentes permitem reutilizacao em multiplas paginas
2. **Organize em pasta dedicada** — crie dentro de `Views/Components/StatusPage/` ou pasta equivalente por contexto, porque facilita localizacao e agrupamento logico
3. **Importe o namespace correto do SkiaSharp** — use `xmlns:skiasharp="clr-namespace:SkiaSharp.Extended.UI.Controls;assembly=SkiaSharp.Extended.UI"`, porque sem esse namespace o SKLottieView nao sera reconhecido
4. **Use RepeatCount=-1 para loop infinito** — nunca use um numero fixo para animacoes de loading/status, porque voce nao sabe quanto tempo a operacao vai demorar
5. **Sempre defina HeightRequest e WidthRequest** — sem dimensoes explicitas a view nao renderiza, porque SKLottieView exige tamanho definido
6. **Source recebe apenas o nome do arquivo** — `airplane.json` e nao `Resources/Raw/airplane.json`, porque o MAUI resolve automaticamente arquivos da pasta Raw

## How to write

### Componente de animacao reutilizavel

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:skiasharp="clr-namespace:SkiaSharp.Extended.UI.Controls;assembly=SkiaSharp.Extended.UI"
             x:Class="MyApp.Views.Components.StatusPage.AnimationSendInformationComponent">

    <skiasharp:SKLottieView
        Source="airplane.json"
        VerticalOptions="Center"
        HorizontalOptions="Center"
        RepeatCount="-1"
        HeightRequest="300"
        WidthRequest="300" />

</ContentView>
```

### Estrutura de pastas

```
Views/
└── Components/
    └── StatusPage/
        ├── AnimationSendInformationComponent.xaml
        └── AnimationSendInformationComponent.xaml.cs
```

## Example

**Before (animacao direto na pagina — errado):**
```xml
<!-- RegisterAccountPage.xaml -->
<ContentPage>
    <StackLayout>
        <!-- outros elementos -->
        <skiasharp:SKLottieView Source="airplane.json" RepeatCount="7" />
    </StackLayout>
</ContentPage>
```

**After (componente reutilizavel — correto):**
```xml
<!-- AnimationSendInformationComponent.xaml -->
<ContentView xmlns:skiasharp="clr-namespace:SkiaSharp.Extended.UI.Controls;assembly=SkiaSharp.Extended.UI">
    <skiasharp:SKLottieView
        Source="airplane.json"
        VerticalOptions="Center"
        HorizontalOptions="Center"
        RepeatCount="-1"
        HeightRequest="300"
        WidthRequest="300" />
</ContentView>

<!-- RegisterAccountPage.xaml (uso) -->
<ContentPage xmlns:components="clr-namespace:MyApp.Views.Components.StatusPage">
    <components:AnimationSendInformationComponent />
</ContentPage>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Animacao de loading/envio | RepeatCount="-1" (loop infinito) |
| Animacao one-shot (sucesso/erro) | RepeatCount="1" |
| Dimensoes da animacao | Comece com 300x300, ajuste ao ver no dispositivo |
| Arquivo Lottie (.json) | Coloque em Resources/Raw/, referencie so pelo nome |
| Mesmo componente em varias paginas | Crie ContentView separado em Components/ |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Colocar SKLottieView direto na pagina | Criar ContentView componente reutilizavel |
| `RepeatCount="7"` para loading | `RepeatCount="-1"` para loop infinito |
| `Source="Resources/Raw/airplane.json"` | `Source="airplane.json"` |
| Omitir HeightRequest/WidthRequest | Sempre definir ambos (ex: 300) |
| Usar VerticalStackLayout dentro do componente | Usar SKLottieView direto no ContentView |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
