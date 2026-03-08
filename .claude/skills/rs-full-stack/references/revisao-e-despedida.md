---
name: rs-full-stack-revisao-e-despedida
description: "Enforces CSS animation and transition best practices when writing stylesheets. Use when user asks to 'add animation', 'create transition', 'animate element', 'make it move', or any CSS motion task. Applies rules: keyframes-first workflow, Animation Timeline awareness, prefers-reduced-motion for accessibility, moderation over excess. Make sure to use this skill whenever generating CSS animations or transitions. Not for JavaScript animation libraries, SVG animations, or Canvas."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: "CSS Animations"
  tags: ['css', 'animations', 'transitions', 'accessibility', 'keyframes']
---

# CSS Animations & Transitions — Boas Práticas

> Animações melhoram a experiência quando aplicadas com clareza e moderação — cada movimento deve ter propósito.

## Rules

1. **Crie o keyframe primeiro, aplique depois** — defina `@keyframes` com início e fim claros, depois associe via `animation-name` no seletor, porque separar definição de uso mantém o código organizado e reutilizável
2. **Pense em linha do tempo** — toda animação tem início e fim; use pontos intermediários (`0%`, `50%`, `100%`) apenas quando a complexidade justificar, porque keyframes simples são mais performáticos e legíveis
3. **Use prefers-reduced-motion sempre** — envolva animações com `@media (prefers-reduced-motion: reduce)` para desabilitar ou suavizar movimentos, porque acessibilidade não é opcional
4. **Modere as animações** — qualquer movimento pequeno já causa impacto positivo; excesso de animação prejudica UX, porque o objetivo é dar vida, não distrair
5. **Prefira CSS puro antes de JavaScript** — transitions e animations nativas são GPU-accelerated e mais performáticas, porque bibliotecas JS adicionam bundle size e complexidade desnecessária para casos simples
6. **Misture propriedades com intenção** — CSS é como fórmula química: combinar `transform`, `opacity`, `filter` cria efeitos complexos, mas cada combinação impacta performance diferentemente

## How to write

### Workflow: keyframe primeiro, uso depois

```css
/* 1. Defina o keyframe */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 2. Aplique onde quiser */
.card {
  animation: fade-in 0.3s ease-out;
}
```

### Acessibilidade obrigatória

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Transição simples (preferir para estados)

```css
.button {
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.button:hover {
  background-color: var(--primary-hover);
  transform: scale(1.02);
}
```

## Example

**Before (excesso, sem acessibilidade):**
```css
.hero {
  animation: bounce 1s infinite, pulse 2s infinite, shake 0.5s infinite;
}
```

**After (com moderação e acessibilidade):**
```css
.hero {
  animation: fade-in 0.4s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .hero {
    animation: none;
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Elemento aparece na tela | `fade-in` sutil (0.2-0.4s) |
| Mudança de estado (hover, focus) | `transition` em vez de `animation` |
| Movimento contínuo/loop | Questione se é realmente necessário |
| Animação complexa multi-etapa | Use keyframes com pontos intermediários |
| Scroll-driven animation | Animation Timeline (`scroll()`, `view()`) — futuro, verificar suporte |
| Qualquer animação | Sempre incluir `prefers-reduced-motion` |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `animation: bounce 1s infinite` em tudo | Animação sutil, finita, com propósito |
| Animar sem `prefers-reduced-motion` | Sempre incluir media query de acessibilidade |
| Animar `width`/`height`/`top`/`left` | Animar `transform` e `opacity` (GPU-accelerated) |
| Múltiplas animações simultâneas no mesmo elemento | Uma animação composta bem planejada |
| Usar JS para o que CSS transitions resolvem | CSS primeiro, JS quando precisar de controle dinâmico |

## Troubleshooting

| Sintoma | Causa provavel | Solucao |
|---------|---------------|---------|
| Animacao nao aparece | `animation-name` nao corresponde ao `@keyframes` | Verifique que o nome no `animation:` bate com o `@keyframes` definido |
| Animacao causa jank/travamento | Animando propriedades que causam layout (width, height, top) | Anime apenas `transform` e `opacity` que sao GPU-accelerated |
| Usuario com sensibilidade a movimento afetado | Falta `prefers-reduced-motion` | Adicione `@media (prefers-reduced-motion: reduce)` desabilitando animacoes |
| Transicao nao funciona no hover | Propriedade `transition` declarada no estado `:hover` | Declare `transition` no estado base do elemento, nao no `:hover` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-revisao-e-despedida/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-revisao-e-despedida/references/code-examples.md)
