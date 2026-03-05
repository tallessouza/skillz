---
name: rs-full-stack-estrutura-inicial-variaveis-css
description: "Enforces CSS project structure with variables and REM units when setting up web projects. Use when user asks to 'create a project', 'setup CSS', 'define colors', 'configure fonts', 'use rem units', or 'create CSS variables'. Applies rules: always use REM instead of pixels, define colors and fonts as CSS custom properties in :root, organize CSS with imports. Make sure to use this skill whenever starting a new HTML/CSS project or defining design tokens. Not for JavaScript logic, backend setup, or CSS animations."
---

# Estrutura Inicial e Variáveis do CSS

> Organize fontes, cores e unidades de medida como variáveis no :root, usando sempre REM para garantir acessibilidade.

## Rules

1. **Nunca use pixels para tamanhos** — use REM sempre, porque pixels ignoram as configurações de acessibilidade do navegador do usuário
2. **Converta pixels para REM dividindo por 16** — `14px = 14/16 = 0.875rem`, `8px = 8/16 = 0.5rem`, `4px = 4/16 = 0.25rem`, porque 1rem = 16px por padrão do navegador
3. **Defina fontes e cores como variáveis no :root** — porque centraliza design tokens e facilita manutenção
4. **Organize CSS com @import em um index.css** — separe global.css, e importe via `@import url("global.css")`, porque mantém responsabilidades separadas
5. **Use caminhos relativos sem barra inicial** — `styles/index.css` não `./styles/index.css` nem `/styles/index.css`, porque evita problemas de resolução de caminho
6. **Sempre inclua fallback em font-family** — `"Poppins", sans-serif`, porque garante legibilidade se a fonte externa falhar

## How to write

### Estrutura de arquivos

```
project/
├── index.html
├── styles/
│   ├── index.css      # Ponto de entrada, só imports
│   └── global.css     # Reset, variáveis, estilos globais
└── assets/
    └── (imagens)
```

### HTML base com fonte externa

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="styles/index.css">
  <title>Nome do Projeto</title>
</head>
```

### index.css (só imports)

```css
@import url("global.css");
```

### Variáveis no :root

```css
:root {
  --font-family: "Poppins", sans-serif;

  --text: 400 1rem/1.5 var(--font-family);
  --text-sm: 400 0.875rem/1.4 var(--font-family);

  --text-primary: #292524;
  --text-secondary: #57564E;
  --text-tertiary: #8F8881;
  --text-highlight: #E43A12;

  --surface-primary: #FFFFFF;
  --surface-secondary: #FEE7D6;

  --stroke-default: #D6D3D1;
  --stroke-highlight: #F3541C;

  --semantic-error: #DC2626;
}
```

## Example

**Before (pixels fixos, sem variáveis):**
```css
body {
  font-family: Poppins;
  font-size: 16px;
  color: #292524;
  background: #FFFFFF;
}

h1 {
  font-size: 32px;
  color: #E43A12;
}

.error {
  color: #DC2626;
  font-size: 14px;
}
```

**After (REM + variáveis):**
```css
body {
  font: var(--text);
  color: var(--text-primary);
  background: var(--surface-primary);
}

h1 {
  font-size: 2rem;
  color: var(--text-highlight);
}

.error {
  color: var(--semantic-error);
  font-size: 0.875rem;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Valor em pixels no design | Divida por 16, use REM |
| Cor repetida em múltiplos lugares | Crie variável no :root |
| Font-size no :root/html | Nunca defina em pixels, use 100% ou deixe o padrão |
| Fonte do Google Fonts | Preconnect primeiro, link da fonte depois, CSS por último |
| Novo arquivo CSS | Importe via index.css, não adicione outro link no HTML |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `font-size: 16px` | `font-size: 1rem` |
| `font-size: 14px` | `font-size: 0.875rem` |
| `html { font-size: 16px }` | Não defina (ou use `font-size: 100%`) |
| `color: #292524` (inline) | `color: var(--text-primary)` |
| `href="/styles/index.css"` | `href="styles/index.css"` |
| `@import url("/global.css")` | `@import url("global.css")` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Explicação completa sobre REM vs EM vs pixels e acessibilidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código com variações e tabela de conversão px→rem