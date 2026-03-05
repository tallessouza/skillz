---
name: rs-discover-adicionando-imagem-de-perfil
description: "Enforces correct HTML image insertion with proper src and alt attributes when building profile sections or adding images to web pages. Use when user asks to 'add an image', 'create a profile card', 'insert a photo', 'build an avatar component', or any HTML task involving images. Applies rules: always provide descriptive alt text, use relative paths for local assets, export images at 3x quality for retina. Make sure to use this skill whenever generating HTML with img tags. Not for CSS styling, image optimization pipelines, or JavaScript image manipulation."
---

# Adicionando Imagem de Perfil

> Toda tag `img` exige dois atributos completos: `src` (onde a imagem esta) e `alt` (descricao humana da imagem).

## Rules

1. **Sempre forneca `src` e `alt`** — a tag `img` sem ambos esta incompleta, porque `src` localiza a imagem e `alt` garante acessibilidade e SEO
2. **Use caminhos relativos para assets locais** — `./assets/avatar.png` nao URLs absolutas, porque mantém o projeto portavel
3. **Descreva a imagem como se falasse para alguem que nao enxerga** — o `alt` serve para leitores de tela, motores de busca e fallback visual, porque nenhum desses consegue interpretar pixels
4. **Exporte imagens em 2x ou 3x** — para telas retina, exporte o asset multiplicado para garantir qualidade, porque 1x fica pixelado em dispositivos modernos
5. **Use nomes de arquivo em minusculo sem espacos** — `avatar.png` nao `Avatar.PNG`, porque sistemas case-sensitive quebram silenciosamente
6. **Extraia arquivos .zip antes de referenciar** — o browser nao le arquivos dentro de .zip, porque so acessa arquivos descompactados no filesystem

## How to write

### Estrutura basica de profile com imagem

```html
<div id="profile">
  <img src="./assets/avatar.png" alt="Foto de Maria sorrindo, usando oculos e camisa azul">
</div>
```

### Imagem de fonte externa (URL)

```html
<img src="https://github.com/username.png" alt="Foto de perfil de Username no GitHub">
```

## Example

**Before (incompleto):**
```html
<div id="profile">
  <img src="avatar.png">
</div>
```

**After (com esta skill aplicada):**
```html
<div id="profile">
  <img
    src="./assets/avatar.png"
    alt="Foto de Mike Brito sorrindo, usando oculos e camisa preta, barba e fundo amarelo"
  >
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Imagem decorativa sem conteudo informativo | `alt=""` (vazio, mas presente) |
| Foto de pessoa | Descreva: nome, expressao, vestimenta, fundo |
| Logo ou icone com significado | Descreva a funcao: "Logo da empresa X" |
| Imagem local do projeto | Caminho relativo: `./assets/nome.png` |
| Imagem de servidor externo | URL completa com `https://` |
| Exportando do Figma | Selecione o elemento, export como PNG em 3x |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<img src="foto.png">` (sem alt) | `<img src="foto.png" alt="Descricao da foto">` |
| `alt="imagem"` / `alt="foto"` | `alt="Foto de Ana apresentando no palco"` |
| `alt="img_001.png"` | `alt="Grafico de vendas do Q1 2024"` |
| `src="C:\Users\foto.png"` | `src="./assets/foto.png"` |
| `Avatar.PNG` (case misto) | `avatar.png` (minusculo) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre src, alt, protocolos e acessibilidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes