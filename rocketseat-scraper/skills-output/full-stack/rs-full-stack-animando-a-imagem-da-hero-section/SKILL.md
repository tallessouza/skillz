---
name: rs-full-stack-animando-imagem-hero
description: "Applies CSS keyframe animation patterns for hero section image entries with coordinated delays, translateX slides, opacity fades, and overshoot effects. Use when user asks to 'animate hero section', 'create entry animation', 'slide-in animation', 'coordinate multiple animations', or 'animate landing page elements'. Make sure to use this skill whenever building hero sections with multiple animated elements entering sequentially. Not for scroll-triggered animations, JavaScript animations, or CSS hover/focus transitions."
---

# Animacao de Entrada da Hero Section

> Coordene multiplos elementos com keyframes, delays e overflow hidden para criar animacoes de entrada sequenciais e fluidas.

## Rules

1. **Use overflow hidden no container** — impede que elementos fora da caixa sejam visiveis durante o translateX, porque sem isso os elementos aparecem fora do viewport antes de animar
2. **Posicione elementos com position absolute dentro de position relative** — permite empilhar e sobrepor elementos livremente, porque cada imagem precisa de posicionamento independente
3. **Controle ordem visual com z-index** — elemento principal (ex: patins) fica acima (z-index: 1), decorativos abaixo (z-index: 0), porque define qual elemento "passa por cima" visualmente
4. **Use animation-delay para sequenciar entradas** — cada elemento entra com delay diferente criando cascata, porque entrada simultanea perde o efeito cinematografico
5. **Use animation-fill-mode forwards** — mantem o estado final da animacao (100%) apos completar, porque sem forwards o elemento volta ao estado inicial
6. **Combine duas animacoes no mesmo elemento quando necessario** — slideIn + appear (opacidade) separados por virgula, porque cada propriedade pode ter timing diferente

## How to write

### Container com overflow hidden

```css
.hero > div:nth-child(2) {
  display: block;
  width: 100%;
  max-width: 30.5rem;
  height: 30.5rem;
  overflow: hidden; /* esconde elementos fora da caixa durante animacao */
}

.hero .content {
  width: 100%;
  height: 100%;
  position: relative; /* ancora para position absolute dos filhos */
}

.hero .content img {
  position: absolute;
  width: 100%;
}
```

### Keyframe slide-in com overshoot

```css
@keyframes slideIn {
  50% {
    transform: translateX(-20px); /* passa um pouco do ponto final */
  }
  100% {
    transform: translateX(0); /* retorna ao destino */
  }
}

@keyframes appear {
  to {
    opacity: 1;
  }
}
```

### Sequenciamento com delays

```css
/* Elemento principal: entra primeiro */
.patins {
  transform: translateX(200%);
  z-index: 1;
  animation: slideIn 3s ease forwards;
}

/* Fundo: entra com pequeno atraso */
.elipse {
  transform: translateX(200%);
  animation: slideIn 3s 200ms ease forwards;
}

/* Decorativo: entra atras do principal com opacidade */
.stars-1 {
  transform: translateX(400%);
  opacity: 0;
  animation: slideIn 2s 800ms ease forwards,
             appear 100ms 800ms both;
}

/* Segundo decorativo: ultimo a entrar */
.stars-2 {
  transform: translateX(400px);
  animation: slideIn 2.2s 800ms ease forwards;
}
```

## Example

**Before (elementos sem animacao):**
```css
.hero-image img {
  position: absolute;
}
```

**After (entrada coordenada com cascata):**
```css
.hero-image {
  overflow: hidden;
  max-width: 30.5rem;
  height: 30.5rem;
}

.hero-image .content {
  width: 100%;
  height: 100%;
  position: relative;
}

.hero-image .elipse {
  width: 94%;
  top: 3%;
  left: 3%;
  transform: translateX(200%);
  animation: slideIn 3s 200ms ease forwards;
}

.hero-image .patins {
  z-index: 1;
  transform: translateX(200%);
  animation: slideIn 3s ease forwards;
}

.hero-image .stars-1 {
  max-width: 5.5rem;
  top: 30%;
  z-index: 0;
  opacity: 0;
  transform: translateX(400%);
  animation: slideIn 2s 800ms ease forwards,
             appear 100ms 800ms both;
}

.hero-image .stars-2 {
  max-width: 2.5rem;
  right: 0;
  bottom: 35%;
  transform: translateX(400px);
  animation: slideIn 2.2s 800ms ease forwards;
}

@keyframes slideIn {
  50% {
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes appear {
  to {
    opacity: 1;
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elemento deve entrar deslizando | `translateX(200%)` inicial + keyframe para `translateX(0)` |
| Elemento deve aparecer gradualmente | Combine `opacity: 0` com keyframe `appear` separado |
| Elemento deve ultrapassar o destino e voltar | Use `50% { translateX(-20px) }` no keyframe |
| Varios elementos entram em sequencia | Use `animation-delay` crescente (0, 200ms, 800ms...) |
| Elemento nao deve ser visivel fora do container | `overflow: hidden` no container pai |
| Animacao deve manter estado final | `animation-fill-mode: forwards` |
| Elemento decorativo entra atras do principal | `translateX(400%)` (mais longe) + delay maior |
| Secao hero no mobile | `flex-direction: column-reverse` inverte ordem visual |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Animar sem overflow hidden no container | Sempre `overflow: hidden` para esconder estado inicial |
| Todos os elementos com mesmo delay | Delays escalonados para efeito cascata |
| Usar `animation-fill-mode: none` com translateX inicial | Use `forwards` para manter posicao final |
| Colocar keyframe 0% com translateX grande | Defina translateX no proprio elemento, keyframe so define 50% e 100% |
| Mesma duracao para todos os elementos | Varie duracao (2s, 2.2s, 3s) para naturalidade |
| `display: none` para esconder antes da animacao | Use `opacity: 0` + `translateX` para esconder mantendo espaco |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre overflow hidden, fill-mode, overshoot e sequenciamento
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes