# Code Examples: Customizacao de Entry no Android com Handlers MAUI

## Exemplo completo do handler com condicional de compilacao

```csharp
#if ANDROID
    if (handler is not null
        && handler.PlatformView is not null
        && handler.PlatformView.TextCursorDrawable is not null
        && handler.PlatformView.Background is not null)
    {
        // Altera cor do cursor — ToPlatform() converte Color do MAUI para Android.Graphics.Color
        handler.PlatformView.TextCursorDrawable.SetTint(cursorColor.ToPlatform());

        // Altera cor da linha (background/underline da Entry)
        handler.PlatformView.Background.SetTint(lineColor.ToPlatform());
    }
#endif
```

## Erro comum: passar cor MAUI sem conversao

```csharp
// ERRO DE COMPILACAO — tipos incompativeis
handler.PlatformView.TextCursorDrawable.SetTint(cursorColor);
// cursorColor e Microsoft.Maui.Graphics.Color
// SetTint espera Android.Graphics.Color
```

## Correcao com ToPlatform()

```csharp
// CORRETO — ToPlatform() retorna Android.Graphics.Color
handler.PlatformView.TextCursorDrawable.SetTint(cursorColor.ToPlatform());
```

## Ajuste no .csproj — SupportedOSPlatformVersion

### Antes (padrao):
```xml
<SupportedOSPlatformVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'android'">21</SupportedOSPlatformVersion>
<SupportedOSPlatformVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'ios'">15</SupportedOSPlatformVersion>
<SupportedOSPlatformVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'maccatalyst'">15</SupportedOSPlatformVersion>
<SupportedOSPlatformVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'tizen'">6.5</SupportedOSPlatformVersion>
```

### Depois (ajustado):
```xml
<SupportedOSPlatformVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'android'">29</SupportedOSPlatformVersion>
<SupportedOSPlatformVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'ios'">15</SupportedOSPlatformVersion>
<SupportedOSPlatformVersion Condition="$([MSBuild]::GetTargetPlatformIdentifier('$(TargetFramework)')) == 'maccatalyst'">15</SupportedOSPlatformVersion>
<!-- Tizen removido — nao utilizado -->
```

## Opcoes disponiveis no autocomplete do #if

O Visual Studio oferece diversas opcoes ao digitar `#if`:
- `ANDROID` — qualquer versao Android
- `ANDROID22_0_OR_GREATER` — API 22+
- `ANDROID25_0_OR_GREATER` — API 25+
- `ANDROID29_0_OR_GREATER` — API 29+
- `IOS`
- `MACCATALYST`
- `WINDOWS`
- `DEBUG`
- `.NET`

Para o caso de customizacao de Entry, `ANDROID` e suficiente quando a versao minima no .csproj ja esta em 29.

## Tabela de referencia — API Levels mencionados

| API Level | Versao Android | Nome | Lancamento | Ultima atualizacao seguranca |
|-----------|---------------|------|------------|------------------------------|
| 21 | 5.0 | Lollipop | Nov 2014 | Nov 2017 |
| 29 | 10 | Q | Set 2019 | 2023 |

## Cores no exemplo da aula (arquivo Colors)

```xml
<!-- Light Mode -->
<Color x:Key="PrimaryColor">#000000</Color>        <!-- cursor preto -->
<Color x:Key="LineColor">#CCCCCC</Color>            <!-- linha cinza claro -->

<!-- Dark Mode -->
<Color x:Key="PrimaryColorDark">#FFFFFF</Color>     <!-- cursor branco -->
<Color x:Key="LineColorDark">#80FFFFFF</Color>       <!-- linha branca com transparencia -->
```