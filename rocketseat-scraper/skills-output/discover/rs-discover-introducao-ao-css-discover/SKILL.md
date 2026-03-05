---
name: rs-discover-introducao-ao-css
description: "Applies foundational CSS syntax and structure when writing stylesheets for HTML pages. Use when user asks to 'style a page', 'add CSS', 'change background color', 'write a selector', or 'add styles to HTML'. Enforces correct declaration syntax: selector, curly braces, property-colon-value-semicolon pattern. Covers CSS comments syntax. Make sure to use this skill whenever generating basic CSS for beginners or reviewing CSS syntax fundamentals. Not for advanced CSS layouts, animations, responsive design, or preprocessors like SASS."
---

# Introdução ao CSS

> CSS estiliza HTML através de declarações compostas por seletor, propriedade e valor — dominar a sintaxe básica é o alicerce de toda estilização.

## Rules

1. **Toda declaração segue o padrão `propriedade: valor;`** — dois pontos separam propriedade do valor, ponto e vírgula encerra a instrução, porque omitir qualquer um quebra silenciosamente o estilo
2. **Seletores identificam O QUE será estilizado** — `body`, `h1`, `p` selecionam tags HTML pelo nome, porque sem seletor correto o navegador não sabe onde aplicar
3. **Chaves delimitam o bloco de declarações** — `{ }` agrupa todas as propriedades de um seletor, porque declarações fora das chaves são ignoradas
4. **Comentários usam `/* */`** — nunca `//`, porque CSS só reconhece o formato barra-asterisco para comentários (single e multi-line)
5. **O segredo do CSS é conhecer propriedades e valores** — a sintaxe é simples e repetitiva, o poder vem de descobrir quais propriedades existem e que valores aceitam

## How to write

### Declaração básica

```css
/* Seletor + chaves + propriedade: valor; */
body {
  background: red;
}
```

### Múltiplas propriedades

```css
body {
  background: black;
  color: white;
  font-size: 16px;
}
```

### Comentários

```css
/* Comentário de uma linha */

/*
  Comentário de múltiplas linhas:
  Seletor seguido de par de chaves,
  propriedades e valores dentro.
*/

body {
  background: red;
  /* color: green; — linha ignorada pelo navegador */
}
```

## Example

**Before (sintaxe incorreta):**
```css
body
  background red
  // isso é um comentário
```

**After (com esta skill aplicada):**
```css
body {
  background: red;
  /* isso é um comentário */
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Quer estilizar uma tag HTML | Use o nome da tag como seletor: `body { }`, `h1 { }` |
| Quer desativar uma linha temporariamente | Envolva com `/* ... */` |
| Não sabe qual propriedade usar | Comece digitando no editor — o autocomplete revela opções |
| Múltiplos estilos no mesmo elemento | Adicione mais linhas `propriedade: valor;` dentro das mesmas chaves |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `background red` (sem dois pontos) | `background: red;` |
| `background: red` (sem ponto e vírgula) | `background: red;` |
| `// comentário` | `/* comentário */` |
| Declarações fora de chaves | Sempre dentro de `seletor { ... }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre cascata, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações