---
name: rs-discover-ajustando-fontes-dos-links
description: "Applies CSS link styling conventions when styling anchor elements or navigation links. Use when user asks to 'style links', 'remove underline', 'fix link fonts', 'adjust text-decoration', or 'set font-weight'. Enforces text-decoration removal, correct font-weight values, and specificity over shorthand names. Make sure to use this skill whenever styling anchor tags or navigation elements. Not for layout, flexbox, or general typography unrelated to links."
---

# Ajustando Fontes dos Links

> Ao estilizar links, seja especifico nos valores de font-weight e controle text-decoration explicitamente.

## Rules

1. **Remova text-decoration com `none`** — `text-decoration: none` no elemento `a`, porque links tem underline por padrao e isso polui visualmente botoes e navegacao
2. **Use font-weight numerico, nao nomes** — `font-weight: 500` nao `font-weight: bold`, porque o valor numerico e mais preciso e mapeia diretamente aos pesos importados do Google Fonts
3. **Nao repita valores padrao do navegador** — `font-size: 16px` e `line-height: 24px` ja sao padrao, nao declare se o valor desejado e o mesmo do browser
4. **Importe apenas os pesos que usa** — se trouxe Inter 400 e 500 do Google Fonts, use exatamente esses valores, porque pesos nao importados serao simulados pelo browser com resultado ruim
5. **Saiba que font-weight >= 500 equivale a bold** — acima de 400 e considerado bold, mas o valor numerico e preferivel por ser explicito

## How to write

### Estilizando links como botoes

```css
a {
  text-decoration: none;
  font-weight: 500;
}
```

### Valores de text-decoration disponiveis

```css
/* Remover decoracao */
text-decoration: none;

/* Linha embaixo (padrao de links) */
text-decoration: underline;

/* Linha no meio (texto riscado) */
text-decoration: line-through;

/* Linha em cima */
text-decoration: overline;
```

## Example

**Before (link com estilos padrao do browser):**
```css
a {
  font-size: 16px;       /* desnecessario — ja e padrao */
  line-height: 24px;     /* desnecessario — ja e padrao */
  font-weight: bold;     /* impreciso — qual peso exatamente? */
}
```

**After (com esta skill aplicada):**
```css
a {
  text-decoration: none;
  font-weight: 500;
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Link usado como botao/navegacao | Remover `text-decoration` e definir `font-weight` numerico |
| Valor CSS igual ao padrao do browser | Nao declarar — menos codigo, menos manutencao |
| Precisa de bold | Usar o valor numerico do peso importado (ex: 500, 600, 700) |
| Link dentro de paragrafo que precisa de underline | Manter `text-decoration: underline` explicitamente |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `font-weight: bold` (quando tem peso especifico) | `font-weight: 500` |
| `font-size: 16px` (se e o padrao) | *(nao declare)* |
| `line-height: 24px` (se e o padrao) | *(nao declare)* |
| Esquecer `text-decoration: none` em links de nav | `text-decoration: none` explicito |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre font-weight, text-decoration e boas praticas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes