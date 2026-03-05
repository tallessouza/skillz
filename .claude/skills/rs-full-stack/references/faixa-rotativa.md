---
name: rs-full-stack-faixa-rotativa
description: "Applies infinite CSS scroll banner and animated gradient background techniques when building landing pages or marketing sections. Use when user asks to 'create a rotating banner', 'infinite scroll text', 'marquee effect', 'animated background gradient', or 'CSS-only infinite loop animation'. Enforces the duplication-based infinite scroll pattern with translateX keyframes and background-size trick for gradient animation. Make sure to use this skill whenever creating decorative scrolling banners or animated gradients without JavaScript. Not for JavaScript-based carousels, sliders with navigation, or scroll-triggered animations."
---

# Faixa Rotativa CSS — Banner Infinito + Gradiente Animado

> Crie efeitos de scroll infinito e gradientes animados usando apenas CSS, sem JavaScript.

## Rules

1. **Use estrutura de 3 camadas: banner > scroller > rolling** — banner define limites e overflow hidden, scroller contém, rolling se move, porque cada camada tem responsabilidade clara de contenção e animação
2. **Duplique elementos manualmente até preencher a viewport** — sem JS, a unica forma de simular loop infinito é ter copias suficientes para que o reset da animação seja imperceptível
3. **Calcule o translateX pelo tamanho exato do elemento + gap** — o valor deve ser negativo do width de UM bloco + gap para que a transição pareça contínua, porque qualquer pixel errado causa "pulo" visível
4. **Use animation linear infinite para scroll** — linear garante velocidade constante sem aceleração, infinite garante loop eterno
5. **Para animar gradientes, aumente background-size para 400%** — sem tamanho maior que o container, background-position não tem espaço para se mover
6. **Use background-position com ponto médio a 50%** — no keyframe de 50%, mova position para 100% e deixe o eixo Y fixo, criando efeito de ida-e-volta suave

## How to write

### Estrutura HTML

```html
<section class="banner bg-gradient-animate">
  <div class="scroller">
    <div class="rolling">
      <img src="assets/banner.svg" alt="" />
      <img src="assets/banner.svg" alt="" />
      <img src="assets/banner.svg" alt="" />
      <!-- Duplicar até preencher viewport sem gaps visíveis -->
      <img src="assets/banner.svg" alt="" />
    </div>
  </div>
</section>
```

### Banner infinito com translateX

```css
.banner {
  width: 100%;
  padding-block: 2.5rem;
  overflow: hidden;
}

.scroller {
  width: 100%;
  overflow: hidden;
  padding-block: 1rem;
}

.rolling {
  display: flex;
  gap: 1.5rem;
  animation: rolling 2s linear infinite;
}

@keyframes rolling {
  to {
    transform: translateX(-132px);
    /* Valor = largura de 1 bloco + gap.
       Ajuste fino: teste visualmente até o "pulo" desaparecer */
  }
}
```

### Gradiente de fundo animado

```css
.bg-gradient-animate {
  background: linear-gradient(
    45deg,
    var(--snap-light-sky-light),
    var(--snap-tap-joy-light)
  );
  background-size: 400%;
  background-position: 50% 50%;
  animation: bg-gradient 20s ease infinite;
}

@keyframes bg-gradient {
  50% {
    background-position: 100% 50%;
  }
}
```

## Example

**Before (gradiente estático, banner parado):**
```css
.banner {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
}
.rolling img {
  display: inline-block;
}
```

**After (com animações aplicadas):**
```css
.banner {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  background-size: 400%;
  background-position: 50% 50%;
  animation: bg-gradient 20s ease infinite;
  overflow: hidden;
  padding-block: 2.5rem;
}

.rolling {
  display: flex;
  gap: 1.5rem;
  animation: rolling 2s linear infinite;
}

@keyframes rolling {
  to { transform: translateX(-132px); }
}

@keyframes bg-gradient {
  50% { background-position: 100% 50%; }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Scroll parece dar "pulo" no reset | Ajuste translateX em ±1-2px até ficar suave |
| Poucos elementos, gaps visíveis | Duplique mais cópias do SVG/imagem |
| Gradiente não anima | Verifique se background-size > 100% |
| Animação de gradiente muito rápida | Aumente duração (20s+ para efeito sutil) |
| Precisa de scroll infinito robusto | Use JavaScript para duplicar elementos dinamicamente |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| `animation: rolling 2s ease infinite` | `animation: rolling 2s linear infinite` — ease causa aceleração visível no loop |
| `background-size: 100%` com animação de position | `background-size: 400%` — sem espaço extra, position não tem pra onde ir |
| Uma única cópia do elemento no rolling | Múltiplas cópias até preencher viewport + margem |
| `overflow: visible` no banner | `overflow: hidden` — conteúdo duplicado nunca pode transbordar |
| Usar JS pra este efeito simples em LP | CSS puro com keyframes — zero dependências |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre cálculo do translateX, por que 400% no background-size, e trade-offs CSS vs JS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e anotações passo a passo

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-faixa-rotativa/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-faixa-rotativa/references/code-examples.md)
