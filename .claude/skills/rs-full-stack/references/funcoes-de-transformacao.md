---
name: rs-full-stack-funcoes-de-transformacao
description: "Applies CSS transform functions correctly when writing styles for movement, rotation, and scaling. Use when user asks to 'move an element', 'rotate', 'scale', 'animate', 'transform CSS', or any layout/visual effect task. Enforces correct transform order, proper axis usage, and combined transforms. Make sure to use this skill whenever generating CSS transforms or animations. Not for JavaScript animations, SVG transforms, or 3D transform functions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-functions
  tags: [css, transform, translate, rotate, scale, animation]
---

# Funções de Transformação CSS

> Ao usar transform, aplique as funções na ordem correta porque a sequência altera o resultado final.

## Rules

1. **Respeite a ordem das funções** — `translate` antes de `rotate` produz resultado diferente de `rotate` antes de `translate`, porque cada função opera sobre o sistema de coordenadas já transformado pela anterior
2. **Use a função de eixo específica quando possível** — `translateX()`, `translateY()` em vez de `translate()` com um só valor, porque explicita a intenção
3. **Use a unidade correta para cada função** — `translate` usa px/rem/%, `rotate` usa `deg`/`turn`, `scale` usa número sem unidade, porque unidades erradas falham silenciosamente
4. **Combine transforms numa única propriedade** — múltiplas declarações `transform` sobrescrevem, não acumulam, porque CSS usa cascade
5. **Valores negativos invertem a direção** — `translateY(-10px)` move para cima, porque o eixo Y cresce para baixo no CSS

## How to write

### Translate (movimentação)

```css
/* Eixo específico */
.move-right { transform: translateX(100px); }
.move-up { transform: translateY(-50px); }

/* Ambos os eixos: X primeiro, Y segundo */
.move-diagonal { transform: translate(200px, 100px); }
```

### Rotate (rotação)

```css
.tilted { transform: rotate(40deg); }
```

### Scale (escala)

```css
.doubled { transform: scale(2); }
.tripled { transform: scale(3); }
```

### Combinando transforms

```css
/* Ordem importa: translate → rotate → scale */
.combined {
  transform: translateX(200px) rotate(40deg) scale(2);
}
```

## Example

**Before (erro comum — transforms sobrescritos):**

```css
.box {
  transform: translateX(100px);
  transform: rotate(45deg); /* sobrescreve o translate! */
}
```

**After (com esta skill aplicada):**

```css
.box {
  transform: translateX(100px) rotate(45deg);
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Mover elemento sem afetar layout | Use `transform: translate()` em vez de `margin`/`position` |
| Combinar movimento + rotação | Coloque `translate` antes de `rotate` para mover na posição original |
| Escalar a partir do centro | `scale()` já escala do centro por padrão (controlável com `transform-origin`) |
| Valor negativo em translate | Inverte direção: X negativo = esquerda, Y negativo = cima |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Duas declarações `transform` separadas | Uma declaração com funções combinadas |
| `rotate(40)` sem unidade | `rotate(40deg)` |
| `scale(2px)` com unidade | `scale(2)` sem unidade |
| `translate(100px)` para mover só no X | `translateX(100px)` explicitando o eixo |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Transform nao funciona ou e ignorado | Duas declaracoes `transform` separadas — a segunda sobrescreve | Combine tudo numa unica propriedade: `transform: translateX(100px) rotate(45deg)` |
| Elemento se move para direcao errada | Eixo Y no CSS cresce para baixo | Use valores negativos para mover para cima: `translateY(-10px)` |
| `scale` nao funciona | Unidade adicionada ao valor | `scale` nao aceita unidade: use `scale(2)` e nao `scale(2px)` |
| Rotacao parece errada apos translate | Ordem das funcoes altera o resultado | Coloque `translate` antes de `rotate` para mover na posicao original |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre ordem de transforms e sistema de coordenadas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações