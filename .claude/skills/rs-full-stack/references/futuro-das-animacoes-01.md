---
name: rs-full-stack-futuro-das-animacoes-01
description: "Applies CSS Animation Timeline with scroll-driven animations when writing CSS/HTML code. Use when user asks to 'animate on scroll', 'scroll-based animation', 'animation timeline', 'fade on scroll', or 'scroll-driven CSS'. Enforces correct usage of animation-timeline: scroll() with proper axis arguments and keyframes setup. Make sure to use this skill whenever implementing scroll-controlled animations in CSS. Not for JavaScript scroll libraries, Intersection Observer, or viewport-based animation-timeline (view)."
---

# CSS Animation Timeline — Scroll

> Controle a timeline de animacoes CSS com base no scroll da pagina, sem JavaScript.

## Rules

1. **Sempre defina keyframes antes de usar animation-timeline** — a propriedade `animation-timeline: scroll()` depende de um `@keyframes` valido, porque ela controla o progresso da animacao de 0% a 100% baseado no scroll
2. **Nao defina duracao na animation shorthand** — quando usando scroll-driven animation, o scroll controla o tempo, entao use apenas nome e easing (`animation: fade linear`), porque a duracao e determinada pela extensao do scroll
3. **Verifique compatibilidade antes de usar em producao** — Safari e Firefox nao suportam bem animation-timeline (caniuse.com), porque seus usuarios podem nao ver a animacao
4. **Use o eixo correto no scroll()** — `scroll(y)` ou `scroll(block)` para vertical (padrao), `scroll(inline)` para horizontal, porque sem scroll no eixo escolhido a animacao nao funciona
5. **Quanto maior o scroll, maior a duracao** — a animacao so completa quando o scroll chega ao final, porque o progresso e proporcional a posicao do scroll

## How to write

### Keyframes + scroll timeline

```css
@keyframes fade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

article img {
  animation: fade linear;
  animation-timeline: scroll();
}
```

### Especificando eixo do scroll

```css
/* Scroll vertical (padrao) */
animation-timeline: scroll(y);
animation-timeline: scroll(block);

/* Scroll horizontal (precisa existir overflow-x) */
animation-timeline: scroll(inline);
```

## Example

**Before (animacao tradicional com duracao fixa):**
```css
article img {
  animation: fade 2s linear;
}
```

**After (controlada pelo scroll):**
```css
@keyframes fade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

article img {
  animation: fade linear;
  animation-timeline: scroll();
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Quer fade conforme usuario rola a pagina | `animation-timeline: scroll()` com keyframes de opacity |
| Pagina tem pouco conteudo/scroll | Animacao sera muito rapida — considere usar `view()` em vez de `scroll()` |
| Precisa funcionar em Safari | Nao use animation-timeline, use Intersection Observer como fallback |
| Scroll horizontal existe no container | Passe `scroll(inline)` como argumento |
| Nao especificou eixo | Padrao e `block` (vertical) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `animation: fade 2s linear` com scroll timeline | `animation: fade linear` (sem duracao) |
| `animation-timeline: scroll(inline)` sem overflow horizontal | `animation-timeline: scroll()` (vertical padrao) |
| Usar em producao sem checar caniuse | Verificar suporte e adicionar fallback |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-futuro-das-animacoes-01/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-futuro-das-animacoes-01/references/code-examples.md)
