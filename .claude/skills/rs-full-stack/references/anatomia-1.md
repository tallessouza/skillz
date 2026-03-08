---
name: rs-full-stack-anatomia-1
description: "Enforces correct CSS declaration anatomy when writing stylesheets. Use when user asks to 'style an element', 'write CSS', 'add styles', 'create a CSS rule', or any styling task. Applies structure: selector, curly braces context, property-value pairs with correct syntax. Make sure to use this skill whenever generating CSS code, even for simple styling. Not for CSS layout strategies, responsive design, or CSS architecture decisions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [css, anatomy, selector, declaration, syntax]
---

# Anatomia de uma Declaracao CSS

> Toda estilizacao CSS segue uma estrutura fixa: seletor abre um contexto com chaves, e dentro dele pares de propriedade-valor controlam a aparencia dos elementos.

## Rules

1. **Estruture declaracoes completas** — seletor + `{}` + pares `propriedade: valor;`, porque cada parte tem funcao distinta e omitir qualquer uma quebra a regra
2. **Separe propriedades compostas com hifen** — `font-size`, `letter-spacing`, `text-transform`, nunca espacos, porque CSS usa hifen como separador de palavras em propriedades
3. **Termine cada par com ponto e virgula** — mesmo o ultimo par, porque omitir causa falha silenciosa ao adicionar novas propriedades
4. **Reconheca tipos de valor** — named values (`blue`, `uppercase`), valores numericos com unidade (`60px`), valores numericos puros (`2`), porque cada propriedade aceita tipos especificos
5. **Seletor de tag afeta TODOS os elementos correspondentes** — `h1 {}` aplica a todo `<h1>` da pagina, porque o seletor de tag nao discrimina instancias
6. **Consulte o MDN para valores aceitos** — cada propriedade tem valores especificos documentados, porque o autocomplete do editor sugere opcoes que nem sempre funcionam

## How to write

### Declaracao CSS completa

```css
/* seletor → contexto (chaves) → propriedade: valor; */
h1 {
  color: blue;
  font-size: 60px;
  letter-spacing: 2;
  text-transform: uppercase;
}
```

### Tipos de valor

```css
h1 {
  color: blue;              /* named value (nome) */
  font-size: 60px;          /* numerico com unidade (pixels) */
  letter-spacing: 2;        /* numerico puro */
  text-transform: uppercase; /* named value */
}
```

## Example

**Before (HTML sem CSS):**
```html
<h1>Meu Titulo</h1>
<!-- Renderiza com estilo padrao do navegador -->
```

**After (com declaracao CSS aplicada):**
```css
h1 {
  color: blue;
  font-size: 60px;
  letter-spacing: 2;
  text-transform: uppercase;
}
```
```html
<h1>Meu Titulo</h1>
<!-- Renderiza azul, 60px, espacado, TUDO EM CAIXA ALTA -->
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa estilizar todos os elementos de um tipo | Use seletor de tag (`h1`, `p`, `div`) |
| Nao sabe quais valores uma propriedade aceita | Consulte MDN ou use Ctrl+Espaco no editor |
| Propriedade tem nome composto | Use hifen: `font-size`, `text-transform` |
| Valor e uma cor ou estado conhecido | Use named value: `blue`, `uppercase`, `bold` |
| Valor precisa de dimensao | Inclua unidade: `60px`, `2rem`, `100%` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `h1 { color blue }` (sem dois-pontos) | `h1 { color: blue; }` |
| `h1 { fontSize: 60px }` (camelCase) | `h1 { font-size: 60px; }` |
| `h1 { color: blue }` (sem ponto e virgula) | `h1 { color: blue; }` |
| Propriedades soltas sem seletor | Sempre dentro de `seletor { }` |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Estilo não aplica | Faltou `:` entre propriedade e valor | Use sintaxe correta: `color: blue;` |
| Apenas o primeiro estilo funciona | Faltou `;` no final de uma declaração | Termine cada par com ponto e vírgula |
| Estilo aplica a todos os elementos do tipo | Usou seletor de tag (`h1`) que afeta todos | Use seletor de classe (`.titulo`) para especificidade |
| Propriedade com camelCase não funciona | CSS usa hífens, não camelCase | Use `font-size` em vez de `fontSize` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre anatomia CSS, analogias e contexto de aprendizado
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes