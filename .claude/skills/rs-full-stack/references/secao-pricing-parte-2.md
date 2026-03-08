---
name: rs-full-stack-secao-pricing-parte-2
description: "Applies CSS gradient border techniques and premium card styling when building pricing sections or card components. Use when user asks to 'create a pricing card', 'add gradient border', 'style a premium card', 'build pricing section', or 'CSS card with decorative border'. Covers pseudo-element gradient borders, list styling with background icons, and CSS cascade for component overrides. Make sure to use this skill whenever styling pricing or plan comparison cards. Not for JavaScript logic, payment integration, or responsive breakpoints."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: "CSS Gradient Borders"
  tags: ['css', 'gradients', 'borders', 'pseudo-elements', 'pricing-cards']
---

# Estilizacao de Pricing Cards com Bordas Degradê

> Bordas degradê em CSS exigem um pseudo-elemento posicionado atras do card — nao existe `border-image` confiavel para border-radius.

## Rules

1. **Use pseudo-element para borda degradê** — crie um `::before` com `linear-gradient` como background, `position: absolute`, `inset: 0`, `z-index: -1`, e `border-radius` igual ao card, porque CSS nao suporta `border` com gradient e border-radius simultaneamente
2. **Card pai precisa de padding para revelar o pseudo-element** — aplique `padding: 2px` no container premium para que o elemento de baixo apareca como borda, porque sem esse gap o pseudo-element fica totalmente coberto
3. **Listas com icone usam background-image, nao img tag** — coloque o check como `background: url(assets/icons/check.svg) no-repeat` com `padding-left: 2rem`, porque mantem a lista semantica e o icone como decoracao
4. **Respeite a cascata para overrides locais** — defina estilos base globalmente e sobrescreva em contexto especifico (ex: botao MD dentro de pricing), porque a especificidade do seletor mais proximo vence
5. **Extraia valores do Figma com copy CSS** — clique direito no elemento, Copy/Paste > Copy CSS para obter font-size, font-weight, letter-spacing e cores reais, porque evita "chutar" valores

## How to write

### Borda degradê com pseudo-element

```css
.premium {
  position: relative;
  padding: 2px; /* revela o pseudo-element como borda */
}

.premium::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: linear-gradient(90deg, var(--brand-color-secondary) 0%, var(--brand-color-primary) 100%);
  border-radius: 1.5rem;
  z-index: -1;
}
```

### Lista com icone de check via background

```css
.card li {
  color: var(--text-color-secondary);
  background: url(assets/icons/check.svg) no-repeat;
  padding-left: 2rem;
}
```

### Badge premium com gradient e cantos seletivos

```css
.premium span:first-child {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.75rem 2rem;
  background: linear-gradient(90deg, var(--brand-color-secondary) 0%, var(--brand-color-primary) 100%);
  border-top-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

## Example

**Before (tentando border com gradient — nao funciona com radius):**
```css
.premium .card {
  border: 2px solid;
  border-image: linear-gradient(90deg, purple, blue) 1;
  border-radius: 1.5rem; /* IGNORADO quando border-image esta ativo */
}
```

**After (pseudo-element revelado pelo padding):**
```css
.premium {
  position: relative;
  padding: 2px;
}
.premium::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--brand-color-secondary), var(--brand-color-primary));
  border-radius: 1.5rem;
  z-index: -1;
}
.premium .card {
  background: var(--bg-color);
  border-radius: 1.5rem;
  padding-top: 4.25rem;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Borda degradê com border-radius | Pseudo-element atras + padding no pai |
| Icone decorativo em lista | `background-image` no `li`, nao `<img>` |
| Badge posicionado no canto do card | `position: absolute` + `top: 0; left: 0` com pai `relative` |
| Alinhamento entre cards de tamanhos diferentes | Ajuste `margin-block` de separadores e `padding-bottom` |
| Override de estilo em contexto especifico | Seletor mais especifico na media query, sem `!important` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `border-image` com `border-radius` | Pseudo-element `::before` com gradient background |
| `<img src="check.svg">` dentro de cada `<li>` | `background: url(check.svg) no-repeat` + `padding-left` |
| `!important` para override de botao em pricing | Seletor mais especifico: `.pricing .btn { ... }` |
| `z-index: 999` no card | `z-index: -1` no pseudo-element |
| Chutar valores de font/spacing | Extrair do Figma com Copy CSS |

## Troubleshooting

| Sintoma | Causa provavel | Solucao |
|---------|---------------|---------|
| Borda degradê nao aparece com border-radius | Usando `border-image` que ignora `border-radius` | Use pseudo-element `::before` com `linear-gradient` como background |
| Pseudo-element nao visivel | Card sem `padding` para revelar o pseudo-element | Adicione `padding: 2px` no container premium |
| Pseudo-element sobrepoe conteudo | `z-index` incorreto ou ausente | Defina `z-index: -1` no `::before` |
| Icone de check aparece como imagem quebrada | Usando `<img>` tag dentro do `<li>` | Use `background: url(check.svg) no-repeat` com `padding-left` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre tecnica de borda degradê, analogia do livro, e cascata CSS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-secao-pricing-parte-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-secao-pricing-parte-2/references/code-examples.md)
