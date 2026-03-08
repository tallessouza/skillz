---
name: rs-full-stack-layout-shift-fix
description: "Resolves CSS layout shift caused by border changes on focus/hover states. Use when user reports 'layout jumping', 'elements moving on click', 'border causing shift', 'layout shift', or 'content jumping when focused'. Applies outline-as-border technique: set border at final size with transparent color, swap color on state change. Make sure to use this skill whenever fixing interactive element borders that change size on focus or hover. Not for animations, transitions, scroll-based layout shifts, or CLS performance metrics."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [css, layout-shift, border, outline, focus, hover]
---

# Corrigir Layout Shift por Bordas

> Definir bordas no tamanho final com cor transparente e trocar apenas a cor no estado interativo, eliminando saltos de layout.

## Rules

1. **Nunca mude a largura da borda entre estados** — `border: 2px solid transparent` no estado base, `border-color: #cor` no `:focus`, porque 1px a mais em cima e embaixo empurra todo o conteúdo abaixo
2. **Use outline como borda quando necessário** — outline não ocupa espaço no box model, então mudanças de outline nunca causam layout shift
3. **Defina o tamanho final desde o início** — se o `:focus` terá `2px`, o estado base já deve ter `2px` (transparente), porque o navegador reserva o espaço desde a renderização inicial
4. **No hover de áreas com borda dashed** — mesma técnica: `border: 2px dashed transparent` no base, trocar cor no `:hover`, e `outline-width: 0` para remover outline padrão

## How to write

### Input com borda que muda no focus

```css
/* Estado base: borda já no tamanho final, transparente */
input {
  border: 2px solid transparent;
}

/* Focus: apenas troca a cor */
input:focus {
  border-color: #1a73e8;
}
```

### Área de drop com borda dashed no hover

```css
.drop-area {
  border: 2px dashed transparent;
}

.drop-area:hover {
  border-color: #1a73e8;
  outline-width: 0;
}
```

## Example

**Before (causa layout shift):**

```css
input {
  border: 1px solid #ccc;
}

input:focus {
  border: 2px solid #1a73e8;
  outline: none;
}
```

**After (sem layout shift):**

```css
input {
  border: 2px solid transparent;
}

input:focus {
  border-color: #1a73e8;
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| Borda muda de 1px para 2px no focus | Fixar 2px transparent no base, trocar cor no focus |
| Outline padrão do browser incomoda | Substituir por border transparente no tamanho desejado |
| Área com borda dashed no hover | Mesmo padrão: dashed transparent no base |
| Múltiplos elementos em sequência vertical | Prioridade máxima — shift acumula e fica muito visível |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `border: 1px` base → `border: 2px` focus | `border: 2px transparent` base → `border-color` focus |
| `outline: none` sem compensação | `outline-width: 0` + border transparente pré-definida |
| Trocar `border-width` no `:hover` | Trocar apenas `border-color` no `:hover` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Elementos saltam ao focar no input | Borda muda de tamanho entre estados | Defina borda no tamanho final com `transparent` e troque so a cor |
| Layout shift acumula em listas verticais | Cada item ganha pixels extras que empurram os abaixo | Aplique `border: 2px solid transparent` no estado base |
| Outline padrao do browser aparece junto com borda | Outline nao removido | Adicione `outline-width: 0` no estado interativo |
| Borda dashed some ao tirar o hover | Cor volta para `transparent` | Comportamento esperado — a borda some visualmente mas o espaco permanece |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre box model, outline vs border, e por que layout shift acontece
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações