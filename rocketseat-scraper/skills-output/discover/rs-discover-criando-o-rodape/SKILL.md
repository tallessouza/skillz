---
name: rs-discover-criando-o-rodape
description: "Applies HTML footer implementation patterns when building website footers with semantic markup. Use when user asks to 'create a footer', 'add a rodape', 'build page footer', 'add site credits', or 'implement footer section'. Enforces semantic footer tag, proper link structure, centered text alignment, and consistent spacing. Make sure to use this skill whenever generating footer HTML/CSS code. Not for navigation headers, sidebars, or complex multi-column footer layouts."
---

# Criando o Rodapé

> Use a tag semântica `<footer>` para rodapés, com padding vertical consistente e texto centralizado.

## Rules

1. **Use a tag `<footer>`** — nunca `<div class="footer">`, porque `<footer>` é semântico e acessível por padrão
2. **Links com `<a href>`** — links externos usam URL completa com `https://`, porque links relativos quebram em contextos diferentes
3. **Padding vertical simétrico** — `padding: 24px 0` mantém espaço em cima e embaixo sem laterais, porque o container pai já controla margens horizontais
4. **Texto centralizado** — `text-align: center` no footer, porque créditos/atribuições são visualmente centrais por convenção
5. **Font-size menor que o corpo** — use `14px` no footer vs `16px` no body, porque informações secundárias têm hierarquia visual menor

## How to write

### Footer HTML semântico

```html
<footer>
  Feito com amor pela
  <a href="https://rocketseat.com.br">Rocketseat</a>
</footer>
```

### Footer CSS

```css
footer {
  padding: 24px 0;
  text-align: center;
  font-size: 14px;
  color: #fff;
}
```

## Example

**Before (não semântico):**

```html
<div class="footer">
  <p>Feito por <span>Rocketseat</span></p>
</div>
```

**After (com esta skill):**

```html
<footer>
  Feito com amor pela
  <a href="https://rocketseat.com.br">Rocketseat</a>
</footer>
```

```css
footer {
  padding: 24px 0;
  text-align: center;
  font-size: 14px;
  color: #fff;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Rodapé com créditos simples | `<footer>` com texto e link direto |
| Rodapé com múltiplas seções | `<footer>` com `<div>` internos para cada seção |
| Link externo no footer | URL completa com `https://` |
| Verificar espaçamentos | Use DevTools para confirmar padding real vs esperado |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<div class="footer">` | `<footer>` |
| `padding: 24px` (todos os lados) | `padding: 24px 0` (só vertical) |
| `font-size: 16px` no footer | `font-size: 14px` (hierarquia menor) |
| Link sem protocolo `rocketseat.com.br` | `https://rocketseat.com.br` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre semântica HTML e verificação de espaçamentos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações