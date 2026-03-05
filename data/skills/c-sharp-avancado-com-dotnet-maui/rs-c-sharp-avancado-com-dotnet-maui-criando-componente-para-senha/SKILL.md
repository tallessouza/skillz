---
name: rs-csharp-maui-password-component
description: "Applies .NET MAUI password entry component pattern with show/hide toggle when building login, registration, or password change screens. Use when user asks to 'create password field', 'add password input', 'show hide password', 'toggle password visibility', or 'build login form' in .NET MAUI. Implements Grid layout for entry+icon alignment, TapGestureRecognizer for toggle, and IsPassword property switching. Make sure to use this skill whenever creating password inputs in MAUI apps. Not for web password fields, React Native, or Flutter password components."
---

# Componente de Senha no .NET MAUI

> Crie componentes de senha reutilizaveis com toggle de visibilidade usando Grid layout, nao HorizontalStackLayout.

## Rules

1. **Use Grid, nunca HorizontalStackLayout** — HorizontalStackLayout comprime a Entry para o tamanho minimo do placeholder, porque ele tenta ocupar o menor espaco possivel. Grid com `ColumnDefinitions="*, 40"` faz a Entry expandir corretamente
2. **Componente separado para senha** — mantenha o password entry como ContentView proprio (`EntryAndLabelPasswordComponents`), porque a logica de toggle e as duas imagens tornam o componente diferente o suficiente de um entry comum
3. **IsPassword=true como default** — a Entry comeca escondendo caracteres, porque e o comportamento esperado pelo usuario ao abrir a tela
4. **Placeholder com instrucoes de validacao** — coloque regras da senha no placeholder (ex: "Minimo de 6 caracteres"), porque orienta o usuario sem ocupar espaco extra na UI
5. **Use TapGestureRecognizer em VerticalStackLayout wrapper** — envolva a imagem em um VerticalStackLayout com Padding="0,12,0,12" para aumentar a area de toque, porque o dedo do usuario precisa de espaco maior que os 21px da imagem
6. **Duas imagens SVG para os estados** — `icon_eye.png` (senha visivel) e `icon_eye_hiding.png` (senha escondida), porque trocar o Source da Image no code-behind e mais simples que animacoes

## How to write

### Grid com duas colunas (Entry + Icone)

```xml
<Grid ColumnDefinitions="*, 40">
    <Entry
        Grid.Column="0"
        x:Name="EntryPassword"
        IsPassword="True"
        Placeholder="Minimo de 6 caracteres" />

    <VerticalStackLayout
        Grid.Column="1"
        Padding="0,12,0,12">
        <VerticalStackLayout.GestureRecognizers>
            <TapGestureRecognizer Tapped="ShowHidePassword" />
        </VerticalStackLayout.GestureRecognizers>
        <Image
            x:Name="ImageEye"
            Source="icon_eye_hiding.png" />
    </VerticalStackLayout>
</Grid>
```

### Logica de toggle no code-behind

```csharp
private void ShowHidePassword(object sender, EventArgs e)
{
    if (EntryPassword.IsPassword)
    {
        EntryPassword.IsPassword = false;
        ImageEye.Source = "icon_eye.png";
    }
    else
    {
        EntryPassword.IsPassword = true;
        ImageEye.Source = "icon_eye_hiding.png";
    }
}
```

### BindableProperty para titulo reutilizavel

```csharp
public static readonly BindableProperty TitleProperty =
    BindableProperty.Create(
        nameof(Title),
        typeof(string),
        typeof(EntryAndLabelPasswordComponents),  // classe CORRETA
        string.Empty);
```

## Example

**Before (HorizontalStackLayout — errado):**
```xml
<HorizontalStackLayout>
    <Entry Placeholder="Senha" IsPassword="True" />
    <Image Source="icon_eye.png" />
</HorizontalStackLayout>
<!-- Entry comprimida para o tamanho do placeholder -->
```

**After (Grid — correto):**
```xml
<VerticalStackLayout>
    <Label Text="{Binding Source={x:Reference this}, Path=Title}" />
    <Grid ColumnDefinitions="*, 40">
        <Entry Grid.Column="0" x:Name="EntryPassword"
               IsPassword="True" Placeholder="Minimo de 6 caracteres" />
        <VerticalStackLayout Grid.Column="1" Padding="0,12,0,12">
            <VerticalStackLayout.GestureRecognizers>
                <TapGestureRecognizer Tapped="ShowHidePassword" />
            </VerticalStackLayout.GestureRecognizers>
            <Image x:Name="ImageEye" Source="icon_eye_hiding.png" />
        </VerticalStackLayout>
    </Grid>
</VerticalStackLayout>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Entry precisa expandir ao lado de icone | Grid com `ColumnDefinitions="*, N"` |
| Icone pequeno precisa de area de toque | Wrapper VerticalStackLayout com Padding |
| Componente usado em multiplas telas com titulos diferentes | BindableProperty para Title |
| BindableProperty copiada de outro componente | Verifique o terceiro parametro do Create (deve ser a classe atual) |
| Placeholder de senha | Coloque regras de validacao, nao texto generico |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `HorizontalStackLayout` para Entry + icone | `Grid ColumnDefinitions="*, 40"` |
| Imagem tocavel sem wrapper | `VerticalStackLayout` com `TapGestureRecognizer` e Padding |
| Copiar BindableProperty sem trocar a classe | Sempre confirme `typeof(ClasseAtual)` no terceiro parametro |
| Placeholder generico "Digite sua senha" | Instrucoes de validacao "Minimo de 6 caracteres" |
| Uma unica imagem para toggle | Duas imagens: `icon_eye.png` e `icon_eye_hiding.png` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
