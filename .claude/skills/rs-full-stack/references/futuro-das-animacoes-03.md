---
name: rs-full-stack-futuro-das-animacoes-03
description: "Applies CSS animation-range property patterns when writing scroll-driven animations with View Timeline. Use when user asks to 'animate on scroll', 'scroll animation', 'view timeline animation', 'animation range', or 'entry exit animation'. Covers animation-range start/end, contain, cover, entry, exit keywords and shorthand syntax. Make sure to use this skill whenever generating scroll-based CSS animations or working with animation-timeline: view(). Not for general CSS keyframes, hover transitions, or JavaScript scroll libraries."
---

# CSS Animation Range

> Usar `animation-range` para controlar precisamente quando animacoes scroll-driven iniciam e finalizam baseado na posicao do elemento na viewport.

## Rules

1. **Use animation-range ao inves de so view()** — `animation-range` da controle fino sobre inicio e fim da animacao, porque so `view()` usa o comportamento padrao (cover) sem ajuste
2. **Escolha a keyword pelo caso de uso** — `entry` para animacoes de entrada, `exit` para saida, `contain` quando o elemento precisa estar 100% visivel, porque cada keyword muda drasticamente o comportamento
3. **Combine entry e exit para animacoes bidirecionais** — use duas animacoes separadas (uma de entrada, outra de saida) com `animation-range: entry, exit`, porque uma unica animacao nao consegue comportamentos diferentes de entrada e saida
4. **Shorthand com 1 valor = deslocamento do bottom (cover padrao)** — `animation-range: 100px` significa iniciar a 100px do bottom e finalizar quando sair da tela, porque o padrao implicito e cover
5. **Shorthand com 2 valores = inicio e fim do deslocamento** — `animation-range: 100px 200px` inicia a 100px do bottom e finaliza a 200px do bottom

## Keywords

| Keyword | Inicia quando | Finaliza quando |
|---------|--------------|-----------------|
| `cover` | Elemento comeca a aparecer na viewport | Elemento sai completamente (padrao) |
| `contain` | Elemento esta 100% dentro da viewport | Qualquer parte sai da viewport |
| `entry` | Elemento comeca a entrar na viewport | Elemento termina de entrar |
| `exit` | Elemento comeca a sair da viewport | Elemento sai completamente |

## How to write

### Entry animation (mais intuitivo)

```css
.element {
  animation: fade linear both;
  animation-timeline: view();
  animation-range: entry;
}

@keyframes fade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Entry + Exit combinados

```css
.element {
  animation: fade linear both, out linear both;
  animation-timeline: view(), view();
  animation-range: entry, exit;
}

@keyframes fade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes out {
  to { transform: scale(1.1); opacity: 0; }
}
```

### Shorthand com deslocamento

```css
/* Inicia a 100px do bottom, finaliza ao sair da tela */
.element {
  animation-range: 100px;
}

/* Inicia a 100px do bottom, finaliza a 200px do bottom */
.element {
  animation-range: 100px 200px;
}

/* Contain + deslocamento: elemento inteiro na tela + 100px do bottom */
.element {
  animation-range: contain 100px;
}
```

### Start e End separados

```css
.element {
  animation-range-start: 10px;
  animation-range-end: 100px;
}
```

## Example

**Before (sem controle de range):**
```css
.card {
  animation: fade linear both;
  animation-timeline: view();
}
```

**After (com entry para animacao natural de entrada):**
```css
.card {
  animation: fade linear both;
  animation-timeline: view();
  animation-range: entry;
}
```

## Heuristics

| Situacao | Use |
|----------|-----|
| Elemento aparece com fade/slide ao scrollar | `entry` |
| Elemento precisa estar 100% visivel para animar | `contain` |
| Quer animacao de saida (scale out, fade out) | `exit` com keyframe separado |
| Quer entrada E saida diferentes | Duas animacoes com `entry, exit` |
| Controle preciso por pixels | Shorthand com valores numericos |
| Comportamento padrao de scroll | `cover` (ou omitir, e o padrao) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|-----------|
| Uma unica animacao para entrada e saida | Duas animacoes separadas com `animation-range: entry, exit` |
| `animation-range: exit` sem keyframe de saida dedicado | Crie um `@keyframes out` especifico para o efeito de saida |
| Adivinhar valores de pixel sem testar | Teste visualmente, cada layout tem scroll diferente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada keyword, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-futuro-das-animacoes-03/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-futuro-das-animacoes-03/references/code-examples.md)
