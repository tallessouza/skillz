---
name: rs-csharp-maui-android-entry-cursor
description: "Applies platform-specific Android customization for .NET MAUI Entry cursor and underline colors using handlers and compilation conditionals. Use when user asks to 'customize entry on Android', 'change cursor color MAUI', 'platform-specific handler', 'compilation conditional', or 'alter entry appearance per platform'. Make sure to use this skill whenever implementing platform-specific UI customizations in .NET MAUI. Not for iOS handlers, cross-platform styling without native code, or XAML-only theming."
---

# Customizacao de Entry no Android com Handlers MAUI

> Use condicionais de compilacao e handlers para mapear elementos MAUI a nativos Android, convertendo cores com ToPlatform().

## Rules

1. **Use condicionais de compilacao, nao if normal** — `#if ANDROID` / `#endif` garante que o codigo nem sera compilado para outras plataformas, porque reduz o tamanho do binario final e evita erros de referencia a APIs inexistentes
2. **Converta cores com ToPlatform()** — cores do .NET MAUI (Microsoft.Maui.Graphics.Color) nao funcionam em codigo nativo Android, porque Android espera Android.Graphics.Color
3. **Valide nulidade em cadeia antes de acessar propriedades nativas** — handler, PlatformView, TextCursorDrawable e Background podem ser nulos, porque acessar propriedade de objeto nulo gera NullReferenceException
4. **Defina versao minima do Android compativel com as APIs usadas** — TextCursorDrawable exige API Level 29+, porque versoes anteriores nao possuem essa propriedade
5. **Remova suporte a plataformas nao utilizadas** — se nao desenvolve para Tizen, remova do .csproj, porque simplifica o projeto

## How to write

### Condicional de compilacao

```csharp
#if ANDROID
    // Codigo compilado APENAS para Android
    // Identacao normal aqui dentro
#endif
```

### Handler com troca de cor do cursor e linha

```csharp
#if ANDROID
    if (handler is not null
        && handler.PlatformView is not null
        && handler.PlatformView.TextCursorDrawable is not null
        && handler.PlatformView.Background is not null)
    {
        handler.PlatformView.TextCursorDrawable.SetTint(cursorColor.ToPlatform());
        handler.PlatformView.Background.SetTint(lineColor.ToPlatform());
    }
#endif
```

### Ajuste de versao minima no .csproj

```xml
<SupportedOSPlatformVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'android'">29</SupportedOSPlatformVersion>
```

## Example

**Before (erro de tipo e sem null-check):**
```csharp
handler.PlatformView.TextCursorDrawable.SetTint(cursorColor);
handler.PlatformView.Background.SetTint(lineColor);
```

**After (com conversao e validacao):**
```csharp
#if ANDROID
    if (handler is not null
        && handler.PlatformView is not null
        && handler.PlatformView.TextCursorDrawable is not null
        && handler.PlatformView.Background is not null)
    {
        handler.PlatformView.TextCursorDrawable.SetTint(cursorColor.ToPlatform());
        handler.PlatformView.Background.SetTint(lineColor.ToPlatform());
    }
#endif
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Codigo usa API nativa de uma unica plataforma | Envolva com `#if PLATAFORMA` / `#endif` |
| Warning de disponibilidade de API aparece | Verifique API Level minimo e ajuste no .csproj |
| Cor MAUI precisa ir para codigo nativo | Use `.ToPlatform()` para converter |
| Warning de possivel null reference | Adicione verificacao `is not null` em cadeia |
| API disponivel apenas em API Level recente | Avalie se vale subir a versao minima do projeto |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `SetTint(mauiColor)` sem conversao | `SetTint(mauiColor.ToPlatform())` |
| Acessar `handler.PlatformView.X` sem null-check | Verificar toda a cadeia com `is not null` |
| Usar `if (runtime == "android")` para codigo nativo | Usar `#if ANDROID` condicional de compilacao |
| Manter API Level 21 quando usa API 29+ | Subir `SupportedOSPlatformVersion` para 29 |
| Manter `Tizen` no .csproj sem usar | Remover plataformas nao utilizadas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
