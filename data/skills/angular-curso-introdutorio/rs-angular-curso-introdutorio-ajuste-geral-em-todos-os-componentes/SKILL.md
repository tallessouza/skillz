---
name: rs-angular-intro-ajuste-geral-componentes
description: "Enforces CSS fine-tuning practices when adjusting Angular components with Bootstrap. Use when user asks to 'fix spacing', 'adjust padding', 'match Figma design', 'tweak component styles', or 'pixel-perfect adjustments'. Applies rules: inspect before changing, calculate compound spacing, use !important only for Bootstrap overrides, scope styles to components. Make sure to use this skill whenever doing visual polish or design-to-code alignment in Angular. Not for creating new components, layout architecture, or responsive design."
---

# Ajuste Fino de CSS em Componentes Angular

> Inspecione o valor atual no browser, calcule o espaçamento composto, e so entao aplique a correcao.

## Rules

1. **Inspecione antes de alterar** — use DevTools para medir o valor real antes de mudar, porque padding/margin de Bootstrap e elementos internos se acumulam e o valor visual difere do declarado
2. **Calcule espaçamento composto** — se o Figma mostra 24px mas um filho tem 12px de margem, aplique 12px no pai (24 - 12 = 12), porque valores se somam no box model
3. **Use !important apenas para sobrescrever Bootstrap** — classes como `.nav-link` e `.nav-item` tem estilos forcados pelo Bootstrap que so cedem com `!important`, mas nunca use em CSS proprio
4. **Escope estilos ao componente** — Angular encapsula CSS por componente, entao `margin-left` no `.nav-item` so afeta aquele componente, porque o ViewEncapsulation protege os demais
5. **Aplique font-weight explicitamente** — designs usam `font-weight: 600` em links e botoes, e o valor padrao do browser (400) nunca corresponde ao design
6. **Defina tamanho de icones via font-size** — icones de font (Bootstrap Icons, FontAwesome) respondem a `font-size`, nao `width/height`, porque sao glifos tipograficos

## How to write

### Sobrescrita de Bootstrap com escopo

```css
/* Dentro do CSS do componente Angular */
.nav-link {
  font-weight: 600;
  padding: 6px !important; /* !important necessario para sobrescrever Bootstrap */
}

.nav-item {
  cursor: pointer;
  margin-left: 18px !important;
}

.nav-item i {
  font-size: 20px;
}
```

### Calculo de espaçamento composto

```css
/* Figma mostra 24px de padding-left total */
/* Elemento filho ja tem 12px de margin-left */
/* Entao o container recebe: 24 - 12 = 12px */
.navbar {
  padding-left: 12px;
}
```

### Margem entre grupos de formulario

```css
.custom-input-group {
  margin-bottom: 20px !important;
}

.custom-button {
  font-weight: 600;
}
```

## Example

**Before (valores nao conferidos):**
```css
.navbar {
  padding-left: 32px;
  padding-right: 32px;
}
.nav-link {
  /* sem font-weight, sem padding ajustado */
}
.nav-item i {
  /* icone no tamanho padrao 16px */
}
```

**After (com inspecao e calculo):**
```css
.navbar {
  padding-left: 12px;  /* 24 - 12 de margem interna */
  padding-right: 28px; /* 48 - 20 de margem interna */
}
.nav-link {
  font-weight: 600;
  padding: 6px !important;
}
.nav-item {
  cursor: pointer;
  margin-left: 18px !important;
}
.nav-item i {
  font-size: 20px;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Valor no browser difere do Figma | Inspecione elementos filhos — margins/paddings se acumulam |
| Bootstrap ignora seu CSS | Adicione `!important` apenas nessa propriedade |
| Icone menor que o design | Use `font-size` no seletor do icone |
| Cursor nao muda em item clicavel | Adicione `cursor: pointer` no container |
| Espacamento entre form groups | Aplique `margin-bottom` no grupo, nao no input |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Chutar valores sem inspecionar | Medir com DevTools, calcular diferenca |
| `!important` em tudo | `!important` so para sobrescrever Bootstrap |
| Alterar CSS global do Bootstrap | Sobrescrever no CSS do componente Angular |
| `width/height` em icones de fonte | `font-size` no elemento do icone |
| Ignorar espacamento composto | Subtrair margins/paddings filhos do valor alvo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
