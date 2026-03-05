---
name: rs-angular-importando-fontes-google-fonts
description: "Applies Google Fonts integration in Angular projects using the performant link tag approach. Use when user asks to 'add a font', 'import Google Fonts', 'change typography', 'setup fonts in Angular', or 'use custom fonts'. Guides correct placement in index.html with preconnect tags and proper CSS font-family usage. Make sure to use this skill whenever adding external fonts to any Angular project. Not for local/self-hosted font files, icon fonts, or font subsetting optimization."
---

# Importando Fontes do Google Fonts no Angular

> Importe fontes do Google Fonts usando a tag `<link>` no `index.html` para nao bloquear a renderizacao da pagina.

## Regra principal

**Sempre use `<link>` no `<head>` do `index.html`, nunca `@import` no CSS**, porque o navegador baixa os links em paralelo com outros recursos, enquanto `@import` bloqueia a renderizacao ate a fonte ser baixada.

## Steps

### Step 1: Selecionar a fonte no Google Fonts

1. Acesse [fonts.google.com](https://fonts.google.com)
2. Selecione a fonte desejada → **Get Font** → **Get Embedded Code**
3. Configure weight/style conforme necessidade (Full Access para todos os pesos, ou One Value para peso especifico)
4. Copie o codigo da opcao **`<link>`** (primeira aba, nao `@import`)

### Step 2: Adicionar os links no index.html

Coloque os tres links dentro do `<head>`, abaixo das tags existentes:

```html
<head>
  <!-- tags existentes -->

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</head>
```

### Step 3: Aplicar no CSS

```css
p {
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  font-style: normal;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto Angular com acesso ao index.html | Use `<link>` no `<head>` |
| Sem acesso ao HTML (raro, sistemas legados) | Use `@import` no styles.css como fallback |
| Precisa de apenas um peso (ex: 300) | Selecione "One Value" no Google Fonts para reduzir download |
| Precisa de todos os pesos | Selecione "Full Access" |
| Fonte nao aparece corretamente | Verifique se `font-style: normal` esta explicito, pois italico pode ser aplicado por padrao |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `@import url(...)` no styles.css | `<link>` no index.html |
| Esquecer as tags `preconnect` | Sempre incluir os dois `<link rel="preconnect">` |
| `font-family: Roboto` sem fallback | `font-family: "Roboto", sans-serif` |
| Baixar manualmente os arquivos .woff2 do Google Fonts | Usar o link direto do servidor do Google |
| Omitir `font-style` e assumir que sera normal | Declarar `font-style: normal` explicitamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
