---
name: rs-full-stack-style-guide-css-variables
description: "Enforces CSS custom properties (variables) architecture using :root for global theming and style guides. Use when user asks to 'create a style guide', 'define CSS variables', 'set up colors', 'theme a project', 'use CSS custom properties', or any global styling setup. Applies rules: variables in :root, semantic naming, var() function usage, hex transparency trick. Make sure to use this skill whenever setting up project-wide CSS colors or theming. Not for CSS animations, layouts, or component-specific styling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-fundamentals
  tags: [css, css-variables, custom-properties, theming, style-guide, figma]
---

# Style Guide com Variáveis CSS

> Defina todas as cores e tokens visuais como custom properties no :root, use var() para aplicá-las, e mude o projeto inteiro alterando um único lugar.

## Rules

1. **Declare variáveis no :root** — use a pseudo-class `:root` (não `html`), porque tem especificidade maior e representa escopo global do projeto
2. **Nomeie semanticamente** — `--brand-color`, `--text-color-secondary`, `--bg-color-primary`, sem espaços, sem números soltos, porque o nome deve comunicar a intenção de uso
3. **Use var() para consumir** — `color: var(--text-color-secondary)`, nunca repita o valor hex diretamente, porque centralizar permite mudar em um só lugar
4. **Transparência em hex** — converta opacidade para sufixo hex (56% ≈ `8F`) ou use o color picker do Figma alternando entre formatos (HSLA/RGBA) para encontrar o valor correto
5. **Exporte assets antes de codar** — no Figma, use Ctrl+Shift+E (Win) ou Cmd+Shift+E (Mac) para exportar todos os assets de uma vez para uma pasta `assets/`
6. **Prefixe por categoria** — agrupe variáveis: `--brand-*`, `--text-color-*`, `--bg-color-*`, `--shape-*`, porque facilita autocompletar no editor e organiza o style guide

## How to write

### Definindo variáveis globais

```css
:root {
  --brand-color: #5271FF;
  --text-color-primary: #1A1A2E;
  --text-color-secondary: #ABABAB;
  --bg-color-primary: #0F0F1A;
  --bg-color-secondary: #1C1C2E;
  --shape-color: #2C2C3E;
  --shape-transparency: #FFFFFF8F; /* branco com 56% opacidade */
}
```

### Consumindo variáveis

```css
body {
  background-color: var(--bg-color-primary);
  color: var(--text-color-secondary);
}

.card {
  background-color: var(--shape-color);
  border: 1px solid var(--shape-transparency);
}
```

## Example

**Before (valores hardcoded espalhados):**
```css
body { color: #ABABAB; background-color: #0F0F1A; }
.card { background-color: #2C2C3E; }
.header { color: #ABABAB; }
.link { color: #5271FF; }
```

**After (com variáveis centralizadas):**
```css
:root {
  --brand-color: #5271FF;
  --text-color-secondary: #ABABAB;
  --bg-color-primary: #0F0F1A;
  --shape-color: #2C2C3E;
}

body { color: var(--text-color-secondary); background-color: var(--bg-color-primary); }
.card { background-color: var(--shape-color); }
.header { color: var(--text-color-secondary); }
.link { color: var(--brand-color); }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Cor usada em 2+ lugares | Extraia para variável no :root |
| Cor com opacidade no Figma | Converta para hex com sufixo de opacidade ou use RGBA |
| Mudança de tema/marca | Altere apenas as variáveis no :root |
| VS Code autocomplete | Digite `--` e o editor sugere variáveis disponíveis |
| Cor usada uma única vez | Ainda assim use variável se faz parte do style guide |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `color: #ABABAB;` repetido em 5 seletores | `color: var(--text-color-secondary);` |
| Variáveis no `html {}` | Variáveis no `:root {}` |
| `--cor1`, `--c2`, `--x` | `--brand-color`, `--text-color-primary` |
| `opacity: 0.56` separado da cor | Sufixo hex na própria cor: `#FFFFFF8F` |
| Copiar hex do Figma sem checar opacidade | Verificar campo de opacidade antes de copiar |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `var(--nome)` nao aplica a cor | Variavel nao definida no `:root` ou nome errado | Verificar que a variavel existe com `--` prefixo no `:root` |
| Transparencia hex nao funciona | Sufixo de opacidade incorreto | Usar color picker do Figma para converter opacidade para hex (ex: 56% = `8F`) |
| Autocomplete nao sugere variaveis | Editor nao reconhece arquivo CSS | Verificar extensao `.css` e que o arquivo esta salvo |
| Cor do Figma nao bate com o CSS | Opacidade aplicada no Figma nao copiada | Verificar campo de opacidade no Figma antes de copiar o hex |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre :root vs html, estratégia de transparência hex, e fluxo de exportação de assets
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações de temas e técnicas de organização