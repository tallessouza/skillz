# Code Examples: Formatos de Imagem

## Manipulacao de SVG via XML

### Trocar cor de um elemento

O instrutor demonstrou editando o arquivo SVG diretamente:

```xml
<!-- Antes: icone com path preto -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M10 20 L15 25..." fill="black" />
  <path d="M5 10 L8 15..." fill="black" />
</svg>

<!-- Depois: cada path com cor diferente -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M10 20 L15 25..." fill="blue" />
  <path d="M5 10 L8 15..." fill="red" />
</svg>
```

### Cores por nome vs hexadecimal

```xml
<!-- Por nome -->
<path fill="blue" d="..." />
<path fill="red" d="..." />
<path fill="green" d="..." />
<path fill="yellow" d="..." />

<!-- Por hexadecimal (com #) -->
<path fill="#FF69B4" d="..." />
<path fill="#4A90D9" d="..." />
<path fill="#2ECC71" d="..." />
```

## Estrutura de assets para .NET MAUI

### Organizacao recomendada

```
Resources/
  Images/
    logo.svg              # Logo da app — SVG para qualquer resolucao
    icon_home.svg         # Icone de navegacao — SVG para dark/light mode
    icon_settings.svg     # Icone de configuracoes
    icon_profile.svg      # Icone de perfil
    background_hero.jpg   # Foto de fundo — JPG porque e foto
    avatar_default.png    # Avatar com fundo transparente — PNG
```

### Quando cada formato aparece no projeto

```xml
<!-- Em XAML do .NET MAUI -->

<!-- SVG para icones (redimensiona sem perda) -->
<Image Source="icon_home.svg" 
       WidthRequest="24" 
       HeightRequest="24" />

<!-- JPG para fotos (leve, boas cores) -->
<Image Source="photo_product.jpg" 
       Aspect="AspectFill" />

<!-- PNG para imagem com transparencia -->
<Image Source="overlay_badge.png" 
       BackgroundColor="Transparent" />
```

## Demonstracao de perda de qualidade (conceitual)

```
Imagem original: 5x5 pixels = 25 pixels totais
Cada pixel: 1 unidade de medida fixa

Expandir para 7x7:
  7 * 7 = 49 pixels
  49 - 25 = 24 pixels extras

Esses 24 pixels passam por interpolacao:
  - Vizinho mais proximo: copia cor do pixel adjacente
  - Bilinear: media dos vizinhos
  - Bicubico: calculo com mais vizinhos

Resultado: bordas serrilhadas, imagem borrada
```

## Comparacao de tamanho de arquivo (tipica)

```
Mesma ilustracao exportada:
  ilustracao.svg  →  ~15 KB  (vetores, escalavel)
  ilustracao.png  → ~150 KB  (rasterizado, transparencia)
  ilustracao.jpg  →  ~50 KB  (rasterizado, sem transparencia)

Mesma foto exportada:
  foto.jpg  →  ~200 KB  (comprimido, bom para fotos)
  foto.png  →  ~800 KB  (sem compressao com perda)
  foto.svg  →  impossivel (fotos nao sao vetores)
```

## Manipulacao no Figma (como demonstrado)

O instrutor mostrou que no Figma:

1. **Selecionar cores do SVG:** clicar no elemento → painel de cores mostra todas as cores usadas
2. **Trocar cor global:** selecionar cor no painel → trocar → todas as areas com aquela cor mudam
3. **Trocar cor de area especifica:** duplo-clique ate selecionar a area desejada → trocar cor apenas daquela area
4. **Expandir sem perda:** alterar dimensoes (ex: 350x350 → 50000x50000) → SVG mantem nitidez perfeita