---
name: rs-full-stack-font-size-1
description: "Applies CSS font-size best practices when writing stylesheets or component styles. Use when user asks to 'style text', 'change font size', 'set typography', 'create CSS', or 'adjust text size'. Enforces correct use of rem, em, px, and percentage units with clear reasoning for each choice. Make sure to use this skill whenever generating CSS that involves text sizing, even if the user doesn't mention font-size. Not for layout spacing, box model, or non-typography CSS properties."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-tipografia
  tags: [css, font-size, rem, em, px, typography, units]
---

# Font Size no CSS

> Escolha a unidade de font-size com intencao: rem para consistencia global, em para escala relativa ao pai, px para valores fixos, e porcentagem para proporcionalidade.

## Rules

1. **Use `rem` como unidade padrao** — `1rem` = 16px (valor padrao do root element), porque rem ignora o contexto do pai e garante consistencia em todo o documento
2. **Use `em` quando o tamanho deve escalar com o pai** — `1em` busca o font-size do elemento pai e sobe a arvore ate o root se nao encontrar, porque permite componentes que se adaptam ao contexto
3. **Use `px` apenas para valores que devem ser fixos** — pixels nao escalam com preferencias do usuario, porque quebram acessibilidade quando o usuario aumenta o tamanho base do navegador
4. **Use `%` para proporcionalidade ao pai** — `100%` = tamanho do pai, `120%` = 20% maior que o pai, porque funciona como `em` mas com semantica de proporcao
5. **Evite os nomes absolutos em producao** — `xsmall`, `small`, `large`, `x-large` existem mas nao dao controle preciso, porque voce nao sabe o tamanho exato resultante
6. **Lembre que o root element tem font-size 16px por padrao** — todo calculo de rem e em parte desse valor base, porque `2rem` = 32px, `0.5rem` = 8px

## How to write

### Tipografia com rem (padrao recomendado)

```css
/* rem vai direto ao root element, ignorando o pai */
h1 { font-size: 2rem; }      /* 32px */
h2 { font-size: 1.5rem; }    /* 24px */
p  { font-size: 1rem; }      /* 16px */
small { font-size: 0.875rem; } /* 14px */
```

### Escala relativa com em

```css
/* em busca o font-size do pai, subindo a arvore ate o root */
.card { font-size: 1.2em; }
.card .label { font-size: 0.8em; } /* 0.8 * 1.2 = 0.96 do root */
```

### Porcentagem

```css
/* porcentagem relativa ao pai, como em mas com semantica de proporcao */
.highlight { font-size: 120%; }
.footnote  { font-size: 80%; }
```

## Example

**Before (sem intencao clara):**
```css
h1 { font-size: large; }
p  { font-size: 14px; }
.note { font-size: small; }
```

**After (com unidades intencionais):**
```css
h1 { font-size: 2rem; }
p  { font-size: 0.875rem; }
.note { font-size: 0.75rem; }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tipografia geral do site | Use `rem` para consistencia |
| Componente que escala com contexto | Use `em` para herdar do pai |
| Valor que nunca deve mudar | Use `px` (raro, prefira rem) |
| Proporcao ao elemento pai | Use `%` |
| Prototipo rapido sem precisao | Nomes como `large` sao aceitaveis |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `font-size: large` em producao | `font-size: 1.25rem` |
| `font-size: 14px` para texto geral | `font-size: 0.875rem` |
| `em` sem saber o font-size do pai | `rem` quando o contexto do pai e incerto |
| Misturar px e rem sem razao | Escolha uma unidade padrao e mantenha |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `rem` nao resulta no tamanho esperado | Root element tem font-size diferente de 16px | Verifique se ha `html { font-size: ... }` alterando o base |
| `em` acumula tamanhos inesperados | Aninhamento de elementos com `em` causa multiplicacao | Use `rem` para evitar heranca cumulativa |
| Texto nao escala quando usuario aumenta zoom | Usando `px` em vez de unidades relativas | Substitua `px` por `rem` para respeitar preferencias do usuario |
| `font-size: large` renderiza diferente entre navegadores | Valores nomeados nao sao padronizados | Use valores numericos com `rem` para controle preciso |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre heranca de font-size, cadeia em vs rem, e valor padrao do root
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes