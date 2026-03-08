---
name: rs-full-stack-web-fonts-1
description: "Applies web font integration patterns when adding custom fonts to HTML/CSS projects. Use when user asks to 'add a font', 'change typography', 'use Google Fonts', 'import a font', or 'customize fonts'. Covers Google Fonts link method, @import method, @font-face for local fonts, and performance best practices. Make sure to use this skill whenever the user is setting up typography or importing external fonts. Not for icon fonts, font-awesome, or SVG icon systems."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-typography
  tags: [css, fonts, google-fonts, font-face, web-fonts, performance]
---

# Web Fonts

> Importar fontes externas usando o metodo link do Google Fonts para tipografia personalizada e performatica.

## Rules

1. **Prefira o metodo link sobre @import** — `<link>` no HTML e mais rapido que `@import` no CSS, porque o navegador inicia o download antes de processar o CSS
2. **Coloque preconnect no inicio do head** — as tags `<link rel="preconnect">` devem vir antes de outros elementos, porque o navegador le linha a linha e a pre-conexao acelera o download da fonte
3. **Coloque o link da fonte antes do fechamento do head** — apos o title, para que a pre-conexao ja esteja estabelecida quando o browser encontrar o link da fonte
4. **Importe apenas os pesos necessarios** — nao importe todos os pesos (100-900) se voce so usa 300 e 700, porque cada peso adicional aumenta o tempo de carregamento
5. **Sempre declare fallback sans-serif** — `font-family: "Roboto", sans-serif`, porque se a fonte falhar, o usuario ainda ve algo legivel
6. **Use @font-face apenas para fontes pagas/locais** — fontes compradas que nao estao no Google Fonts exigem configuracao manual com formatos corretos (.woff2, .woff)

## How to write

### Google Fonts via link (recomendado)

```html
<head>
  <!-- Preconnect primeiro — acelera a conexao -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <meta charset="UTF-8">
  <title>Minha Pagina</title>
  
  <!-- Link da fonte depois do title -->
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap" rel="stylesheet">
</head>
```

```css
body {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
}

h1 {
  font-weight: 700;
}
```

### @font-face para fontes locais (avancado)

```css
@font-face {
  font-family: "MinhaFonte";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("./fonts/minha-fonte.woff2") format("woff2");
}
```

## Example

**Before (lento — @import no CSS):**
```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap');

body {
  font-family: "Roboto", sans-serif;
}
```

**After (rapido — link no HTML):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap" rel="stylesheet">
```
```css
body {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto novo com tipografia customizada | Google Fonts via link no HTML |
| Precisa de apenas 1-2 pesos | Selecione apenas os pesos necessarios na URL |
| Fonte paga/comprada pelo cliente | @font-face com arquivos .woff2 no servidor |
| Multiplas fontes (titulo + corpo) | Adicione ambas no mesmo fluxo do Google Fonts |
| Performance critica | Preconnect no topo do head, link apos title |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `@import url(...)` no CSS para Google Fonts | `<link>` no HTML com preconnect |
| `font-family: Roboto` (sem fallback) | `font-family: "Roboto", sans-serif` |
| Importar todos os pesos (100-900) | Importar apenas os pesos usados (ex: 300, 700) |
| Preconnect depois do link da fonte | Preconnect antes de tudo no head |
| Assumir que o usuario tem a fonte instalada | Sempre importar a fonte explicitamente |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Fonte nao carrega, mostra fallback | URL do Google Fonts incorreta ou rede bloqueada | Verifique a URL e teste abrindo-a diretamente no navegador |
| FOUT (Flash of Unstyled Text) | Fonte demora a carregar | Adicione `font-display: swap` na URL do Google Fonts |
| Peso especifico nao funciona (ex: bold) | Peso nao importado na URL | Adicione o peso na URL: `?family=Roboto:wght@300;700` |
| `@font-face` nao encontra arquivo | Caminho relativo incorreto para o arquivo .woff2 | Verifique o caminho relativo ao CSS, nao ao HTML |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre performance, font-display swap, e quando usar cada metodo
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-web-fonts-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-web-fonts-1/references/code-examples.md)
