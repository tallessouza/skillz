---
name: rs-full-stack-ajustes-finais-5
description: "Enforces a final review checklist for CSS layout projects before commit. Use when user says 'review my layout', 'final adjustments', 'polish the CSS', 'prepare for commit', or 'check before publishing'. Applies rules: verify font consistency across sections, fix image sizing with object-fit and border-radius, ensure visual consistency with design specs. Make sure to use this skill whenever finishing a CSS/HTML project or preparing a layout for deployment. Not for responsive design breakpoints, JavaScript functionality, or backend deployment."
---

# Ajustes Finais em Projetos CSS

> Antes de comitar, revise cada seção do layout comparando com o design — detalhes sempre escapam na primeira passada.

## Rules

1. **Revise tipografia seção por seção** — compare font-size, line-height e font-family de cada bloco com o design, porque inconsistências tipográficas são os erros mais comuns que passam despercebidos
2. **Defina dimensões explícitas em imagens de perfil/destaque** — use width, height, object-fit: cover e border-radius, porque imagens sem dimensões fixas distorcem em telas diferentes
3. **Use variáveis CSS quando existirem** — aplique `var(--font-family)` ao invés de valores hardcoded, porque mantém consistência e facilita manutenção
4. **Faça revisão visual em tamanho reduzido** — mesmo sem responsividade completa, reduzir a janela revela problemas de sizing e overflow

## Steps

### Step 1: Revisar tipografia contra o design

Abra o design (Figma, etc.) e compare cada seção:

```css
/* Exemplo: footer com tipografia inconsistente */
footer {
  font-family: var(--font-family);
  font-size: 14px;
  line-height: 150%;
}
```

Verifique: font-size, line-height, font-weight e font-family em headers, body, footer, cards.

### Step 2: Corrigir imagens sem dimensões fixas

```css
.profile-image {
  width: 176px;
  height: 176px;
  object-fit: cover;      /* Mantém proporção mesmo se imagem não for quadrada */
  border-radius: 50%;     /* Arredondamento circular */
}
```

### Step 3: Verificação visual rápida

Reduza a janela do navegador e observe:
- Imagens que crescem/distorcem
- Textos que quebram de forma estranha
- Elementos que transbordam

### Step 4: Commit e publicação

```bash
git add .
git commit -m "final project"
git push
```

## Checklist de revisão

| Item | Verificar |
|------|-----------|
| Footer | font-size, line-height, font-family consistentes com design |
| Imagens de perfil | width/height fixos, object-fit: cover, border-radius |
| Variáveis CSS | Valores repetidos usando var() |
| Tela reduzida | Nenhuma distorção grave visível |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| Imagem sem width/height definidos | `width: 176px; height: 176px;` |
| Imagem de perfil sem object-fit | `object-fit: cover` para manter proporção |
| Imagem circular sem border-radius | `border-radius: 50%` |
| Font-family hardcoded quando há variável | `font-family: var(--font-family)` |
| Comitar sem revisão visual | Reduzir janela e verificar cada seção |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que detalhes escapam e como criar hábito de revisão
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código da aula com variações