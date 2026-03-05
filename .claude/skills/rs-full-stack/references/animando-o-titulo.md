---
name: rs-full-stack-animando-o-titulo
description: "Applies CSS keyframe animation patterns for cycling text with bounce effects. Use when user asks to 'animate text', 'create text rotation', 'sliding title animation', 'cycle words in CSS', or 'bounce animation'. Covers keyframe timeline design, overflow hidden windowing, min-content sizing, infinite loop trick with duplicated element, and bounce micro-interactions using calc offsets. Make sure to use this skill whenever building hero section text animations or cycling word effects. Not for JS-based animations, scroll-triggered animations, or SVG animations."
---

# Animando Título com CSS Keyframes — Slide Up + Bounce

> Projete animações CSS dividindo a timeline em segmentos estáticos e transições, use overflow hidden como janela e duplique o primeiro elemento para criar loop infinito imperceptível.

## Rules

1. **Pense em timeline primeiro** — divida a duração total em segmentos proporcionais (ex: 3 palavras = ~33% cada), porque sem planejamento visual os keyframes ficam desbalanceados
2. **Use overflow hidden como janela** — a div container com altura fixa e `overflow: hidden` cria o efeito de "slot machine", porque só mostra um item por vez
3. **Use `width: min-content`** — ajusta a largura da caixa à maior palavra interna, porque evita largura fixa e se adapta ao conteúdo
4. **Duplique o primeiro elemento no final** — para criar loop infinito imperceptível, porque quando o último translate chega no elemento duplicado, o reset para 0% é invisível
5. **Separe segmentos estáticos dos de transição** — deixe gaps entre porcentagens (ex: 0-22% estático, 23-32% transição, 33-55% estático), porque o bounce precisa de espaço na timeline
6. **Bounce usa calc com offsets em pixels** — `calc(-5rem - 15px)` faz o overshoot, depois `calc(-5rem + 10px)` faz o undershoot, porque rem posiciona e px faz o micro-ajuste

## How to write

### Container com janela de overflow

```css
.hero h1 div {
  display: inline-block;
  overflow: hidden;
  height: 5rem;
  width: min-content;
  vertical-align: bottom;
}
```

### Keyframes com timeline planejada

```css
@keyframes slide-up {
  /* Palavra 1 — estática */
  0%, 22% { transform: translateY(0); }

  /* Palavra 2 — estática */
  33%, 55% { transform: translateY(-5rem); }

  /* Palavra 3 — estática */
  66%, 88% { transform: translateY(-10rem); }

  /* Volta para palavra 1 duplicada (loop invisível) */
  100% { transform: translateY(-15rem); }
}
```

### Bounce entre segmentos (ex: entrada da palavra 2)

```css
/* Overshoot — passa da posição */
23% { transform: translateY(calc(-5rem - 15px)); }
/* Undershoot — volta um pouco */
25% { transform: translateY(calc(-5rem + 10px)); }
/* Micro-overshoot */
27% { transform: translateY(calc(-5rem - 5px)); }
/* Micro-undershoot — quase estabiliza */
29% { transform: translateY(calc(-5rem + 5px)); }
/* 33% entra no segmento estático */
```

### Aplicação no span

```css
.hero h1 span {
  display: block;
  animation: slide-up 6s ease infinite;
}
```

### HTML — elemento duplicado para loop infinito

```html
<h1>Sua vida mais
  <div>
    <span>radical</span>
    <span>divertida</span>
    <span>saudável</span>
    <span>radical</span> <!-- duplicado! -->
  </div>
</h1>
```

## Example

**Before (sem bounce, sem loop infinito):**
```css
@keyframes slide-up {
  0% { transform: translateY(0); }
  33% { transform: translateY(-5rem); }
  66% { transform: translateY(-10rem); }
  100% { transform: translateY(-15rem); }
}
/* Resultado: transição abrupta, e no reset de 100%→0% aparece um "pulo" visível */
```

**After (com bounce e loop infinito):**
```css
@keyframes slide-up {
  0%, 22% { transform: translateY(0); }
  23% { transform: translateY(calc(-5rem - 15px)); }
  25% { transform: translateY(calc(-5rem + 10px)); }
  27% { transform: translateY(calc(-5rem - 5px)); }
  29% { transform: translateY(calc(-5rem + 5px)); }
  33%, 55% { transform: translateY(-5rem); }
  56% { transform: translateY(calc(-10rem - 15px)); }
  58% { transform: translateY(calc(-10rem + 10px)); }
  60% { transform: translateY(calc(-10rem - 5px)); }
  62% { transform: translateY(calc(-10rem + 5px)); }
  66%, 88% { transform: translateY(-10rem); }
  89% { transform: translateY(calc(-15rem - 15px)); }
  91% { transform: translateY(calc(-15rem + 10px)); }
  93% { transform: translateY(calc(-15rem - 5px)); }
  95% { transform: translateY(calc(-15rem + 5px)); }
  100% { transform: translateY(-15rem); }
}
/* Resultado: bounce orgânico + loop imperceptível graças ao elemento duplicado */
```

## Heuristics

| Situação | Faça |
|----------|------|
| N palavras ciclando | Divida 100% por N segmentos, duplique a primeira no final |
| Bounce parece artificial | Diminua os offsets em px (15→10→5→3) e ajuste os % gaps |
| Animação muito rápida/lenta | Altere a duração total, mantenha as % proporcionais |
| Altura do container | Use a mesma medida do `translateY` por step (ex: 5rem = 1 linha) |
| Múltiplos browsers | Use `min-content` com fallback ou prefixo se necessário |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `animation-direction: alternate` para ciclar texto | Duplique o primeiro elemento e use timeline linear |
| Largura fixa no container da palavra | `width: min-content` se adapta ao conteúdo |
| `display: inline` nos spans internos | `display: block` para que cada span ocupe uma linha |
| Bounce com `animation-timing-function: bounce` (não existe) | Keyframes manuais com calc offsets em px |
| Reset visível de 100% → 0% | Último keyframe = posição do elemento duplicado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre timeline, estratégia do loop infinito e processo de tentativa e erro
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e anotações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-animando-o-titulo/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-animando-o-titulo/references/code-examples.md)
