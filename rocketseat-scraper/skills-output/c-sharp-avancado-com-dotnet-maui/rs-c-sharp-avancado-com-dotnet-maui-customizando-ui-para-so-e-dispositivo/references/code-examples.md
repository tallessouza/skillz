# Code Examples: Customizando UI para SO e Dispositivo

## 1. Removendo titulo da NavigationBar no AppShell

**Antes (com titulo "Home" aparecendo):**
```xml
<!-- AppShell.xaml -->
<ShellContent
    Title="Home"
    ContentTemplate="{DataTemplate local:MainPage}"
    Route="MainPage" />
```

**Depois (sem titulo):**
```xml
<ShellContent
    ContentTemplate="{DataTemplate local:MainPage}"
    Route="MainPage" />
```

## 2. OnPlatform inline para Margin

**Sintaxe compacta (recomendada para casos simples):**
```xml
<Label
    Text="Nome"
    Style="{StaticResource TitleForEntryStyle}"
    Margin="{OnPlatform Android='4,0,0,0', iOS='0,0,0,4'}" />
```

**Formato do Thickness:** `esquerda, cima, direita, baixo`

## 3. OnPlatform expandido (sintaxe verbosa)

```xml
<Label Text="Nome" Style="{StaticResource TitleForEntryStyle}">
    <Label.Margin>
        <OnPlatform x:TypeArguments="Thickness">
            <On Platform="Android" Value="4,0,0,0" />
            <On Platform="iOS" Value="0,0,0,4" />
            <On Platform="WinUI" Value="0" />
        </OnPlatform>
    </Label.Margin>
</Label>
```

## 4. OnPlatform para Text

```xml
<Label Text="{OnPlatform Android='Login do Android', iOS='Login do iPhone'}" />
```

Funciona para qualquer propriedade do tipo string: `Text`, `Placeholder`, `Title`, etc.

## 5. OnPlatform para cores e fontes

```xml
<Label
    Text="Exemplo"
    TextColor="{OnPlatform Android='#333333', iOS='#222222'}"
    FontFamily="{OnPlatform Android='MainFontLight', iOS='MainFontRegular'}"
    FontSize="{OnPlatform Android=16, iOS=14}" />
```

## 6. OnIdiom para tipo de dispositivo

```xml
<Label
    Text="Titulo"
    FontSize="{OnIdiom Phone=14, Tablet=18, Desktop=16}" />
```

**Opcoes disponiveis para OnIdiom:**
- `Phone` — telefone
- `Tablet` — tablet
- `Desktop` — computador (Windows, Mac)
- `TV` — televisao
- `Watch` — relogio

## 7. Configuracao de fonte customizada

**Passo 1: Adicionar arquivo .ttf em Resources/Fonts/**
```
Resources/
  Fonts/
    Raleway-Light.ttf    ← adicionar
    Raleway-Thin.ttf     ← remover (se nao mais usado)
```

**Passo 2: Registrar no MauiProgram.cs**
```csharp
builder
    .UseMauiApp<App>()
    .ConfigureFonts(fonts =>
    {
        fonts.AddFont("Raleway-Light.ttf", "MainFontLight");
        // Removido: fonts.AddFont("Raleway-Thin.ttf", "MainFontThin");
    });
```

**Passo 3: Usar no estilo (LabelStyle.xaml ou equivalente)**
```xml
<Style x:Key="TitleForEntryStyle" TargetType="Label">
    <Setter Property="FontFamily" Value="MainFontLight" />
    <Setter Property="FontSize" Value="11" />
</Style>
```

## 8. Combinando OnPlatform e OnIdiom

```xml
<!-- Margem diferente por SO E por dispositivo -->
<Label Text="Campo">
    <Label.Margin>
        <OnPlatform x:TypeArguments="Thickness">
            <On Platform="Android">
                <OnIdiom x:TypeArguments="Thickness"
                    Phone="4,0,0,0"
                    Tablet="8,0,0,0" />
            </On>
            <On Platform="iOS">
                <OnIdiom x:TypeArguments="Thickness"
                    Phone="0,0,0,4"
                    Tablet="0,0,0,8" />
            </On>
        </OnPlatform>
    </Label.Margin>
</Label>
```

## 9. Plataformas disponiveis para OnPlatform

| Valor | SO |
|-------|-----|
| `Android` | Android |
| `iOS` | iPhone, iPad |
| `WinUI` | Windows |
| `MacCatalyst` | macOS |
| `Tizen` | Samsung Tizen |