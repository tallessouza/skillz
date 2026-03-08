---
name: rs-full-stack-componente-de-botao-parte-2
description: "Applies CSS gradient border and gradient text techniques for secondary button components. Use when user asks to 'create a gradient button', 'style a secondary button', 'make gradient text CSS', 'gradient border effect', or 'background-clip text'. Covers aria-label as content source via CSS attr(), pseudo-elements for layered effects, and inset positioning. Make sure to use this skill whenever building buttons with gradient borders or gradient text in CSS. Not for primary button styling, JavaScript button logic, or accessibility auditing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [css, gradient, button, background-clip, pseudo-elements, aria-label]
---

# Componente de Botao Secundario — CSS Gradient Border e Texto

> Para botoes com degradê na borda e no texto, use pseudo-elementos (::before e ::after) com background-clip: text e inset para simular bordas gradientes.

## Rules

1. **Remova o conteudo textual do botao secundario** — use `aria-label` para acessibilidade e `content: attr(aria-label)` no `::after`, porque CSS nao consegue aplicar gradient clip em texto inline diretamente
2. **Use aria-label, nao arial-label** — o atributo correto e `aria-label` (acessibilidade ARIA), porque `arial-label` nao existe e leitores de tela ignoram
3. **Aplique background-clip com vendor prefix** — use `-webkit-background-clip: text` E `background-clip: text` juntos, porque sem o prefixo WebKit nao funciona em todos os motores
4. **Color transparent e obrigatorio com background-clip text** — sem `color: transparent` o texto nao revela o gradiente por tras
5. **Use ::before para simular borda gradiente** — posicione absoluto com `inset` ligeiramente maior que 0 para deixar o gradiente aparecer como borda, porque CSS nao suporta border-image com border-radius
6. **Fundo fixo no ::before, nao transparente** — o fundo interno precisa ser opaco (cor do background do projeto) para esconder o gradiente exceto na borda, porque transparencia revelaria todo o gradiente

## How to write

### Botao secundario com aria-label

```css
.btn[aria-label] {
  position: relative;

  &::after {
    content: attr(aria-label);
    background: var(--btn-bg-color);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    position: relative;
    z-index: 1;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0.093rem;
    background-color: var(--bg-color);
    border: inherit;
    border-radius: inherit;
  }
}
```

### HTML do botao secundario

```html
<!-- Correto: sem texto interno, aria-label carrega o label -->
<button class="btn" aria-label="Saiba mais"></button>

<!-- Errado: texto interno conflita com a estrategia -->
<button class="btn" aria-label="Saiba mais">Saiba mais</button>
```

## Example

**Before (tentativa ingenua de gradient border):**
```css
.btn-secondary {
  border: 2px solid;
  border-image: linear-gradient(to right, #ff0, #f0f) 1;
  /* Quebra com border-radius */
  background: linear-gradient(to right, #ff0, #f0f);
  -webkit-background-clip: text;
  /* Texto some porque fundo tambem e gradiente */
}
```

**After (com esta estrategia de pseudo-elementos):**
```css
.btn[aria-label] {
  position: relative;

  &::after {
    content: attr(aria-label);
    background: var(--btn-bg-color);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    position: relative;
    z-index: 1;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0.093rem; /* ~1.5px — deixa o gradiente aparecer como borda */
    background-color: var(--bg-color);
    border: inherit;
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Botao com gradient apenas no texto | `::after` com `attr()` + `background-clip: text` + `color: transparent` |
| Botao com gradient na borda E no texto | `::before` (fundo opaco + inset) + `::after` (texto gradiente) |
| Borda fina (1-2px) | Use pixels diretamente no `inset`, conversao para rem e desnecessaria |
| Fundo da pagina muda | Atualize `var(--bg-color)` no `::before` para combinar |
| Botao precisa de acessibilidade | `aria-label` no HTML, nunca `arial-label` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `arial-label="texto"` | `aria-label="texto"` |
| `background-clip: text` sem `-webkit-` | `-webkit-background-clip: text; background-clip: text;` |
| `background-clip: text` sem `color: transparent` | Adicione `color: transparent` sempre |
| Texto dentro do `<button>` + aria-label | `<button aria-label="texto"></button>` sem conteudo |
| `inset: 0` esperando borda visivel | `inset: 0.093rem` (ou 1.5px) para revelar gradiente |
| `background: transparent` no ::before | `background-color: var(--bg-color)` opaco |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Texto gradiente nao aparece | Faltou `color: transparent` junto com `background-clip: text` | Adicione `color: transparent` ao elemento com background-clip |
| `background-clip: text` nao funciona no Chrome | Faltou vendor prefix `-webkit-` | Adicione `-webkit-background-clip: text` antes de `background-clip: text` |
| Borda gradiente nao visivel | `inset: 0` no `::before` cobre todo o gradiente | Use `inset: 0.093rem` para deixar o gradiente aparecer como borda |
| Texto do botao vazio | Conteudo via `attr(aria-label)` mas atributo esta como `arial-label` | Corrija o typo: use `aria-label`, nao `arial-label` |
| `::before` cobre o texto | z-index nao configurado corretamente | Adicione `z-index: 1` ao `::after` e `position: relative` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que pseudo-elementos sao necessarios e limitacoes do CSS atual
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes