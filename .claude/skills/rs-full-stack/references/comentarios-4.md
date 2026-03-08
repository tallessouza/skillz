---
name: rs-full-stack-comentarios-4
description: "Applies CSS comment syntax and best practices when writing or organizing stylesheets. Use when user asks to 'comment CSS', 'disable CSS code', 'organize stylesheet', 'add notes to CSS', or 'temporarily remove styles'. Enforces correct /* */ syntax and comment conventions. Make sure to use this skill whenever adding comments or disabling blocks in CSS files. Not for HTML comments, JavaScript comments, or documentation generation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [css, comments, organization, debugging, stylesheet]
---

# Comentários em CSS

> Use comentários CSS para anotar código e desativar trechos temporariamente, sempre com a sintaxe `/* */`.

## Rules

1. **Use `/* */` para todo comentário CSS** — barra-asterisco abre, asterisco-barra fecha, porque CSS não suporta `//` como JavaScript
2. **Comente blocos inteiros para desativar** — envolva o bloco completo com `/* ... */`, porque isso preserva o código para reativação futura
3. **Use comentários como separadores de seção** — agrupe regras relacionadas sob comentários descritivos, porque facilita navegação em arquivos longos

## How to write

### Comentário de linha

```css
/* Define a cor principal do tema */
body {
  background-color: #f0f0f0;
}
```

### Desativar um bloco inteiro

```css
/*
header {
  background-color: red;
  color: white;
  padding: 20px;
}
*/
```

### Separadores de seção

```css
/* ========== HEADER ========== */
header { ... }

/* ========== MAIN CONTENT ========== */
main { ... }
```

## Example

**Before (código que precisa ser desativado temporariamente):**

```css
h1 {
  color: blue;
}
p {
  font-size: 18px;
}
```

**After (bloco desativado com comentário):**

```css
/*
h1 {
  color: blue;
}
*/
p {
  font-size: 18px;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Desativar CSS temporariamente | Envolva com `/* ... */` |
| Anotar decisão de estilo | Comentário curto acima da regra |
| Arquivo CSS com muitas seções | Use comentários como separadores |
| Debugging de estilos | Comente propriedades uma a uma para isolar o problema |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `// comentário em CSS` | `/* comentário em CSS */` |
| Comentário sem fechar `/* ...` | `/* ... */` sempre fechado |
| Comentários óbvios: `/* cor azul */` antes de `color: blue` | Comentários que explicam o PORQUÊ, não o quê |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `// comentário` quebra o CSS | CSS não suporta sintaxe `//` | Use `/* comentário */` sempre |
| Comentário não fecha e desativa todo o CSS abaixo | Faltou `*/` de fechamento | Adicione `*/` ao final do comentário |
| Estilos desaparecem misteriosamente | Comentário `/*` aberto acidentalmente sem fechar | Procure por `/*` sem `*/` correspondente no arquivo |
| Comentário aparece no CSS minificado | Minificador não configurado para remover comentários | Configure o minificador para strip comments |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando e como usar comentários CSS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações