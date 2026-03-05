---
name: rs-full-stack-imagens
description: "Enforces correct HTML image element usage when writing img tags in HTML. Use when user asks to 'add an image', 'insert a photo', 'create an img tag', or any HTML task involving images. Applies rules: always include alt text for accessibility and SEO, use width OR height (not both unless exact dimensions known), use royalty-free sources. Make sure to use this skill whenever generating HTML with images. Not for CSS image styling, background images, or SVG manipulation."
---

# Imagens no HTML

> Toda tag img deve ter alt descritivo, e dimensoes devem respeitar a proporcao original da imagem.

## Rules

1. **Sempre inclua o atributo alt** — descreva o conteudo da imagem, porque leitores de tela dependem disso para acessibilidade e motores de busca nao conseguem "ver" a imagem
2. **Use width OU height, nao ambos** — a menos que voce saiba as dimensoes exatas da imagem, porque usar ambos com valores errados estica e distorce a imagem
3. **Prefira formatos modernos** — WebP e AVIF antes de PNG/JPG, porque sao mais leves e performaticos
4. **Cuidado com direitos autorais** — use imagens livres (Unsplash, Pexels) ou proprias, porque imagens protegidas geram problemas legais
5. **alt vazio so em imagens decorativas** — `alt=""` apenas quando a imagem nao transmite informacao, porque alt ausente quebra acessibilidade

## How to write

### Imagem basica com alt descritivo
```html
<img
  src="https://source.unsplash.com/random"
  alt="Paisagem montanhosa com neve no topo durante o por do sol"
>
```

### Controlando dimensao (apenas uma direcao)
```html
<!-- Largura fixa, altura proporcional automatica -->
<img src="foto.webp" alt="Equipe reunida no escritorio" width="200">

<!-- Altura fixa, largura proporcional automatica -->
<img src="foto.webp" alt="Equipe reunida no escritorio" height="200">
```

### Ambas dimensoes (somente quando conhecidas)
```html
<!-- Use ambos APENAS quando sabe o tamanho exato -->
<img src="logo.png" alt="Logo da empresa Acme" width="200" height="80">
```

## Example

**Before (problemas comuns):**
```html
<img src="foto.jpg">
<img src="team.png" width="300" height="300">
```

**After (com esta skill aplicada):**
```html
<img src="foto.webp" alt="Dashboard do sistema mostrando graficos de vendas mensais">
<img src="team.webp" alt="Time de desenvolvimento reunido na sala de conferencias" width="300">
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Imagem de conteudo (foto, grafico) | alt descritivo e especifico |
| Imagem decorativa (separador, enfeite) | `alt=""` (vazio, nao ausente) |
| Dimensao conhecida | Use width E height para evitar layout shift |
| Dimensao desconhecida | Use apenas width OU apenas height |
| Escolhendo formato | WebP > AVIF > PNG > JPG (considere suporte do browser) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<img src="x.jpg">` (sem alt) | `<img src="x.jpg" alt="descricao">` |
| `alt="imagem"` / `alt="foto"` | `alt="Produto X na cor azul sobre mesa branca"` |
| `width="300" height="300"` em foto retangular | `width="300"` (deixe a altura proporcional) |
| `<img src="foto.bmp">` | `<img src="foto.webp">` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre acessibilidade, SEO e performance de imagens
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes