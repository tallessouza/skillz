# Code Examples: Customizacao de Entry no iOS com .NET MAUI

## Exemplo completo: Handler com Android + iOS

```csharp
Microsoft.Maui.Handlers.EntryHandler.Mapper.AppendToMapping("CustomEntry", (handler, view) =>
{
    var cursorColor = /* cor do cursor */;
    var lineColor = /* cor da linha */;

#if ANDROID
    // Android: TextCursorDrawable para cursor, Background para linha
    handler?.PlatformView?.TextCursorDrawable?.SetTint(cursorColor.ToPlatform());
    handler?.PlatformView?.Background?.SetTint(lineColor.ToPlatform());
#elif IOS || MACCATALYST
    // iOS/Mac: Layer para borda, TintColor para cursor
    handler?.PlatformView?.Layer.BorderColor = lineColor.ToCGColor();
    handler?.PlatformView?.Layer.BorderWidth = 1f;
    handler?.PlatformView?.Layer.CornerRadius = 7f;
    handler?.PlatformView?.TintColor = cursorColor.ToPlatform();
    handler?.PlatformView?.BackgroundColor = UIColor.Clear;
#endif
});
```

## Propriedades iOS passo a passo

### 1. Cor da borda (linha da entry)

```csharp
// Layer.BorderColor espera CGColor, NAO UIColor
handler?.PlatformView?.Layer.BorderColor = lineColor.ToCGColor();
```

### 2. Espessura da borda

```csharp
// Default e 0 — sem isso a borda nao aparece
handler?.PlatformView?.Layer.BorderWidth = 1f;

// Valores decimais tambem funcionam
handler?.PlatformView?.Layer.BorderWidth = 0.7f;
```

### 3. Arredondamento dos cantos

```csharp
// Default e 0 — entry fica quadrada sem isso
handler?.PlatformView?.Layer.CornerRadius = 7f;

// Ajuste conforme preferencia visual
handler?.PlatformView?.Layer.CornerRadius = 5f;
```

### 4. Cor do cursor

```csharp
// TintColor espera UIColor — ToPlatform() retorna UIColor
handler?.PlatformView?.TintColor = cursorColor.ToPlatform();
```

### 5. Background transparente (critico para Dark Mode)

```csharp
// UIColor.Clear = transparente no iOS
handler?.PlatformView?.BackgroundColor = UIColor.Clear;
```

## Evolucao do null-check

### Versao didatica (aula anterior)

```csharp
if (handler != null && handler.PlatformView != null)
{
    if (handler.PlatformView.TextCursorDrawable != null)
    {
        handler.PlatformView.TextCursorDrawable.SetTint(cursorColor.ToPlatform());
    }
    if (handler.PlatformView.Background != null)
    {
        handler.PlatformView.Background.SetTint(lineColor.ToPlatform());
    }
}
```

### Versao simplificada (esta aula)

```csharp
handler?.PlatformView?.TextCursorDrawable?.SetTint(cursorColor.ToPlatform());
handler?.PlatformView?.Background?.SetTint(lineColor.ToPlatform());
```

O `?.` encadeia verificacoes de nulidade: cada propriedade so e acessada se a anterior nao for nula.

## Diretivas de compilacao condicional

```csharp
// if simples
#if ANDROID
// codigo Android
#endif

// if com elif
#if ANDROID
// codigo Android
#elif IOS || MACCATALYST
// codigo iOS e Mac (mesmo codigo)
#endif

// if com elif e else
#if ANDROID
// codigo Android
#elif IOS
// codigo iOS
#else
// outras plataformas
#endif
```

## Tipos de conversao de cor

| Metodo | Retorna | Usar em |
|--------|---------|---------|
| `color.ToPlatform()` | `UIColor` (iOS) / `ColorStateList` (Android) | `TintColor`, `BackgroundColor` |
| `color.ToCGColor()` | `CGColor` | `Layer.BorderColor` |