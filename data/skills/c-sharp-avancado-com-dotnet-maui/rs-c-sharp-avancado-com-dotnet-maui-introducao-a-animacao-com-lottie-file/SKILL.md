---
name: rs-csharp-maui-lottie-animation
description: "Applies Lottie animation patterns in .NET MAUI apps for loading feedback and UX communication. Use when user asks to 'add loading animation', 'show processing indicator', 'integrate Lottie', 'add feedback while waiting API response', or 'improve UX during async calls'. Ensures proper SkiaSharp setup, asset placement in Resources/Raw, and MauiProgram configuration. Make sure to use this skill whenever implementing loading states or async feedback in MAUI apps. Not for CSS animations, web-only animations, or static image handling."
---

# Animacoes Lottie no .NET MAUI

> Utilize animacoes Lottie para comunicar visualmente ao usuario que um processamento esta acontecendo, evitando cliques repetidos e confusao.

## Rules

1. **Instale o pacote SkiaSharp.Extended.UI.Maui** — `dotnet add package SkiaSharp.Extended.UI.Maui --version 2.0.0`, porque e a biblioteca que renderiza Lottie no MAUI
2. **Registre UseSkiaSharp() no MauiProgram.cs** — sem isso o runtime nao reconhece os controles Lottie e a animacao nao aparece
3. **Coloque arquivos .json na pasta Resources/Raw/** — porque e o diretorio padrao de raw assets no MAUI, e o build action MauiAsset e aplicado automaticamente
4. **Esconda elementos da tela durante o loading** — mostre apenas a animacao, porque impede o usuario de alterar dados ou clicar em outros botoes durante o processamento
5. **Use animacoes gratuitas do LottieFiles.com** — filtre por "Free" no site para evitar assets premium que exigem licenca paga
6. **Prefira Lottie JSON sobre GIF/video** — porque Lottie e vetorial (escalavel sem perda de qualidade), leve, interativo via codigo, e multiplataforma

## How to write

### Instalacao e configuracao

```csharp
// MauiProgram.cs — registrar SkiaSharp
using SkiaSharp.Views.Maui.Controls.Hosting;

public static MauiApp CreateMauiApp()
{
    var builder = MauiApp.CreateBuilder();
    builder
        .UseMauiApp<App>()
        .UseSkiaSharp(); // Obrigatorio para Lottie funcionar

    return builder.Build();
}
```

### Estrutura de pastas para o asset

```
Projeto/
└── Resources/
    └── Raw/
        └── airplane.json    ← arquivo Lottie baixado do LottieFiles.com
```

### Controle de visibilidade durante loading

```xml
<!-- XAML: esconder form, mostrar animacao -->
<StackLayout IsVisible="{Binding IsNotLoading}">
    <!-- Entry, Label, Button do formulario -->
</StackLayout>

<skia:SKLottieView
    Source="airplane.json"
    RepeatCount="-1"
    IsVisible="{Binding IsLoading}"
    HeightRequest="200"
    WidthRequest="200" />
```

## Example

**Before (sem feedback visual):**
```csharp
// Usuario clica no botao, nada acontece visualmente
async void OnRegisterClicked(object sender, EventArgs e)
{
    await _apiService.RegisterUser(user);
    await Navigation.PushAsync(new DashboardPage());
}
// Problema: usuario clica varias vezes, dispara N requests, cria dados duplicados
```

**After (com animacao Lottie):**
```csharp
async void OnRegisterClicked(object sender, EventArgs e)
{
    IsLoading = true;  // Esconde form, mostra animacao Lottie

    try
    {
        await _apiService.RegisterUser(user);
        await Navigation.PushAsync(new DashboardPage());
    }
    catch (Exception ex)
    {
        await DisplayAlert("Erro", ex.Message, "OK");
    }
    finally
    {
        IsLoading = false;  // Volta elementos visuais
    }
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Chamada API que pode demorar | Esconder elementos + mostrar animacao Lottie em loop |
| Sucesso na resposta | Navegar para proxima tela ou exibir mensagem de sucesso |
| Erro na resposta | Exibir causa do erro + restaurar elementos visuais |
| Tela com botao de acao (login, registro, criar tarefa) | Sempre implementar feedback visual |
| Animacao precisa de cores customizadas | Editar no Lottie Editor antes de baixar o JSON |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Deixar botao clicavel durante request | Esconder elementos ou desabilitar botao + mostrar animacao |
| Usar GIF pesado para loading | Usar Lottie JSON (vetorial, leve, escalavel) |
| Esquecer `UseSkiaSharp()` no MauiProgram | Sempre registrar na configuracao do builder |
| Colocar .json fora de Resources/Raw/ | Sempre usar Resources/Raw/ para raw assets |
| Mostrar checkmark na animacao de loading | Separar animacao de loading da confirmacao de sucesso |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
