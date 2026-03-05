---
name: rs-csharp-maui-formatos-imagem
description: "Applies correct image format selection (PNG, JPG, SVG) when working with .NET MAUI, mobile, or web projects. Use when user asks to 'add an image', 'choose image format', 'fix blurry images', 'handle responsive images', or 'work with icons and logos'. Enforces SVG for icons/logos, PNG for transparency, JPG for photos. Make sure to use this skill whenever the user is adding or optimizing images in any UI project. Not for image editing software, video formats, or audio files."
---

# Formatos de Imagem: PNG, JPG e SVG

> Escolha o formato de imagem pelo proposito: SVG para icones e logos, PNG para transparencia, JPG para fotos.

## Rules

1. **Use SVG para icones, logos e graficos** — porque imagens vetoriais usam equacoes matematicas e nao perdem qualidade ao redimensionar, essencial em apps que rodam em telefones e tablets com tamanhos diferentes
2. **Use PNG quando precisar de transparencia** — porque PNG suporta areas transparentes (fundo ou qualquer regiao), JPG nao suporta e substituira por cor solida
3. **Use JPG para fotos e imagens com muitas cores** — porque o arquivo e muito mais leve que PNG, ideal para conteudo fotografico
4. **Nunca use JPG para icones ou logos** — porque perde qualidade a cada salvamento e borra ao redimensionar
5. **Nunca use SVG para fotos** — porque SVG armazena vetores, nao pixels; fotos nao podem ser representadas como equacoes matematicas
6. **SVG precisa ser bem feito** — porque SVG mal construido pode sobrepor componentes e causar problemas de layout

## Decisao rapida

| Preciso de... | Formato |
|---------------|---------|
| Icone ou logo | SVG |
| Fundo transparente | PNG |
| Foto de produto/usuario | JPG |
| Grafico ou ilustracao com texto | PNG |
| Imagem que muda de cor (dark/light mode) | SVG |
| Imagem responsiva (telefone + tablet) | SVG |

## Como funciona

### Imagens rasterizadas (PNG, JPG)

Compostas por pixels. Ao redimensionar, algoritmos de interpolacao (vizinho mais proximo, bilinear, bicubico) tentam preencher pixels extras, causando bordas serrilhadas e borroes.

```
Imagem 5x5 = 25 pixels
Expandir para 7x7 = 49 pixels
24 pixels extras precisam ser "inventados" → borrao
```

### Imagens vetoriais (SVG)

Compostas por equacoes matematicas. Altura e largura sao variaveis da equacao — o resultado e sempre calculado corretamente, independente do tamanho.

### SVG e manipulavel por codigo

SVG usa formato XML. Cada `<path>` representa uma area com formula matematica e atributos como `fill`.

```xml
<!-- Trocar cor de um elemento SVG -->
<path d="M10 20..." fill="#FF69B4" />
```

Isso permite trocar cores programaticamente — essencial para dark mode/light mode em apps .NET MAUI.

## Example

**Antes (escolha errada):**
```
assets/
  logo.jpg          ← logo em JPG: perde qualidade ao redimensionar
  icon-home.png     ← icone em PNG: arquivo pesado, nao manipulavel
  photo.svg         ← foto em SVG: impossivel representar como vetor
```

**Depois (com este skill):**
```
assets/
  logo.svg          ← vetor: nitido em qualquer tamanho
  icon-home.svg     ← vetor: manipulavel para dark/light mode
  photo.jpg         ← foto: leve, preserva cores e detalhes
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App roda em telefone E tablet | SVG para graficos, porque vai redimensionar |
| Imagem precisa trocar cor no dark mode | SVG, porque codigo pode alterar fill via XML |
| Imagem com texto que precisa ser legivel | PNG, porque tem mais nitidez que JPG |
| Galeria de fotos de usuarios | JPG, porque arquivo leve com boas cores |
| Imagem sera salva/exportada varias vezes | PNG, porque JPG perde qualidade a cada salvamento |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Logo em JPG | Logo em SVG |
| Icone em PNG para app responsivo | Icone em SVG |
| Foto em SVG | Foto em JPG |
| JPG com area transparente | PNG com area transparente |
| Salvar JPG repetidamente sem necessidade | Manter original e exportar uma vez |

## Curiosidade: JPG vs JPEG

JPG e JPEG sao identicos. A extensao original era JPEG (Joint Photograph Experts Group), mas o Windows antigo so aceitava extensoes com 3 caracteres, entao removeram o E. Hoje ambas funcionam.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
