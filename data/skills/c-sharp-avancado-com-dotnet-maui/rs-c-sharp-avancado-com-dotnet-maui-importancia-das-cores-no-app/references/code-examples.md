# Code Examples: Importancia das Cores no App

## Organizacao de variaveis de cores no Figma

O instrutor demonstra a organizacao no Figma usando **variaveis locais** (Local Variables):

```
Colecao: Cores
├── Light Mode
│   ├── AvatarColor: [cor fixa]
│   ├── DangerAction: [vermelho light]
│   ├── HighlightColor: [azul light]
│   ├── PageBackgroundColor: #FFFFFF
│   ├── PrimaryColor: #000000
│   ├── SecondaryColor: #FFFFFF
│   ├── SkeletonLoadColor: [cor especifica]
│   ├── LineColor: PrimaryColor 20% opacity
│   ├── PlaceholderColor: PrimaryColor 50% opacity
│   └── KeyboardColor: [cor especifica]
│
└── Dark Mode
    ├── AvatarColor: [cor fixa]
    ├── DangerAction: [vermelho dark - tonalidade diferente]
    ├── HighlightColor: [azul dark - tonalidade diferente]
    ├── PageBackgroundColor: #3D3C40
    ├── PrimaryColor: [cor clara]
    ├── SecondaryColor: [cor escura]
    ├── SkeletonLoadColor: [cor especifica]
    ├── LineColor: PrimaryColor 20% opacity
    ├── PlaceholderColor: PrimaryColor 50% opacity
    └── KeyboardColor: [cor especifica]
```

## Equivalente em .NET MAUI (ResourceDictionary)

### Light Theme

```xml
<ResourceDictionary>
    <Color x:Key="AvatarColor">#7C3AED</Color>
    <Color x:Key="DangerActionColor">#EF4444</Color>
    <Color x:Key="HighlightColor">#3B82F6</Color>
    <Color x:Key="PageBackgroundColor">#FFFFFF</Color>
    <Color x:Key="PrimaryColor">#000000</Color>
    <Color x:Key="SecondaryColor">#FFFFFF</Color>
    <Color x:Key="SkeletonLoadColor">#E5E7EB</Color>
    <Color x:Key="LineColor">#33000000</Color>
    <Color x:Key="PlaceholderColor">#80000000</Color>
    <Color x:Key="KeyboardColor">#F3F4F6</Color>
</ResourceDictionary>
```

### Dark Theme

```xml
<ResourceDictionary>
    <Color x:Key="AvatarColor">#7C3AED</Color>
    <Color x:Key="DangerActionColor">#F87171</Color>
    <Color x:Key="HighlightColor">#60A5FA</Color>
    <Color x:Key="PageBackgroundColor">#3D3C40</Color>
    <Color x:Key="PrimaryColor">#FFFFFF</Color>
    <Color x:Key="SecondaryColor">#3D3C40</Color>
    <Color x:Key="SkeletonLoadColor">#4B5563</Color>
    <Color x:Key="LineColor">#33FFFFFF</Color>
    <Color x:Key="PlaceholderColor">#80FFFFFF</Color>
    <Color x:Key="KeyboardColor">#1F2937</Color>
</ResourceDictionary>
```

## Demonstracao de contraste no Figma

O instrutor seleciona elementos no Figma e usa o plugin **Contrast**:

```
Elemento: "Bruce Wayne" (texto preto, fundo branco)
→ Resultado: AAA ✅ (texto normal e large)

Elemento: "BW" (texto branco, fundo roxo)
→ Resultado: AAA ✅

Elemento: Circulo roxo (fundo branco)
→ Resultado: AAA ✅

Elemento: Texto azul (fundo branco)
→ Resultado: AA ✅, AAA ❌ para texto normal
→ Solucao: usar large text (24px+) ou bold → AAA ✅
```

## Usando Color Safe para escolher cores

```
1. Acesse colorsafe.co
2. Clique em "Generate"
3. Insira o background hex (ex: #3D3C40 para dark mode)
4. Selecione WCAG Standard: AAA
5. Clique "Generate Color Palette"
6. Resultado: todas as cores validas para aquele fundo
   → Verdes, azuis, roxos, cinzas, amarelos, laranjas, vermelhos
```

## Comparacao visual: preto puro vs cinza escuro

```
Dark Mode com #000000 (preto puro):
┌─────────────────────────┐
│█████████████████████████│  ← Muito escuro, "estranho",
│█████████████████████████│    desconfortavel aos olhos
│█████████████████████████│
└─────────────────────────┘

Dark Mode com #3D3C40 (cinza escuro):
┌─────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← Mais suave, agradavel,
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│    natural para os olhos
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└─────────────────────────┘
```

## Anti-pattern: nomeando pelo nome da cor

```csharp
// ERRADO — preso ao nome da cor
static class Colors
{
    public static Color AzulTurquesa => Color.FromHex("#3B82F6");
    public static Color VermelhoEscuro => Color.FromHex("#EF4444");
    public static Color PretoFundo => Color.FromHex("#000000");
}

// Se quiser trocar azul para laranja:
// → Precisa renomear AzulTurquesa em TODOS os arquivos
// → Ou fica com AzulTurquesa = laranja (confuso)
```

```csharp
// CORRETO — nomeado pela categoria
static class AppColors
{
    public static Color HighlightColor => Color.FromHex("#3B82F6");
    public static Color DangerActionColor => Color.FromHex("#EF4444");
    public static Color PageBackgroundColor => Color.FromHex("#3D3C40");
}

// Se quiser trocar azul para laranja:
// → Troca o hex em UM lugar, pronto
```